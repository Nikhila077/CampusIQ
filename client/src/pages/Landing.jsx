import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database,
  CalendarCheck,
  Clock
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import LightPillar from '../components/LightPillar.jsx';
import { StudentLensLogo } from '../components/shared/StudentLensLogo.jsx';

export const Landing = () => {
  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col selection:bg-teal-700 selection:text-white relative">
      {/* ================================================================ */}
      {/* HERO SECTION WITH EXACT LIGHTPILLAR BACKGROUND                   */}
      {/* ================================================================ */}
      <section className="hero relative overflow-hidden w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[780px] flex flex-col justify-between">
        {/* LightPillar: position: absolute, inset: 0, z-index: 0 */}
        <div className="absolute inset-0 z-0">
          <LightPillar
            topColor="#F4F7F5"
            bottomColor="#3B8F83"
            intensity={0.8}
            rotationSpeed={0.2}
            glowAmount={0.003}
            pillarWidth={3.0}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={0}
            interactive={true}
            mixBlendMode="normal"
            quality="high"
            lightMode={true}
          />
        </div>

        {/* Navigation Header: position: relative, z-index: 10 */}
        <header className="relative z-10 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <StudentLensLogo />
            </Link>

            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-900/5">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="font-semibold bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-sm border-0">
                  Signup
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Foreground Content: position: relative, z-index: 1 */}
        <div className="relative z-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 flex flex-col items-center justify-center text-center space-y-6">
          {/* Core Concept Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-teal-700/20 text-teal-900 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#3B8F83]"></span>
            <span>Personalized Student Decision-Support Platform</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Student Data → Analysis → Insight → Recommended Action</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#102A2A] leading-[1.1]">
            Student<span className="text-[#3B8F83]">Lens</span>
          </h1>

          {/* Subtitle / Positioning */}
          <p className="text-lg sm:text-xl font-medium text-slate-700 max-w-2xl mx-auto">
            Personalized Student Decision-Support Platform
          </p>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            StudentLens transforms fragmented academic records into clear calculations, safe absence buffers, prioritized study schedules, and career readiness.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-lg shadow-teal-900/10 border-0">
                Signup
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8 border border-slate-300 bg-white/90 hover:bg-white text-slate-800 shadow-sm">
                Login
              </Button>
            </Link>
          </div>

          {/* Security & Reliability Pillars */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#3B8F83]" />
              <span>Isolated Student Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#3B8F83]" />
              <span>Real MongoDB Atlas Backend</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#3B8F83]" />
              <span>JWT & HttpOnly Session Security</span>
            </div>
          </div>
        </div>

        {/* Bottom subtle edge divider */}
        <div className="relative z-10 w-full h-8 bg-gradient-to-b from-transparent to-[#F4F7F5]" />
      </section>

      {/* ================================================================ */}
      {/* COMMAND CENTER LIVE PREVIEW MOCKUP                              */}
      {/* ================================================================ */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-20 w-full">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-xl shadow-slate-900/5 text-left">
          {/* Window Chrome */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="ml-3 text-xs text-slate-500 font-mono">studentlens.internal/command-center</span>
            </div>
            <span className="text-[11px] font-semibold text-[#3B8F83] bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
              Live Decision Feed
            </span>
          </div>

          {/* Top Command Strip Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Overall Attendance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">83.5%</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Safe
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Daily Actions</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">4 / 4</span>
                <span className="text-[10px] font-semibold text-slate-500">Scheduled</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Next Exam</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-slate-900">In 4 Days</span>
                <span className="text-[10px] text-slate-500">DBMS Midterm</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] text-slate-500 block font-medium">Career Readiness</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#3B8F83]">76%</span>
                <span className="text-[10px] text-slate-500">Software Eng.</span>
              </div>
            </div>
          </div>

          {/* Action Priorities Preview */}
          <div className="rounded-xl bg-white border border-slate-200/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#3B8F83]" />
                Next Best Actions (Live Decision Support)
              </span>
              <span className="text-[11px] text-slate-400">Deterministic calculation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-red-50/70 border border-red-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-900">Attend OS Class</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">Critical</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  Attendance is 74% (below 75% minimum). Attend next 2 classes to restore safe standing.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900">Submit DBMS Assignment</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">High</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  Normalization problem set due tomorrow. Complete on time to avoid coursework penalties.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-900">Prepare AI Internal</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">Prep</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                  Exam scheduled in 8 days. Heuristics & Adversarial search high-weight topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 2: WHY STUDENTLENS (TRADITIONAL ERP VS STUDENTLENS)       */}
      {/* ================================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-24">
        <div className="space-y-3 mb-12">
          <Badge variant="secondary" className="text-xs px-3 py-1 font-semibold text-[#3B8F83] bg-teal-50 border border-teal-200">
            The StudentLens Paradigm
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Traditional Portals Fall Short
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Standard college portals present passive numbers. StudentLens calculates what those numbers mean and gives you a clear course of action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Traditional Portal Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Traditional ERP</span>
              <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                Passive Metric
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Subject Attendance</span>
              <p className="text-3xl font-black text-red-600 mt-1">74.07%</p>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                No breakdown. No safety buffer. The student does not know if they are eligible for exams or how many classes are needed to get safe.
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> No safe absence buffer calculation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> No recovery schedule when below threshold
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-500 font-bold">✕</span> Disconnected from daily timetable priorities
              </li>
            </ul>
          </div>

          {/* StudentLens Decision Engine Card */}
          <div className="rounded-2xl border border-teal-200 bg-white p-6 space-y-4 shadow-lg shadow-teal-900/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3B8F83]">StudentLens Engine</span>
              <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-xs border border-teal-200 font-semibold">
                Decision Support
              </span>
            </div>

            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/80">
              <div className="flex items-center justify-between">
                <span className="text-xs text-teal-900 font-semibold">Operating Systems (75% Required)</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                  At Risk
                </span>
              </div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-3xl font-black text-slate-900">74.07%</span>
                <span className="text-xs font-bold text-red-600">
                  Need 2 classes to recover 75%
                </span>
              </div>
              <p className="text-xs text-teal-800 font-medium mt-2">
                Today's Priority: Attend OS lecture at 09:00 AM (Room LHC-101)
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3B8F83] shrink-0" />
                <span>Precise safe absence buffer and recovery countdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3B8F83] shrink-0" />
                <span>Interactive what-if simulator for planned absences</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3B8F83] shrink-0" />
                <span>Integrated with Smart Planner and daily reminders</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 3: SMART ATTENDANCE ENGINE                               */}
      {/* ================================================================ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-24">
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] text-slate-600 font-medium shadow-sm">
            <CalendarCheck className="w-3.5 h-3.5 text-[#3B8F83]" />
            <span>Deterministic Attendance Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Smart Attendance Engine
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Mathematical formulas evaluate standing, calculate maximum safe absences, and determine the exact number of sessions required to recover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {/* Subject 1: AI */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Artificial Intelligence</h4>
                <span className="text-xs font-bold text-emerald-600">84.0%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#3B8F83] h-full rounded-full" style={{ width: '84%' }} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Attended / Held:</span>
                  <span className="text-slate-900 font-mono font-medium">21 / 25</span>
                </div>
                <div className="flex justify-between">
                  <span>Institutional Min:</span>
                  <span className="text-slate-900 font-mono font-medium">75%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">Safe buffer: 3 classes</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Safe</span>
            </div>
          </div>

          {/* Subject 2: DBMS */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">DBMS</h4>
                <span className="text-xs font-bold text-emerald-600">78.6%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#3B8F83] h-full rounded-full" style={{ width: '78.6%' }} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Attended / Held:</span>
                  <span className="text-slate-900 font-mono font-medium">22 / 28</span>
                </div>
                <div className="flex justify-between">
                  <span>Institutional Min:</span>
                  <span className="text-slate-900 font-mono font-medium">75%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">Safe buffer: 1 class</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Safe</span>
            </div>
          </div>

          {/* Subject 3: OS (At Risk) */}
          <div className="p-5 rounded-2xl bg-white border border-red-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Operating Systems</h4>
                <span className="text-xs font-bold text-red-600">74.1%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '74.1%' }} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Attended / Held:</span>
                  <span className="text-slate-900 font-mono font-medium">20 / 27</span>
                </div>
                <div className="flex justify-between">
                  <span>Institutional Min:</span>
                  <span className="text-slate-900 font-mono font-medium">75%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between text-[11px]">
              <span className="text-red-700 font-semibold">Need 2 classes</span>
              <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-bold">At Risk</span>
            </div>
          </div>

          {/* Subject 4: Web Tech */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Web Technologies</h4>
                <span className="text-xs font-bold text-emerald-600">90.9%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div className="bg-[#3B8F83] h-full rounded-full" style={{ width: '90.9%' }} />
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Attended / Held:</span>
                  <span className="text-slate-900 font-mono font-medium">20 / 22</span>
                </div>
                <div className="flex justify-between">
                  <span>Institutional Min:</span>
                  <span className="text-slate-900 font-mono font-medium">75%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold">Safe buffer: 4 classes</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">Safe</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 4: SMART PLANNER ENGINE                                  */}
      {/* ================================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-24">
        <div className="space-y-3 mb-12">
          <Badge variant="secondary" className="text-xs px-3 py-1 font-semibold text-[#3B8F83] bg-teal-50 border border-teal-200">
            Action Prioritization Engine
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            "What Should I Focus on Today?"
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            StudentLens continuously correlates attendance shortages, approaching deadlines, and upcoming exam countdowns to produce an actionable plan.
          </p>
        </div>

        <div className="space-y-3 text-left max-w-3xl mx-auto">
          <div className="p-4 rounded-xl border border-red-200 bg-white flex items-start gap-3.5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Attend Operating Systems Lecture</h4>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  Priority 1
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong className="text-slate-800">Reason:</strong> OS attendance is 74.07%, below the configured 75% institutional minimum. Attending today's session immediately restores recovery velocity.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-white flex items-start gap-3.5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Submit DBMS Normalization Assignment</h4>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  Priority 2
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong className="text-slate-800">Reason:</strong> Problem set due tomorrow. Submitting on time prevents coursework penalties and ensures continuous academic standing.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-teal-200 bg-white flex items-start gap-3.5 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3B8F83] mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">Prepare for AI Midterm Exam</h4>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                  Priority 3
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                <strong className="text-slate-800">Reason:</strong> Midterm scheduled in 8 days. Heuristics & Adversarial search topics require early revision based on syllabus weighting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION 5: FINAL CALL TO ACTION                                  */}
      {/* ================================================================ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
        <div className="py-12 px-6 sm:px-10 rounded-3xl bg-white border border-slate-200 text-center space-y-6 shadow-xl shadow-slate-900/5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Ready to Take Control of Your Academic Journey?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Join StudentLens today. Experience data-driven attendance safety buffers, prioritized daily schedules, and career readiness tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-md border-0">
                Signup
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FOOTER                                                           */}
      {/* ================================================================ */}
      <footer className="w-full border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <StudentLensLogo />
          </div>
          <div>
            <span className="font-medium text-slate-600">Student Data → Analysis → Insight → Recommended Action</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
