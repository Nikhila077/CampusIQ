import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import {
  CalendarCheck,
  Calendar,
  GraduationCap,
  ClipboardList,
  Clock,
  Briefcase,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Plus,
  BookOpen,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Flame,
  Zap,
  Target,
  Check,
  Award
} from 'lucide-react';
import attendanceService from '../services/attendanceService.js';
import timetableService from '../services/timetableService.js';
import assignmentService from '../services/assignmentService.js';
import examService from '../services/examService.js';
import plannerService from '../services/plannerService.js';
import careerService from '../services/careerService.js';
import markService from '../services/markService.js';
import brainBoostService from '../services/brainBoostService.js';
import gamificationService from '../services/gamificationService.js';

export const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Real database states
  const [attendanceData, setAttendanceData] = useState({ subjects: [], overall: null });
  const [todayClasses, setTodayClasses] = useState([]);
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [plannerItems, setPlannerItems] = useState([]);
  const [careerReadiness, setCareerReadiness] = useState(null);
  const [performanceSummary, setPerformanceSummary] = useState(null);

  // Gamification & Brain Boost states
  const [gamification, setGamification] = useState({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    todayProgress: { completedCount: 0, dailyGoal: 3, percent: 0, completedActions: [] }
  });
  const [brainBoost, setBrainBoost] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [
        attRes,
        todayRes,
        asgRes,
        examRes,
        planRes,
        careerRes,
        marksRes,
        gameRes,
        boostRes
      ] = await Promise.allSettled([
        attendanceService.getSummary(),
        timetableService.getTodayClasses(),
        assignmentService.getAssignments({ status: 'pending' }),
        examService.getExams({ upcoming: 'true' }),
        plannerService.getPlan(),
        careerService.getReadiness(),
        markService.getMarks(),
        gamificationService.getSummary(),
        brainBoostService.getTodayQuestion()
      ]);

      if (attRes.status === 'fulfilled' && attRes.value?.success) {
        setAttendanceData(attRes.value.data);
      }
      if (todayRes.status === 'fulfilled' && todayRes.value?.success) {
        setTodayClasses(todayRes.value.data?.slots || []);
      }
      if (asgRes.status === 'fulfilled' && asgRes.value?.success) {
        setPendingAssignments(asgRes.value.data?.assignments || []);
      }
      if (examRes.status === 'fulfilled' && examRes.value?.success) {
        setUpcomingExams(examRes.value.data?.exams || []);
      }
      if (planRes.status === 'fulfilled' && planRes.value?.success) {
        setPlannerItems(planRes.value.data?.actionPlan || []);
      }
      if (careerRes.status === 'fulfilled' && careerRes.value?.success) {
        setCareerReadiness(careerRes.value.data);
      }
      if (marksRes.status === 'fulfilled' && marksRes.value?.success) {
        setPerformanceSummary(marksRes.value.data?.summary || null);
      }
      if (gameRes.status === 'fulfilled' && gameRes.value?.success) {
        setGamification(gameRes.value.data);
      }
      if (boostRes.status === 'fulfilled' && boostRes.value?.success) {
        setBrainBoost(boostRes.value.data);
        if (boostRes.value.data.completedToday) {
          setAnswerFeedback({
            alreadyCompleted: true,
            explanation: boostRes.value.data.question?.explanation
          });
        }
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleAnswerSubmit = async (optionIdx) => {
    if (!brainBoost?.question?._id || brainBoost?.completedToday || submittingAnswer) return;
    try {
      setSubmittingAnswer(true);
      setSelectedOption(optionIdx);
      const res = await brainBoostService.submitAnswer(brainBoost.question._id, optionIdx);
      if (res?.success) {
        setAnswerFeedback(res.data);
        // Refresh gamification summary
        const gRes = await gamificationService.getSummary();
        if (gRes?.success) setGamification(gRes.data);
      }
    } catch (err) {
      console.error('Error submitting brain boost answer:', err);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const hasSubjects = attendanceData.subjects && attendanceData.subjects.length > 0;
  const criticalAttendance = (attendanceData.subjects || []).filter(
    (s) => s.currentPercent < s.minPercent
  );

  // Derive "Your Next Best Actions" (3 to 5 highest priority recommendations)
  const nextBestActions = [];

  // 1. Critical/At Risk Attendance
  if (criticalAttendance.length > 0) {
    const topCritical = criticalAttendance[0];
    nextBestActions.push({
      id: `att_${topCritical.subject._id}`,
      title: `Attend ${topCritical.subject.name}`,
      category: 'Attendance Shortage',
      priority: 'critical',
      reason: `Current attendance is ${topCritical.currentPercent}% (below ${topCritical.minPercent}% requirement). Attend next ${topCritical.recoveryNeeded} classes to recover.`,
      actionUrl: `/attendance/simulate?subjectId=${topCritical.subject._id}`,
      actionLabel: 'Run What-If'
    });
  }

  // 2. Urgent Assignment
  if (pendingAssignments.length > 0) {
    const topAsg = pendingAssignments[0];
    const diffDays = Math.ceil((new Date(topAsg.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    nextBestActions.push({
      id: `asg_${topAsg._id}`,
      title: `Submit ${topAsg.title}`,
      category: 'Coursework Deadline',
      priority: diffDays <= 1 ? 'critical' : 'high',
      reason: `Due ${diffDays <= 0 ? 'today' : diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`} for ${topAsg.subjectId?.name || 'coursework'}. Submitting awards +15 XP.`,
      actionUrl: '/assignments',
      actionLabel: 'View Deliverable'
    });
  }

  // 3. Daily Brain Boost
  if (!brainBoost?.completedToday && brainBoost?.question) {
    nextBestActions.push({
      id: 'brain_boost_action',
      title: `Solve Today's Brain Boost (${brainBoost.question.category})`,
      category: 'Skill Challenge',
      priority: 'high',
      reason: `Personalized challenge for ${user?.targetRole || 'general CS'}. Complete to earn +10 XP and maintain your 🔥 streak.`,
      actionUrl: '#brain-boost-card',
      actionLabel: 'Solve Challenge'
    });
  }

  // 4. Upcoming Exam
  if (upcomingExams.length > 0) {
    const topExam = upcomingExams[0];
    const diffDays = Math.ceil((new Date(topExam.date) - new Date()) / (1000 * 60 * 60 * 24));
    nextBestActions.push({
      id: `exam_${topExam._id}`,
      title: `Prepare for ${topExam.subjectId?.name || 'Subject'} ${topExam.examType.toUpperCase()}`,
      category: 'Exam Milestone',
      priority: diffDays <= 4 ? 'high' : 'medium',
      reason: `${topExam.examType.toUpperCase()} scheduled in ${diffDays} day${diffDays === 1 ? '' : 's'}${topExam.venue ? ` at ${topExam.venue}` : ''}. Review syllabus early.`,
      actionUrl: '/exams',
      actionLabel: 'Exam Syllabus'
    });
  }

  // 5. Safe absence buffer reminder or planner task
  if (plannerItems.length > 0 && nextBestActions.length < 5) {
    const topPlan = plannerItems[0];
    if (!nextBestActions.some((a) => a.title.includes(topPlan.title))) {
      nextBestActions.push({
        id: `plan_${topPlan.id}`,
        title: topPlan.title,
        category: 'Planner Priority',
        priority: topPlan.priority || 'medium',
        reason: topPlan.reason,
        actionUrl: topPlan.actionUrl || '/planner',
        actionLabel: 'Planner'
      });
    }
  }

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Top Welcome & Command Header */}
      <div className="relative rounded-3xl border border-[#3B8F83]/30 bg-gradient-to-r from-[#102A2A] via-[#143333] to-[#102A2A] p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#3B8F83]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3B8F83]/15 text-[#3B8F83] border border-[#3B8F83]/30">
                Command Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="text-[#3B8F83]">
                {user?.name || 'Student'}
              </span>{' '}
              👋
            </h1>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {criticalAttendance.length > 0
                ? `⚠️ Attention: You have ${criticalAttendance.length} subject${criticalAttendance.length > 1 ? 's' : ''} currently below the minimum attendance requirement.`
                : 'All your academic standing indicators are currently in healthy standing.'}
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-lg shadow-[#3B8F83]/20 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/attendance/simulate"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#3B8F83]/50 text-slate-300 text-xs font-semibold transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B8F83]" />
              <span>Simulator</span>
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Planner</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">
          Gathering personalized academic data...
        </div>
      ) : !hasSubjects ? (
        /* Empty State: Guide user to add subjects */
        <div className="p-12 rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-4 max-w-2xl mx-auto">
          <BookOpen className="w-12 h-12 text-[#3B8F83] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">No Subjects Configured Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              StudentLens is powered by your real curriculum. Add your subjects to unlock the Smart Attendance Engine, daily timetable schedule, and prioritized academic planner.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-lg shadow-[#3B8F83]/20 transition-all"
          >
            <span>Add Subjects in Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Real Connected Dashboard */
        <div className="space-y-6">
          {/* Top 4 KPI Metrics Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Overall Attendance */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Overall Attendance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-white">
                    {attendanceData.overall?.overallPercent || 100}%
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      attendanceData.overall?.overallStatus === 'Safe'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {attendanceData.overall?.overallStatus || 'Safe'}
                  </span>
                </div>
              </div>
              <Link
                to="/attendance"
                className="text-[11px] text-[#3B8F83] hover:underline flex items-center gap-1 mt-3"
              >
                <span>View buffer breakdown</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Streak & Daily Goals */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">StudentLens Streak</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-400 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-amber-400/20" />
                    <span>{gamification.currentStreak || 0}d</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {gamification.todayProgress?.completedCount || 0}/{gamification.todayProgress?.dailyGoal || 3} today
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${gamification.todayProgress?.percent || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Student Level & XP */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Academic Standing</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-[#3B8F83] flex items-center gap-1">
                    <Zap className="w-5 h-5 fill-[#3B8F83]/20" />
                    <span>Lvl {gamification.level || 1}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {gamification.xp || 0} XP
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3B8F83] h-full rounded-full transition-all duration-300"
                    style={{ width: `${gamification.levelProgress?.percent || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Career Readiness */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Career Skill Match</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">
                  {careerReadiness?.readinessScore || 0}%
                </span>
              </div>
              <Link
                to="/career"
                className="text-[11px] text-[#3B8F83] hover:underline flex items-center gap-1 mt-3"
              >
                <span>Role: {careerReadiness?.targetRole || 'Select Role'}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* "YOUR NEXT BEST ACTIONS" Priority Card */}
          <div className="bg-slate-900/50 border border-[#3B8F83]/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Your Next Best Actions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Calculated in real-time from attendance urgency, approaching deadlines, and exam proximity.
                  </p>
                </div>
              </div>
              <Link
                to="/planner"
                className="text-xs font-semibold text-[#3B8F83] hover:text-[#327a70] flex items-center gap-1"
              >
                <span>Full Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nextBestActions.map((action, idx) => (
                <div
                  key={action.id}
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    action.priority === 'critical'
                      ? 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                      : action.priority === 'high'
                      ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {action.category}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          action.priority === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : action.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-[#3B8F83]/20 text-[#3B8F83]'
                        }`}
                      >
                        {action.priority}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-white">{action.title}</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{action.reason}</p>
                  </div>

                  {action.actionUrl && (
                    <div className="pt-2 border-t border-slate-800/60 flex justify-end">
                      {action.actionUrl.startsWith('#') ? (
                        <a
                          href={action.actionUrl}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B8F83] hover:text-[#327a70]"
                        >
                          <span>{action.actionLabel || 'Take Action'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link
                          to={action.actionUrl}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B8F83] hover:text-[#327a70]"
                        >
                          <span>{action.actionLabel || 'Take Action'}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Attendance Health & Daily Brain Boost */}
            <div className="lg:col-span-8 space-y-6">
              {/* Daily Brain Boost Interactive Card */}
              <div
                id="brain-boost-card"
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        Daily Brain Boost
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {brainBoost?.question
                          ? `Category: ${brainBoost.question.category} • Target: ${user?.targetRole || 'Software Engineer'}`
                          : 'Daily technical challenge'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    +10 XP
                  </span>
                </div>

                {!brainBoost?.question ? (
                  <p className="text-xs text-slate-400 py-3 text-center">
                    Loading today's challenge...
                  </p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      {brainBoost.question.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {brainBoost.question.options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect =
                          answerFeedback && answerFeedback.correctAnswer === idx;

                        let style = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900';
                        if (answerFeedback) {
                          if (isCorrect) {
                            style = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold';
                          } else if (isSelected && !answerFeedback.correct) {
                            style = 'bg-red-950/40 border-red-500/60 text-red-300';
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={Boolean(answerFeedback) || submittingAnswer}
                            onClick={() => handleAnswerSubmit(idx)}
                            className={`p-3 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${style}`}
                          >
                            <span>{opt}</span>
                            {answerFeedback && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {answerFeedback && (
                      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <span
                          className={`font-bold block ${
                            answerFeedback.correct || answerFeedback.alreadyCompleted
                              ? 'text-emerald-400'
                              : 'text-red-400'
                          }`}
                        >
                          {answerFeedback.correct
                            ? '✅ Correct! +10 XP awarded & streak maintained.'
                            : answerFeedback.alreadyCompleted
                            ? '✅ Completed for today!'
                            : `❌ Incorrect. Correct answer: ${
                                brainBoost.question.options[answerFeedback.correctAnswer]
                              }`}
                        </span>
                        {answerFeedback.explanation && (
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {answerFeedback.explanation}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Subject Attendance Intelligence Spotlight with [Run What-If] */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#3B8F83]" />
                      Attendance Safety Buffers
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Safe absences remaining before falling below institutional requirements.
                    </p>
                  </div>
                  <Link
                    to="/attendance"
                    className="text-xs font-semibold text-[#3B8F83] hover:text-[#327a70]"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {attendanceData.subjects.map((item) => (
                    <div
                      key={item.subject._id}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate max-w-[150px]">
                            {item.subject.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              item.currentPercent >= item.minPercent
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {item.currentPercent}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'Safe'
                                ? 'bg-[#3B8F83]'
                                : item.status === 'At Risk'
                                ? 'bg-amber-400'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, item.currentPercent)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {item.currentPercent >= item.minPercent ? (
                            <span className="text-emerald-300 font-medium">
                              Buffer: {item.safeAbsenceBuffer} {item.safeAbsenceBuffer === 1 ? 'class' : 'classes'}
                            </span>
                          ) : (
                            <span className="text-red-400 font-medium">
                              Need {item.recoveryNeeded} to recover
                            </span>
                          )}
                        </span>
                        <Link
                          to={`/attendance/simulate?subjectId=${item.subject._id}`}
                          className="px-2 py-0.5 rounded bg-[#3B8F83]/10 hover:bg-[#3B8F83]/20 text-[#3B8F83] text-[10px] font-semibold border border-[#3B8F83]/30 transition-all"
                        >
                          Run What-If
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Today's Schedule & Milestones */}
            <div className="lg:col-span-4 space-y-6">
              {/* Today's Classes */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#3B8F83]" />
                    Today's Classes
                  </h3>
                  <Link to="/timetable" className="text-[11px] text-[#3B8F83] hover:underline">
                    Schedule
                  </Link>
                </div>

                {todayClasses.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No classes scheduled for today.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {todayClasses.map((c) => (
                      <div
                        key={c._id}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                      >
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {c.subjectId?.name || 'Class'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.startTime} - {c.endTime} {c.room && `• Room ${c.room}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upcoming Exams Countdown */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    Upcoming Exams
                  </h3>
                  <Link to="/exams" className="text-[11px] text-[#3B8F83] hover:underline">
                    View
                  </Link>
                </div>

                {upcomingExams.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    No upcoming exams scheduled.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upcomingExams.slice(0, 3).map((e) => {
                      const diffDays = Math.ceil(
                        (new Date(e.date) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div
                          key={e._id}
                          className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {e.subjectId?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">
                              {e.examType}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-yellow-400 font-mono">
                            {diffDays <= 0 ? 'Today' : `In ${diffDays}d`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Upcoming Assignments */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-yellow-400" />
                    Pending Deliverables
                  </h3>
                  <Link to="/assignments" className="text-[11px] text-[#3B8F83] hover:underline">
                    View
                  </Link>
                </div>

                {pendingAssignments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    All coursework submitted!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pendingAssignments.slice(0, 3).map((a) => (
                      <div
                        key={a._id}
                        className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between"
                      >
                        <div className="truncate max-w-[180px]">
                          <span className="text-xs font-bold text-white block truncate">
                            {a.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {a.subjectId?.name || 'Coursework'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300">
                          {new Date(a.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
