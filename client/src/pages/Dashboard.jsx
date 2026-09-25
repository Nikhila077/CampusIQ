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
    <div className="space-y-5 pb-10 max-w-7xl mx-auto">
      {/* 1. TOP: Welcome / Command Center Section */}
      <div className="relative rounded-2xl border border-[#102A2A] bg-[#102A2A] text-white p-4 sm:p-5 shadow-sm overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#3B8F83]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3B8F83]/20 text-[#E8F5F2] border border-[#3B8F83]/40">
                Command Center
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {new Date().toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {getGreeting()},{' '}
              <span className="text-[#3B8F83]">
                {user?.name || 'Student'}
              </span>{' '}
              👋
            </h1>

            <p className="text-xs text-slate-200 max-w-xl leading-relaxed">
              {criticalAttendance.length > 0
                ? `⚠️ Action Required: You have ${criticalAttendance.length} subject${criticalAttendance.length > 1 ? 's' : ''} below the institutional requirement. Check recovery steps below.`
                : 'All your academic standing indicators are in healthy standing. Smart Attendance safety buffers are active.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/attendance/simulate"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143333] hover:bg-[#1a4040] text-[#E8F5F2] border border-[#3B8F83]/40 text-xs font-semibold transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-[#3B8F83]" />
              <span>Simulator</span>
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143333] hover:bg-[#1a4040] text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Planner</span>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          Loading student decision-support data...
        </div>
      ) : !hasSubjects ? (
        /* Empty State: Guide user to add subjects */
        <div className="p-10 rounded-2xl border border-dashed border-slate-300 bg-white text-center space-y-3.5 max-w-2xl mx-auto shadow-xs">
          <BookOpen className="w-12 h-12 text-[#3B8F83] mx-auto" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#102A2A]">No Subjects Configured Yet</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              StudentLens is powered by your real curriculum. Add your semester subjects to unlock the Smart Attendance Engine, daily schedule, and prioritized academic planner.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Add Subjects in Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* 2. SECOND: 4 Core Status KPI Cards */
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* KPI 1: Overall Attendance */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Overall Attendance</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#102A2A]">
                    {attendanceData.overall?.overallPercent || 100}%
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                      attendanceData.overall?.overallStatus === 'Safe'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {attendanceData.overall?.overallStatus || 'Safe'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {attendanceData.overall?.totalAttended || 0} / {attendanceData.overall?.totalConducted || 0} classes attended
                </p>
              </div>
              <Link
                to="/attendance"
                className="text-xs font-semibold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1 mt-3"
              >
                <span>Buffer breakdown</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* KPI 2: Academic Standing & XP */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Academic Standing</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#102A2A] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#3B8F83] fill-[#3B8F83]/20" />
                    <span>Lvl {gamification.level || 1}</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#3B8F83] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {gamification.xp || 0} XP
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {gamification.levelProgress?.percent || 0}% toward Level {(gamification.level || 1) + 1}
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3B8F83] h-full rounded-full transition-all duration-300"
                    style={{ width: `${gamification.levelProgress?.percent || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* KPI 3: Career Readiness */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">Career Readiness</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#102A2A]">
                    {careerReadiness?.readinessScore || 0}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 truncate">
                  Role: {careerReadiness?.targetRole || user?.targetRole || 'Software Engineer'}
                </p>
              </div>
              <Link
                to="/career"
                className="text-xs font-semibold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1 mt-3"
              >
                <span>Career roadmap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* KPI 4: Productivity Streak */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-700 block">StudentLens Streak</span>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-2xl font-black text-[#102A2A] flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-[#3B8F83]/20 text-[#3B8F83]" />
                    <span>{gamification.currentStreak || 0}d</span>
                  </span>
                  <span className="text-[10px] text-slate-700 font-mono font-bold">
                    {gamification.todayProgress?.completedCount || 0}/{gamification.todayProgress?.dailyGoal || 3} today
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Daily goals completed today
                </p>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3B8F83] h-full rounded-full transition-all duration-300"
                    style={{ width: `${gamification.todayProgress?.percent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. MAIN HERO ROW: Smart Attendance Intelligence (7 cols) + Next Best Actions (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 cols: Smart Attendance Engine (HERO Section) */}
            <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-[#3B8F83]" />
                      <span>Smart Attendance Intelligence</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#3B8F83] border border-teal-200 text-[10px] font-bold">
                        Hero Engine
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Deterministic safety buffers & recovery targets calculated in real-time.
                    </p>
                  </div>
                  <Link
                    to="/attendance"
                    className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1 shrink-0"
                  >
                    <span>Full Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Status Bar Summary */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                    Safe: {attendanceData.overall?.safeCount || 0} subjects
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                    Attention Needed: {(attendanceData.overall?.atRiskCount || 0) + (attendanceData.overall?.criticalCount || 0)} subjects
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 border border-teal-200 font-medium">
                    75% requirement
                  </span>
                </div>

                {/* Per-Subject Intelligence Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  {attendanceData.subjects.slice(0, 4).map((item) => (
                    <div
                      key={item.subject._id}
                      className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-[#3B8F83]/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#102A2A] truncate max-w-[130px]">
                            {item.subject.name}
                          </span>
                          <span
                            className={`text-[11px] font-black ${
                              item.currentPercent >= item.minPercent
                                ? 'text-emerald-700'
                                : 'text-red-600'
                            }`}
                          >
                            {item.currentPercent}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.status === 'Safe'
                                ? 'bg-[#3B8F83]'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, item.currentPercent)}%` }}
                          />
                        </div>

                        {/* Attendance Decision Indicator */}
                        <div className="mt-2.5">
                          {item.currentPercent >= item.minPercent ? (
                            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-start gap-1.5 text-[11px] text-emerald-900 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                              <span>Buffer: +{item.safeAbsenceBuffer} {item.safeAbsenceBuffer === 1 ? 'class' : 'classes'} can be missed safely</span>
                            </div>
                          ) : (
                            <div className="p-2 rounded-lg bg-red-50 border border-red-200/90 flex items-start gap-1.5 text-[11px] text-red-900 font-semibold">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                              <span>Recovery: Attend next {item.recoveryNeeded} classes consecutively</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">
                          {item.attended}/{item.conducted} classes
                        </span>
                        <Link
                          to={`/attendance/simulate?subjectId=${item.subject._id}`}
                          className="font-bold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Run What-If</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 cols: Recommended Actions (Next Best Actions) */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#3B8F83]" />
                      <span>Next Best Actions</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200 text-[10px] font-bold">
                        Priority Guidance
                      </span>
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Prescribed action plan prioritized by immediate academic urgency.
                    </p>
                  </div>
                  <Link
                    to="/planner"
                    className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1 shrink-0"
                  >
                    <span>Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-2.5 mt-3.5">
                  {nextBestActions.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-600">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1.5" />
                      All coursework, attendance, and exam prep are currently on track!
                    </div>
                  ) : (
                    nextBestActions.slice(0, 3).map((action) => (
                      <div
                        key={action.id}
                        className={`p-3 rounded-xl border flex flex-col justify-between gap-1.5 transition-all ${
                          action.priority === 'critical'
                            ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                            : 'bg-teal-50/30 border-teal-200/70 hover:border-teal-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                              {action.category}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                action.priority === 'critical'
                                  ? 'bg-red-100 text-red-900 border border-red-200'
                                  : 'bg-teal-100 text-teal-950 border border-teal-200'
                              }`}
                            >
                              {action.priority}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-[#102A2A] mt-1">{action.title}</h3>
                          <p className="text-[11px] text-slate-700 leading-relaxed mt-0.5">{action.reason}</p>
                        </div>

                        {action.actionUrl && (
                          <div className="pt-1.5 border-t border-slate-200/60 flex justify-end">
                            {action.actionUrl.startsWith('#') ? (
                              <a
                                href={action.actionUrl}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B8F83] hover:text-[#2d6f66]"
                              >
                                <span>{action.actionLabel || 'Take Action'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </a>
                            ) : (
                              <Link
                                to={action.actionUrl}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#3B8F83] hover:text-[#2d6f66]"
                              >
                                <span>{action.actionLabel || 'Take Action'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. THIRD TIER: Timetable & Academic Milestones (2 Columns: 6 cols / 6 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 6 cols: Today's Classes */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#3B8F83]" />
                    <span>Today's Classes</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Lectures and practical sessions scheduled for today.
                  </p>
                </div>
                <Link to="/timetable" className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66]">
                  Schedule →
                </Link>
              </div>

              <div className="mt-3.5 space-y-2">
                {todayClasses.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-600">
                    <Calendar className="w-7 h-7 text-slate-400 mx-auto mb-1.5" />
                    <p className="font-bold text-slate-800">No classes scheduled for today</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Your timetable will appear here when classes are active.</p>
                  </div>
                ) : (
                  todayClasses.map((c) => (
                    <div
                      key={c._id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#102A2A] block">
                          {c.subjectId?.name || 'Class'}
                        </span>
                        <span className="text-[11px] text-slate-600 font-mono">
                          {c.startTime} - {c.endTime} {c.room && `• Room ${c.room}`}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-200">
                        Scheduled
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right 6 cols: Coursework Deliverables & Upcoming Exams */}
            <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
              {/* Deliverables */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4 text-[#3B8F83]" />
                    <span>Pending Deliverables</span>
                  </h3>
                  <Link to="/assignments" className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66]">
                    View →
                  </Link>
                </div>

                <div className="mt-2.5 space-y-2">
                  {pendingAssignments.length === 0 ? (
                    <p className="text-xs text-slate-600 italic py-2">
                      All coursework submitted! No pending deadlines.
                    </p>
                  ) : (
                    pendingAssignments.slice(0, 2).map((a) => (
                      <div
                        key={a._id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                      >
                        <div className="truncate max-w-[200px]">
                          <span className="text-xs font-bold text-[#102A2A] block truncate">
                            {a.title}
                          </span>
                          <span className="text-[11px] text-slate-600">
                            {a.subjectId?.name || 'Coursework'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-teal-950 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                          Due {new Date(a.dueDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upcoming Exams */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#3B8F83]" />
                    <span>Upcoming Exams</span>
                  </h3>
                  <Link to="/exams" className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66]">
                    View →
                  </Link>
                </div>

                <div className="mt-2.5 space-y-2">
                  {upcomingExams.length === 0 ? (
                    <p className="text-xs text-slate-600 italic py-2">
                      No upcoming exams scheduled.
                    </p>
                  ) : (
                    upcomingExams.slice(0, 2).map((e) => {
                      const diffDays = Math.ceil(
                        (new Date(e.date) - new Date()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <div
                          key={e._id}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                        >
                          <div>
                            <span className="text-xs font-bold text-[#102A2A] block">
                              {e.subjectId?.name}
                            </span>
                            <span className="text-[11px] text-slate-600 capitalize">
                              {e.examType} {e.venue && `• ${e.venue}`}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-teal-950 font-mono bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                            {diffDays <= 0 ? 'Today' : `In ${diffDays}d`}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. FOURTH TIER: Daily Brain Boost (7 cols) + Smart Planner Progress (5 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left 7 cols: Daily Brain Boost Interactive Card */}
            <div
              id="brain-boost-card"
              className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      Daily Brain Boost
                    </h3>
                    <p className="text-xs text-slate-600">
                      {brainBoost?.question
                        ? `Category: ${brainBoost.question.category} • Target: ${user?.targetRole || 'Software Engineer'}`
                        : 'Daily technical challenge'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-teal-950 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  +10 XP
                </span>
              </div>

              {!brainBoost?.question ? (
                <p className="text-xs text-slate-600 py-3 text-center">
                  Loading today's challenge...
                </p>
              ) : (
                <div className="space-y-3.5">
                  <p className="text-xs sm:text-sm font-bold text-[#102A2A]">
                    {brainBoost.question.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {brainBoost.question.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect =
                        answerFeedback && answerFeedback.correctAnswer === idx;

                      let style = 'bg-slate-50 border-slate-200 text-slate-800 hover:border-[#3B8F83] hover:bg-teal-50/30';
                      if (answerFeedback) {
                        if (isCorrect) {
                          style = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                        } else if (isSelected && !answerFeedback.correct) {
                          style = 'bg-red-50 border-red-300 text-red-950';
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
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {answerFeedback && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <span
                        className={`font-bold block ${
                          answerFeedback.correct || answerFeedback.alreadyCompleted
                            ? 'text-emerald-800'
                            : 'text-red-700'
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
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {answerFeedback.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 5 cols: Smart Planner Priorities */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#3B8F83]" />
                    <span>Smart Planner Focus</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    High-leverage tasks to advance your academic goals.
                  </p>
                </div>
                <Link to="/planner" className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66]">
                  Planner →
                </Link>
              </div>

              <div className="space-y-2 mt-3.5">
                {plannerItems.length === 0 ? (
                  <p className="text-xs text-slate-600 italic py-6 text-center">
                    Add milestones or study goals in the Smart Planner to view priorities here.
                  </p>
                ) : (
                  plannerItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-[#102A2A] block">
                          {item.title}
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                      <Link
                        to={item.actionUrl || '/planner'}
                        className="text-[#3B8F83] hover:text-[#2d6f66] shrink-0 mt-0.5"
                        title="Go to task"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
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
