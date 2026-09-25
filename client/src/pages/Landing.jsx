import { useState } from 'react';
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
  Database,
  Flame,
  HelpCircle,
  AlertTriangle,
  ChevronRight,
  Award,
  Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { PredictiveArcCanvas } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <PredictiveArcCanvas
        mode="dark"
        speed={1.00}
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

export const Landing = () => {
  // Interactive Brain Boost Sample Demo State
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const sampleQuestion = {
    category: 'DSA',
    targetRole: 'Software Engineer',
    question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctAnswer: 1,
    explanation: 'In a balanced BST, the height of the tree is bounded by O(log n), allowing binary search partition at every node.'
  };

  const handleOptionClick = (idx) => {
    setSelectedOption(idx);
    setHasAnswered(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-60 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-2/3 -left-60 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="w-full border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Campus<span className="text-indigo-400">IQ</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold shadow-indigo-600/25">
                Sign Up
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-24">
        {/* SECTION 1: HERO */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 text-xs font-medium shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Personalized Student Decision-Support Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span className="text-slate-400 font-normal">DATA → UNDERSTANDING → ACTION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Your Student Life, <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Smarter.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300/90 leading-relaxed font-normal">
            CampusIQ transforms fragmented academic records into clear calculations, safe absence buffers, prioritized study schedules, and career readiness.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-indigo-500/30">
                Sign Up
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8">
                Login
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Isolated Student Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Real MongoDB Atlas Backend</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>JWT & HttpOnly Session Security</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: HERO — MAIN VISUAL ELEMENT: ThreeUI Predictive Arc Canvas */}
        <div className="mt-10 sm:mt-14 w-full max-w-5xl mx-auto relative group">
          {/* Subtle Outer Violet Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/25 via-purple-500/30 to-indigo-500/25 blur-xl opacity-70 group-hover:opacity-90 transition duration-1000 -z-10" />

          <div className="relative rounded-2xl sm:rounded-3xl border border-indigo-500/30 bg-slate-950/90 backdrop-blur-2xl shadow-2xl shadow-indigo-950/70 overflow-hidden">
            {/* Header Telemetry Bar */}
            <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between flex-wrap gap-2 text-left">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono font-medium text-indigo-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  ThreeUI Predictive Arc Engine
                </span>
                <span className="text-[10px] text-slate-500 hidden md:inline font-mono">
                  predictive • r128 canvas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Mode: Dark • Speed: 1.0x
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Vector: Real-Time Wave
                </span>
              </div>
            </div>

            {/* Canvas Viewport with Exact Configured Scene */}
            <div className="relative h-[320px] sm:h-[400px] md:h-[460px] w-full bg-[#030303]">
              <Scene />

              {/* Floating Real-Time Academic Intelligence Overlays */}
              <div className="absolute top-4 left-4 max-w-xs pointer-events-none text-left">
                <div className="p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-indigo-500/30 shadow-lg shadow-black/50">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Predictive Horizon</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">Active Sync</span>
                  </div>
                  <p className="text-xs font-semibold text-white">Dynamic Attendance Forecasting</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Continuous harmonic calculations projecting safe absence margins across subjects.</p>
                </div>
              </div>

              <div className="absolute top-4 right-4 max-w-xs pointer-events-none text-right hidden sm:block">
                <div className="p-3 rounded-xl bg-slate-900/85 backdrop-blur-md border border-purple-500/30 shadow-lg shadow-black/50">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-[10px] font-mono text-purple-300 font-semibold">Risk Buffer Curve</span>
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  </div>
                  <p className="text-xs font-semibold text-white">Next Best Action Signals</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Identifies critical classes before defaulter thresholds are crossed.</p>
                </div>
              </div>

              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none text-left flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>AI: 84% (Safe +3)</span>
                  <span className="text-slate-600">|</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>DBMS: 78.5% (Safe +1)</span>
                  <span className="text-slate-600">|</span>
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>OS: 74% (At Risk - Attend 1)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 text-[11px] text-indigo-200 font-medium">
                  ✦ Continuous Decision Support
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Live Preview Mockup */}
        <div className="mt-14 w-full max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl shadow-indigo-950/50 text-left">
          {/* Window Chrome */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-slate-400 font-mono">campusiq.internal/command-center</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="text-[10px]">
                🔥 7 Day Streak
              </Badge>
              <Badge variant="primary" className="text-[10px]">
                Level 3 • 240 XP
              </Badge>
            </div>
          </div>

          {/* Top Command Strip Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Overall Attendance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-white">83.5%</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  Safe
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Daily Actions</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-amber-400">4 / 4</span>
                <span className="text-[9px] font-semibold text-slate-400">100% Goal</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Next Exam</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-yellow-400">In 4 Days</span>
                <span className="text-[9px] text-slate-400">DBMS Midterm</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Career Readiness</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-indigo-400">76%</span>
                <span className="text-[9px] text-slate-400">Software Eng.</span>
              </div>
            </div>
          </div>

          {/* Action Priorities Preview */}
          <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Next Best Actions (Live Decision Support)
              </span>
              <span className="text-[10px] text-slate-400">Generated from MongoDB data</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-red-300">Attend OS Class</span>
                  <span className="text-[9px] font-bold uppercase px-1 rounded bg-red-500/20 text-red-400">Critical</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">Attendance is 74% (below 75% minimum). Attend next 2 classes to recover.</p>
              </div>

              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-orange-300">Submit DBMS Assignment</span>
                  <span className="text-[9px] font-bold uppercase px-1 rounded bg-orange-500/20 text-orange-400">High</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">Normalization problem set due tomorrow. Submit on time to earn +15 XP.</p>
              </div>

              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">Prepare AI Internal</span>
                  <span className="text-[9px] font-bold uppercase px-1 rounded bg-indigo-500/20 text-indigo-400">Prep</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">Exam in 8 days. Heuristics & Adversarial search high-weight topics.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: WHY CAMPUSIQ (Traditional ERP vs CampusIQ) */}
        <section className="mt-28 max-w-5xl mx-auto w-full text-center">
          <div className="space-y-3 mb-12">
            <Badge variant="purple" className="text-xs px-3 py-1 font-semibold">
              The CampusIQ Paradigm
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Traditional Portals Fall Short
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Standard college portals present passive numbers. CampusIQ calculates what those numbers mean and gives you a clear course of action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Traditional Portal Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Traditional ERP</span>
                <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                  Passive Metric
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs text-slate-400">Subject Attendance</span>
                <p className="text-3xl font-black text-red-400 mt-1">74.07%</p>
                <p className="text-xs text-slate-400 mt-2">
                  No breakdown. No safety buffer. Student does not know if they are eligible for exams or how many classes are needed to get safe.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> No safe absence buffer calculation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> No recovery schedule when below threshold
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-400 font-bold">✕</span> Disconnected from daily timetable priorities
                </li>
              </ul>
            </div>

            {/* CampusIQ Decision Engine Card */}
            <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/20 p-6 space-y-4 relative overflow-hidden shadow-xl shadow-indigo-950/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">CampusIQ Engine</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30">
                  Decision Support
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-medium">Operating Systems (75% Required)</span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">
                    At Risk
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl font-black text-white">74.07%</span>
                  <span className="text-xs font-bold text-red-400">
                    Need 2 classes to recover 75%
                  </span>
                </div>
                <p className="text-xs text-emerald-400 font-medium mt-2">
                  Today's Priority: Attend OS lecture at 09:00 AM (Room LHC-101)
                </p>
              </div>

              <ul className="space-y-2 text-xs text-indigo-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Precise safe absence buffer and recovery countdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Interactive what-if simulator for future absences</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Integrated with Smart Planner and daily reminders</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: SMART ATTENDANCE */}
        <section className="mt-28 max-w-6xl mx-auto w-full text-center">
          <div className="space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Realistic Demo Preview (Alex Johnson)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Smart Attendance Engine
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Mathematical formulas evaluate your standing, calculate maximum safe absences, and tell you exactly how many sessions are needed to recover.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Subject 1: AI */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Artificial Intelligence</h4>
                  <span className="text-xs font-bold text-emerald-400">84.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '84%' }} />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Attended / Held:</span>
                    <span className="text-white font-mono">21 / 25</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Institutional Min:</span>
                    <span className="text-white font-mono">75%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">Safe buffer: 3 classes</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Safe</span>
              </div>
            </div>

            {/* Subject 2: DBMS */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">DBMS</h4>
                  <span className="text-xs font-bold text-emerald-400">78.6%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '78.6%' }} />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Attended / Held:</span>
                    <span className="text-white font-mono">22 / 28</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Institutional Min:</span>
                    <span className="text-white font-mono">75%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">Safe buffer: 1 class</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Safe</span>
              </div>
            </div>

            {/* Subject 3: OS (At Risk) */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Operating Systems</h4>
                  <span className="text-xs font-bold text-red-400">74.1%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '74.1%' }} />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Attended / Held:</span>
                    <span className="text-white font-mono">20 / 27</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Institutional Min:</span>
                    <span className="text-white font-mono">75%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center justify-between text-[11px]">
                <span className="text-red-400 font-semibold">Attend next 2 classes</span>
                <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold">At Risk</span>
              </div>
            </div>

            {/* Subject 4: Web Tech */}
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Web Technologies</h4>
                  <span className="text-xs font-bold text-emerald-400">90.9%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90.9%' }} />
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Attended / Held:</span>
                    <span className="text-white font-mono">20 / 22</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Institutional Min:</span>
                    <span className="text-white font-mono">75%</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">Safe buffer: 4 classes</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Safe</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SMART PLANNER */}
        <section className="mt-28 max-w-5xl mx-auto w-full text-center">
          <div className="space-y-3 mb-12">
            <Badge variant="purple" className="text-xs px-3 py-1 font-semibold">
              Action Prioritization Engine
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              "What Should I Focus on Today?"
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              CampusIQ continuously correlates attendance shortages, approaching deadlines, and upcoming exam countdowns to produce an actionable plan.
            </p>
          </div>

          <div className="space-y-3 text-left max-w-3xl mx-auto">
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex items-start gap-3.5">
              <span className="text-xl">🔴</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Attend Operating Systems Lecture</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                    Priority 1
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>Reason:</strong> OS attendance is 74.07%, below the configured 75% institutional minimum. Attending today's session immediately restores recovery velocity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 flex items-start gap-3.5">
              <span className="text-xl">🟡</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Submit DBMS Normalization Assignment</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300">
                    Priority 2
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>Reason:</strong> Due tomorrow. Submitting on time prevents coursework penalties and yields +15 XP towards your daily goal.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3.5">
              <span className="text-xl">🟢</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Prepare for AI Midterm Exam</h4>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Priority 3
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <strong>Reason:</strong> Midterm scheduled in 8 days. Heuristics & Adversarial search topics require early revision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: CAMPUSIQ STREAKS */}
        <section className="mt-28 max-w-5xl mx-auto w-full text-center">
          <div className="space-y-3 mb-12">
            <Badge variant="purple" className="text-xs px-3 py-1 font-semibold">
              Meaningful Gamification
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              CampusIQ Streaks
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Streaks are earned through real academic execution — completing planner tasks, submitting assignments, solving daily challenges, and attending classes.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-900/60 to-purple-950/20 text-left relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
                  🔥
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    7 Day Streak
                  </h3>
                  <p className="text-xs text-slate-400">Meaningful daily learning maintained</p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                +15 XP Bonus Active
              </span>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Today's Planned Actions</span>
                <span className="font-mono text-amber-400 font-bold">4 / 4 Completed</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Planner Tasks</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">✓ Done (+5 XP)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Brain Boost</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">✓ Solved (+10 XP)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Assignments</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">✓ On Track</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Level Standing</span>
                <span className="font-bold text-indigo-400 mt-0.5 block">Lvl 3 • 240 XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: DAILY BRAIN BOOST (Interactive Sample Demo) */}
        <section className="mt-28 max-w-4xl mx-auto w-full text-center">
          <div className="space-y-3 mb-10">
            <Badge variant="purple" className="text-xs px-3 py-1 font-semibold">
              Interactive Daily Micro-Challenge
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Daily Brain Boost
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Receive one personalized challenge daily tailored to your target career role. Solve it to maintain your streak and earn +10 XP. Try today's challenge below:
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl text-left shadow-2xl shadow-indigo-950/50">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                  {sampleQuestion.category}
                </span>
                <span className="text-xs text-slate-400">
                  Target Role: <strong className="text-slate-200">{sampleQuestion.targetRole}</strong>
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                <span>+10 XP</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {sampleQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {sampleQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === sampleQuestion.correctAnswer;
                let btnStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-900';

                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-red-950/40 border-red-500/60 text-red-300';
                  }
                }

                return (
                  <button
                    key={option}
                    disabled={hasAnswered}
                    onClick={() => handleOptionClick(idx)}
                    className={`p-3.5 rounded-xl border text-sm text-left flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Feedback */}
            {hasAnswered && (
              <div className="mt-5 p-4 rounded-xl bg-slate-950/90 border border-slate-800 animate-in fade-in duration-300 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${selectedOption === sampleQuestion.correctAnswer ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedOption === sampleQuestion.correctAnswer
                      ? '✅ Correct! +10 XP awarded • 🔥 Streak Maintained'
                      : '❌ Incorrect. Correct answer: O(log n)'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {sampleQuestion.explanation}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 7: FINAL CALL TO ACTION */}
        <section className="mt-28 max-w-4xl mx-auto w-full py-12 px-6 rounded-3xl bg-gradient-to-r from-indigo-950/50 via-slate-900/80 to-purple-950/50 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Take Control of Your Academic Journey?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm">
            Join CampusIQ today. Experience data-driven attendance safety buffers, prioritized daily schedules, and career readiness tracking.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-base font-semibold px-8 shadow-indigo-600/30">
                Sign Up
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base font-medium px-8">
                Login
              </Button>
            </Link>
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
            <span>Data → Understanding → Action</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
