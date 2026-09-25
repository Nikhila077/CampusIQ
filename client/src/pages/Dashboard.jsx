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
  ChevronRight
} from 'lucide-react';
import attendanceService from '../services/attendanceService.js';
import timetableService from '../services/timetableService.js';
import assignmentService from '../services/assignmentService.js';
import examService from '../services/examService.js';
import plannerService from '../services/plannerService.js';
import careerService from '../services/careerService.js';
import markService from '../services/markService.js';

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
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
          marksRes
        ] = await Promise.allSettled([
          attendanceService.getSummary(),
          timetableService.getTodayClasses(),
          assignmentService.getAssignments({ status: 'pending' }),
          examService.getExams({ upcoming: 'true' }),
          plannerService.getPlan(),
          careerService.getReadiness(),
          markService.getMarks()
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
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const hasSubjects = attendanceData.subjects && attendanceData.subjects.length > 0;
  const criticalAttendance = (attendanceData.subjects || []).filter(
    (s) => s.currentPercent < s.minPercent
  );

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Welcome & Top Intelligence Header */}
      <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Decision Support Center
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-white">
                {user?.name || 'Student'}
              </span>
            </h1>

            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {criticalAttendance.length > 0
                ? `⚠️ Attention: You have ${criticalAttendance.length} subject${criticalAttendance.length > 1 ? 's' : ''} currently below minimum attendance.`
                : 'All your academic indicators are in healthy standing today.'}
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              to="/attendance"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/attendance/simulate"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold transition-all"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simulator</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Subjects</span>
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
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto" />
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">No Subjects Configured Yet</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              CampusIQ is powered by your real curriculum. Add your subjects to unlock the Smart Attendance Engine, daily timetable schedule, and prioritized academic planner.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>Add Subjects in Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Real Connected Dashboard */
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
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
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-3"
              >
                <span>View buffer breakdown</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Today's Classes */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Today's Classes</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {todayClasses.length}
                </span>
              </div>
              <Link
                to="/timetable"
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-3"
              >
                <span>Open timetable</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Pending Deliverables */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Pending Assignments</span>
                <span className="text-2xl font-black text-white mt-1 block">
                  {pendingAssignments.length}
                </span>
              </div>
              <Link
                to="/assignments"
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-3"
              >
                <span>Check deadlines</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Career Readiness */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block">Career Skill Match</span>
                <span className="text-2xl font-black text-indigo-400 mt-1 block">
                  {careerReadiness?.readinessScore || 0}%
                </span>
              </div>
              <Link
                to="/career"
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-3"
              >
                <span>Role: {careerReadiness?.targetRole || 'Select Role'}</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: "What Should I Pay Attention to Today?" Priorities */}
            <div className="lg:col-span-8 space-y-6">
              {/* Daily Prioritized Action Plan */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      What Should I Pay Attention to Today?
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Prioritized dynamically by attendance urgency, exam proximity, and deadlines.
                    </p>
                  </div>
                  <Link
                    to="/planner"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Full Planner →
                  </Link>
                </div>

                {plannerItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    No urgent academic issues detected!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {plannerItems.slice(0, 4).map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                          item.priority === 'critical'
                            ? 'bg-red-500/10 border-red-500/30'
                            : item.priority === 'high'
                            ? 'bg-orange-500/10 border-orange-500/30'
                            : 'bg-slate-950/60 border-slate-800/60'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">{item.title}</span>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                item.priority === 'critical'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                        </div>

                        {item.actionUrl && (
                          <Link
                            to={item.actionUrl}
                            className="shrink-0 p-1.5 text-indigo-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Action"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Subject Attendance Intelligence Spotlight */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-indigo-400" />
                      Attendance Safety Buffers
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Safe absences remaining before falling below institutional requirements.
                    </p>
                  </div>
                  <Link
                    to="/attendance"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {attendanceData.subjects.slice(0, 4).map((item) => (
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
                                ? 'bg-emerald-500'
                                : item.status === 'At Risk'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, item.currentPercent)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
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
                        <span className="text-[10px] text-slate-500">Min: {item.minPercent}%</span>
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
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    Today's Classes
                  </h3>
                  <Link to="/timetable" className="text-[11px] text-indigo-400 hover:underline">
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
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    Upcoming Exams
                  </h3>
                  <Link to="/exams" className="text-[11px] text-indigo-400 hover:underline">
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
                  <Link to="/assignments" className="text-[11px] text-indigo-400 hover:underline">
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
