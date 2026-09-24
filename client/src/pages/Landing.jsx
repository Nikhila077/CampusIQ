import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CalendarCheck,
  Clock,
  Briefcase,
  CheckCircle2,
  Lock,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Dynamic ambient gradient backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-60 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -left-60 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-indigo-400">IQ</span></span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold">
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-sm backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personalized Student Decision-Support Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-slate-400 font-normal">Phase 1 Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Your Student Life, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Smarter.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            CampusIQ turns academic and career information into personalized insights, useful calculations and actionable priorities.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-indigo-500/30">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8">
                Login to Account
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>JWT HttpOnly Cookie Auth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>MongoDB Atlas Cloud</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Bcrypt 12 Salt Rounds</span>
            </div>
          </div>
        </div>

        {/* UI Product Mockup / Dashboard Preview */}
        <div className="mt-16 w-full max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-2xl p-3 sm:p-5 shadow-2xl shadow-indigo-950/50 text-left">
          {/* Mockup Window Chrome */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-slate-400 font-mono">campusiq.internal/dashboard</span>
            </div>
            <Badge variant="primary" className="text-[10px]">Architecture Preview</Badge>
          </div>

          {/* Mockup Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mockup Card 1: Decision Support Concept */}
            <div className="md:col-span-2 rounded-xl bg-slate-950/70 border border-slate-800/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">Core Decision Engine</span>
                  <h4 className="text-base font-bold text-white mt-0.5">Calculated Insights vs. Raw Data</h4>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">Concept Model</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Traditional College ERP</p>
                  <p className="text-sm font-semibold text-slate-300 mt-1">"Attendance: 74.2%"</p>
                  <p className="text-[11px] text-red-400/90 mt-1">Passive data, no actionable next steps.</p>
                </div>

                <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
                  <p className="text-xs text-indigo-300 font-medium">CampusIQ Decision Support</p>
                  <p className="text-sm font-bold text-indigo-200 mt-1">"Safe to miss 2 classes" OR "Attend next 3 classes to recover 75%"</p>
                  <p className="text-[11px] text-emerald-400 mt-1">Automated buffer calculation.</p>
                </div>
              </div>
            </div>

            {/* Mockup Card 2: Security & Session Status */}
            <div className="rounded-xl bg-slate-950/70 border border-slate-800/70 p-5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Platform Foundation</span>
                <h4 className="text-base font-bold text-white mt-0.5">Phase 1 Milestone</h4>
                <div className="space-y-2 mt-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>HttpOnly Cookie Session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>MongoDB Atlas Mongoose</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>React Router Protected Routes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Persistent Auth via /me</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                System operational & verified.
              </div>
            </div>
          </div>
        </div>

        {/* Feature Preview Section */}
        <section className="mt-28 max-w-6xl mx-auto w-full text-center">
          <div className="space-y-3 mb-12">
            <Badge variant="purple" className="text-xs px-3 py-1 font-semibold">
              Future Modules Roadmap
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed For High-Performance Students
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              CampusIQ is engineered to systematically convert student information into clear, prioritized action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Smart Attendance
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Turn attendance data into useful calculations and insights. Compute exact absence buffers and recovery schedules.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                Phase 4 Module
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Academic Planning
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Understand what needs attention next. Priority-aware scheduling connecting deadlines, exam countdowns, and priorities.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                Phase 7 Module
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Career Readiness
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Track skills and identify areas to improve. Measure readiness scores and discover relevant internships and hackathons.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Phase 8 Module
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Personalized Insights
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Turn student data into actionable information. Context-aware notifications to prevent attendance penalties and missed milestones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                Phase 3 Module
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/60 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-300">CampusIQ</span>
            <span>— Personalized Student Decision-Support Platform</span>
          </div>
          <div>
            <span>Phase 1 Architecture Foundation • Node.js, Express, MongoDB Atlas, React & Tailwind</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
