import useAuth from '../hooks/useAuth.js';
import {
  CheckCircle2,
  CalendarCheck,
  Calendar,
  GraduationCap,
  BarChart3,
  Clock,
  Briefcase,
  Building2,
  Hash,
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export const Dashboard = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const futureModules = [
    {
      title: 'Smart Attendance Engine',
      description: 'Calculates exact safe absence buffer, recovery class requirements, and interactive what-if scenarios.',
      icon: CalendarCheck,
      phase: 'Phase 4',
      tag: 'Core Differentiator'
    },
    {
      title: 'Timetable & Class Schedule',
      description: 'Dynamic weekly schedule management with real-time slot tracking and class reminders.',
      icon: Calendar,
      phase: 'Phase 5',
      tag: 'Academic'
    },
    {
      title: 'Assignments & Exam Countdown',
      description: 'Centralized deadline management with countdown timers and submission status tracking.',
      icon: GraduationCap,
      phase: 'Phase 5',
      tag: 'Milestones'
    },
    {
      title: 'Visual Performance Analytics',
      description: 'Semester GPA trends, subject-level mark distributions, and visual progress charts via Recharts.',
      icon: BarChart3,
      phase: 'Phase 6',
      tag: 'Analytics'
    },
    {
      title: 'Smart Academic Planner',
      description: 'Priority-aware daily and weekly study scheduler combining attendance buffers and deadlines.',
      icon: Clock,
      phase: 'Phase 7',
      tag: 'Decision Engine'
    },
    {
      title: 'Career Readiness & Opportunities',
      description: 'Skill gap analysis, internship readiness scoring, and curated competitive programming & job feeds.',
      icon: Briefcase,
      phase: 'Phase 8',
      tag: 'Career'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary" className="text-[11px] font-semibold">
                CampusIQ Dashboard
              </Badge>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Session Authenticated
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {getGreeting()}, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Your account is authenticated successfully. Welcome to your personalized student decision-support foundation.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-1.5 min-w-[220px]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Active Session
            </span>
            <div className="text-xs font-medium text-slate-200 truncate">
              {user?.email}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>HttpOnly JWT Cookie</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Student Info & Phase 1 Foundation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Card */}
        <Card
          title="Student Profile Overview"
          subtitle="Registered academic identity"
          className="lg:col-span-1"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shadow-indigo-500/20">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">{user?.name}</h4>
                <p className="text-xs text-slate-400">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  College
                </span>
                <span className="font-medium text-slate-200 text-right max-w-[180px] truncate">
                  {user?.college || 'Not specified'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  Branch
                </span>
                <span className="font-medium text-slate-200 text-right max-w-[180px] truncate">
                  {user?.branch || 'Not specified'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  Academic Year
                </span>
                <span className="font-medium text-slate-200">
                  {user?.year ? `Year ${user.year}` : 'Year 1'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Semester
                </span>
                <span className="font-medium text-slate-200">
                  Semester {user?.semester || 1}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-blue-400" />
                  Roll Number
                </span>
                <span className="font-medium text-slate-200">
                  {user?.rollNumber || 'Not specified'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Phase 1 Verification Checklist */}
        <Card
          title="Phase 1 Foundation"
          subtitle="Approved architectural deliverables status"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">React 19 + Tailwind CSS</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Vite modern bundling, custom dark palette and responsive layout.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Express + MongoDB Atlas</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Mongoose schema validation, isolated user models, and error handling.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">JWT Authentication</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cryptographic bcrypt hashing (12 salt rounds) and HttpOnly token cookie.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Protected Routes</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Redirects unauthenticated visitors to login; guards auth pages.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 sm:col-span-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-200">Persistent Login (/api/auth/me)</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Page refreshes automatically restore user identity via verified HttpOnly cookie.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Future Modules Section (Coming Soon) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Upcoming Decision Support Modules
            </h2>
            <p className="text-xs text-slate-400">
              Future phase roadmap per the approved architecture plan.
            </p>
          </div>
          <Badge variant="default" className="text-xs">
            Phases 2 – 10
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {futureModules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.title}
                className="relative rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-5 flex flex-col justify-between hover:border-slate-700/80 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      Coming Soon
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">{module.tag}</span>
                  <span className="text-indigo-400 font-semibold">{module.phase}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
