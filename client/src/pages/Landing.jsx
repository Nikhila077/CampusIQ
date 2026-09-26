import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database,
  CalendarCheck,
  Clock,
  Briefcase,
  GraduationCap,
  ClipboardList,
  Calendar,
  Flame,
  Zap,
  Sliders,
  Award,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  Code2,
  Target,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import LightPillar from '../components/LightPillar.jsx';
import { StudentLensLogo } from '../components/shared/StudentLensLogo.jsx';
import { InteractiveTiltCard } from '../components/ui/InteractiveTiltCard.jsx';
import { Hero3DScene } from '../components/home/Hero3DScene.jsx';

export const Landing = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Smart Attendance Scenario Selector state
  const [activeScenario, setActiveScenario] = useState('safe');
  const [simulatedClasses, setSimulatedClasses] = useState(2);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Staggered scroll reveal observer for sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const targets = document.querySelectorAll('.scroll-reveal');
    targets.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      targets.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const scenarios = {
    safe: {
      subject: 'Artificial Intelligence',
      code: 'CS-401',
      attended: 21,
      conducted: 25,
      currentPercent: 84.0,
      minPercent: 75,
      buffer: 3,
      status: 'Safe',
      diagnosis: 'You have a healthy attendance cushion. You can safely miss up to 3 upcoming lectures without dropping below the 75% institutional requirement.'
    },
    borderline: {
      subject: 'Database Systems',
      code: 'CS-302',
      attended: 15,
      conducted: 20,
      currentPercent: 75.0,
      minPercent: 75,
      buffer: 0,
      status: 'Attention Needed',
      diagnosis: 'Zero safety buffer. You are exactly at the 75% minimum threshold. Any missed lecture will immediately put you at risk of shortage.'
    },
    recovery: {
      subject: 'Operating Systems',
      code: 'CS-305',
      attended: 17,
      conducted: 25,
      currentPercent: 68.0,
      minPercent: 75,
      recoveryNeeded: 7,
      status: 'Attendance Shortage',
      diagnosis: 'Shortage active. To recover eligibility and surpass 75%, you must attend the next 7 consecutive classes without absence.'
    }
  };

  const currentScen = scenarios[activeScenario];

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex flex-col selection:bg-[#3B8F83] selection:text-white relative">
      {/* ================================================================ */}
      {/* 1. STICKY NAVIGATION HEADER                                      */}
      {/* ================================================================ */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-[#102A2A] rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <StudentLensLogo />
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#E8F5F2] text-[#3B8F83] border border-teal-200/80 transition-transform group-hover:scale-105">
                Decision Support
              </span>
            </Link>
          </div>

          {/* Nav Anchors */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <a href="#philosophy" className="hover:text-[#3B8F83] transition-colors py-1">
              Philosophy
            </a>
            <a href="#attendance" className="hover:text-[#3B8F83] transition-colors py-1">
              Smart Attendance
            </a>
            <a href="#academic" className="hover:text-[#3B8F83] transition-colors py-1">
              Academic Hub
            </a>
            <a href="#productivity" className="hover:text-[#3B8F83] transition-colors py-1">
              Productivity
            </a>
            <a href="#career" className="hover:text-[#3B8F83] transition-colors py-1">
              Career Engine
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-slate-700 hover:text-[#102A2A] hover:bg-slate-100"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="font-bold bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-xs border-0"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-xl">
            <a
              href="#philosophy"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#E8F5F2] hover:text-[#3B8F83] rounded-xl transition-colors"
            >
              Philosophy
            </a>
            <a
              href="#attendance"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#E8F5F2] hover:text-[#3B8F83] rounded-xl transition-colors"
            >
              Smart Attendance
            </a>
            <a
              href="#academic"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#E8F5F2] hover:text-[#3B8F83] rounded-xl transition-colors"
            >
              Academic Hub
            </a>
            <a
              href="#productivity"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#E8F5F2] hover:text-[#3B8F83] rounded-xl transition-colors"
            >
              Productivity
            </a>
            <a
              href="#career"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-[#E8F5F2] hover:text-[#3B8F83] rounded-xl transition-colors"
            >
              Career Engine
            </a>
          </div>
        )}
      </header>

      {/* ================================================================ */}
      {/* 2. HERO SECTION WITH REAL 3D MULTI-LAYER PARALLAX SCENE           */}
      {/* ================================================================ */}
      <Hero3DScene />

      {/* ================================================================ */}
      {/* 3. COMMAND CENTER LIVE PREVIEW MOCKUP                            */}
      {/* ================================================================ */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-24 w-full scroll-reveal">
        <InteractiveTiltCard maxTilt={3} scale={1.01} className="w-full">
        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xl p-5 sm:p-7 text-left space-y-5">
          {/* Window Chrome Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <div className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="ml-3 text-xs text-slate-600 font-mono">studentlens.app/command-center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#3B8F83] animate-pulse" />
              <span className="text-xs font-bold text-teal-950 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Live Decision Support
              </span>
            </div>
          </div>

          {/* Top 4 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 feature-card-3d cursor-pointer">
              <span className="text-xs font-bold text-slate-700 block">Overall Attendance</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black text-[#102A2A]">84.2%</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
                  Safe Buffer: +3
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium block mt-1">
                21/25 sessions attended
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 feature-card-3d cursor-pointer">
              <span className="text-xs font-bold text-slate-700 block">Academic Standing</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black text-[#102A2A]">Level 4</span>
                <span className="text-[10px] font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-mono">
                  245 XP
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium block mt-1">
                72% toward Level 5
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 feature-card-3d cursor-pointer">
              <span className="text-xs font-bold text-slate-700 block">Next Milestone</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black text-[#102A2A]">In 4 Days</span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                  DBMS Final
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium block mt-1">
                Hall B-201 • 10:00 AM
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 feature-card-3d cursor-pointer">
              <span className="text-xs font-bold text-slate-700 block">Career Readiness</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-black text-[#3B8F83]">76%</span>
                <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                  Match
                </span>
              </div>
              <span className="text-[11px] text-slate-600 font-medium block mt-1 truncate">
                Software Engineer Stack
              </span>
            </div>
          </div>

          {/* Interactive Split Mockup: Attendance Hero + Prescribed Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
            {/* Left 7 cols: Smart Attendance Spotlight */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-[#102A2A] text-white border border-[#102A2A] flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#3B8F83]/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-[#3B8F83]/30 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8F5F2] px-2.5 py-0.5 rounded-full bg-[#3B8F83]/20 border border-[#3B8F83]/40">
                      Attendance Intelligence Engine
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      Operating Systems (CS-305)
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    Below 75% Requirement
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#143333] border border-[#3B8F83]/30">
                    <span className="text-[11px] text-slate-300 block font-medium">Current Status</span>
                    <div className="text-2xl font-black text-white mt-0.5">74.07%</div>
                    <span className="text-[10px] text-slate-300 block mt-0.5 font-mono">20/27 sessions</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#143333] border border-[#3B8F83]/30">
                    <span className="text-[11px] text-slate-300 block font-medium">Recovery Equation</span>
                    <div className="text-2xl font-black text-[#E8F5F2] mt-0.5">+2 Classes</div>
                    <span className="text-[10px] text-slate-300 block mt-0.5 font-medium">Consecutive to hit 75.8%</span>
                  </div>
                </div>

                {/* Simulated What-If pill */}
                <div className="p-3 rounded-xl bg-[#143333] border border-[#3B8F83]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#3B8F83]" />
                    <span className="text-slate-200">What-If: Attend next 2 scheduled lectures</span>
                  </div>
                  <span className="font-bold text-[#E8F5F2] font-mono">
                    Projected: 75.86% (Safe Buffer restored)
                  </span>
                </div>
              </div>

              <div className="relative z-10 mt-4 pt-3 border-t border-[#3B8F83]/20 flex items-center justify-between text-xs text-slate-300">
                <span>Deterministic Calculation: Zero estimation or guessing</span>
                <span className="text-[#E8F5F2] font-bold">100% Mathematically Verified</span>
              </div>
            </div>

            {/* Right 5 cols: Prescribed Next Best Actions */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="text-xs font-bold text-[#102A2A] flex items-center gap-1.5 uppercase tracking-wider">
                    <Target className="w-4 h-4 text-[#3B8F83]" />
                    Next Best Actions
                  </span>
                  <span className="text-[10px] font-bold text-teal-900 bg-teal-100 px-2 py-0.5 rounded-full">
                    Priority Queue
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white border border-red-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#102A2A]">Attend Operating Systems</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-900">
                        Critical
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                      Session at 09:00 AM in Room LHC-101. Attending restores recovery velocity.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#102A2A]">Submit DBMS Normalization</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-900">
                        High Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                      Due tomorrow at 11:59 PM. Submitting awards +15 XP toward Level 5.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#102A2A]">Solve Today's Brain Boost</span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        +10 XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                      Maintain your 4-day learning streak with a personalized SQL challenge.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <span>Personalized student decision matrix</span>
                <span className="font-bold text-[#3B8F83]">Active Daily</span>
              </div>
            </div>
          </div>
        </div>
        </InteractiveTiltCard>
      </section>

      {/* ================================================================ */}
      {/* 4. THE DECISION-SUPPORT PHILOSOPHY                               */}
      {/* ================================================================ */}
      <section id="philosophy" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-28 scroll-reveal">
        <div className="space-y-3 mb-12">
          <Badge
            variant="secondary"
            className="text-xs px-3 py-1 font-bold text-[#3B8F83] bg-teal-50 border border-teal-200"
          >
            The Central Philosophy
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight">
            From Passive Numbers to Clear Decisions
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Legacy college portals dump tables of numbers on students without context. StudentLens bridges the gap between what happened and what you need to do next.
          </p>
        </div>

        {/* 4-Step Connected Editorial Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 feature-card-3d cursor-pointer scroll-reveal stagger-1">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#3B8F83] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  STEP 01
                </span>
                <Database className="w-4 h-4 text-slate-500 card-icon-bounce" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Student Data</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                Aggregates real curriculum subjects, conducted attendance, timetables, coursework deadlines, and exam schedules.
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-600 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Syllabus & Timetable</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 feature-card-3d cursor-pointer scroll-reveal stagger-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#3B8F83] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  STEP 02
                </span>
                <Layers className="w-4 h-4 text-slate-500 card-icon-bounce" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Analysis</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                Deterministic mathematical engine computes institutional buffers, shortage deficits, and syllabus completion velocity.
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-600 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Deterministic Math</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 feature-card-3d cursor-pointer scroll-reveal stagger-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#3B8F83] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  STEP 03
                </span>
                <Sparkles className="w-4 h-4 text-slate-500 card-icon-bounce" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Insight</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                Translates analytics into plain answers: "Can I miss tomorrow?", "How many classes do I need to recover?", "What's my biggest skill gap?".
              </p>
            </div>
            <div className="text-[11px] font-bold text-slate-600 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span>Actionable Answers</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-teal-300 shadow-xs flex flex-col justify-between space-y-4 feature-card-3d cursor-pointer scroll-reveal stagger-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-teal-950 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                  STEP 04
                </span>
                <Target className="w-4 h-4 text-[#3B8F83] card-icon-bounce" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Recommended Action</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1.5">
                Generates a ranked, daily action priority queue so you always know the exact single most impactful task to tackle next.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#3B8F83] pt-3 border-t border-teal-100 flex items-center justify-between">
              <span>Daily Action Prioritized</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. SMART ATTENDANCE SHOWCASE (CORE DIFFERENTIATOR)               */}
      {/* ================================================================ */}
      <section id="attendance" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-28 scroll-reveal">
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#102A2A] shadow-xs">
            <CalendarCheck className="w-3.5 h-3.5 text-[#3B8F83]" />
            <span>Hero Feature</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight">
            Smart Attendance Intelligence
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Eliminate attendance anxiety. StudentLens calculates mathematically proven answers to the real questions students ask every week.
          </p>
        </div>

        {/* Interactive Scenario Demonstrator */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xl text-left space-y-6">
          {/* Question Tabs */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-slate-700 mr-2 uppercase tracking-wider">
              Explore Live Scenarios:
            </span>
            <button
              onClick={() => setActiveScenario('safe')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScenario === 'safe'
                  ? 'bg-[#3B8F83] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              "How many classes can I safely miss?"
            </button>
            <button
              onClick={() => setActiveScenario('borderline')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScenario === 'borderline'
                  ? 'bg-[#3B8F83] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              "Can I miss today's lecture?"
            </button>
            <button
              onClick={() => setActiveScenario('recovery')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeScenario === 'recovery'
                  ? 'bg-[#3B8F83] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              "How do I recover from a shortage?"
            </button>
          </div>

          {/* Scenario Display Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left 7 cols: Scenario Card */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
                    {currentScen.code}
                  </span>
                  <h3 className="text-xl font-black text-[#102A2A]">{currentScen.subject}</h3>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    currentScen.status === 'Safe'
                      ? 'bg-teal-50 text-teal-950 border-teal-200'
                      : currentScen.status === 'Attention Needed'
                      ? 'bg-slate-200 text-slate-900 border-slate-300'
                      : 'bg-red-50 text-red-950 border-red-200'
                  }`}
                >
                  {currentScen.status}
                </span>
              </div>

              {/* Progress Track */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">Attendance Ratio</span>
                  <span className="text-[#102A2A] font-mono">
                    {currentScen.attended} / {currentScen.conducted} classes ({currentScen.currentPercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      currentScen.currentPercent >= currentScen.minPercent ? 'bg-[#3B8F83]' : 'bg-red-500'
                    }`}
                    style={{ width: `${currentScen.currentPercent}%` }}
                  />
                </div>
              </div>

              {/* Decision Verdict Box */}
              <div
                className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                  currentScen.status === 'Safe'
                    ? 'bg-teal-50/70 border-teal-200 text-teal-950'
                    : currentScen.status === 'Attention Needed'
                    ? 'bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-red-50/70 border-red-200 text-red-950'
                }`}
              >
                <div className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3B8F83]" />
                  <span>
                    {activeScenario === 'safe'
                      ? `Safe Absence Buffer: +${currentScen.buffer} classes can be missed safely`
                      : activeScenario === 'borderline'
                      ? 'No safe absences remaining. Missing any class triggers a shortage'
                      : `Recovery Target: Must attend next ${currentScen.recoveryNeeded} classes consecutively`}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-700">{currentScen.diagnosis}</p>
              </div>
            </div>

            {/* Right 5 cols: Mathematical Transparency */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#102A2A] text-white border border-[#102A2A] space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8F5F2] px-2 py-0.5 rounded bg-[#3B8F83]/20 border border-[#3B8F83]/40">
                Mathematical Transparency
              </span>
              <h4 className="text-base font-bold text-white">How the Engine Calculates This</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                StudentLens does not use arbitrary approximations. Every buffer and recovery count is computed with deterministic discrete mathematics:
              </p>

              <div className="p-3 rounded-xl bg-[#143333] border border-[#3B8F83]/30 text-xs font-mono text-[#E8F5F2] space-y-1.5">
                <div className="text-[10px] text-slate-400 font-sans uppercase font-bold">Safe Buffer Formula:</div>
                <div>Buffer = ⌊(Attended - (Req% × Held)) / Req%⌋</div>
                <div className="text-[10px] text-slate-400 font-sans uppercase font-bold pt-1.5">Recovery Formula:</div>
                <div>Recovery = ⌈((Req% × Held) - Attended) / (1 - Req%)⌉</div>
              </div>

              <span className="text-[11px] text-slate-300 block font-medium">
                Tested against 8 rigorous edge-case unit test matrices in our calculation suite.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 6. UNIFIED ACADEMIC INTELLIGENCE SUITE                           */}
      {/* ================================================================ */}
      <section id="academic" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-28 scroll-reveal">
        <div className="space-y-3 mb-12">
          <Badge
            variant="secondary"
            className="text-xs px-3 py-1 font-bold text-[#3B8F83] bg-teal-50 border border-teal-200"
          >
            Unified Academic Hub
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight">
            Six Disparate Portals in One Synchronized Command Center
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Stop checking five separate tabs for attendance, timetable, assignments, exams, and marks. StudentLens correlates your entire academic semester.
          </p>
        </div>

        {/* Feature Grid: Centerpiece + 5 Supporting Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {/* Card 1: Attendance Intelligence */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-1">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Smart Attendance & What-If</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Deterministic buffer calculation and what-if simulation for planned absences, medical leaves, and recovery planning.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Interactive Buffers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 2: Weekly Schedule Timetable */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-2">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Timetable & Lecture Map</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Organize weekly lecture hours, lab venues, and today's schedule synchronized directly with attendance tracking.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Weekly Schedules</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 3: Coursework & Deliverables */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-3">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                <ClipboardList className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Assignment Deliverables</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Deadline tracking with priority levels (Critical, High, Medium) and automatic XP awards for on-time submissions.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Deadline Tracking</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 4: Exam Milestones & Countdowns */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-4">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Exam Milestones</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Midterm and final schedules with live day countdowns, venue tags, and syllabus unit coverage reminders.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Exam Timelines</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 5: Performance Analytics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-5">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Performance Analytics</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Real marks tracking, subject score comparisons, assessment progression trajectories, and academic tier grades.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Marks Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Card 6: Smart Decision Planner */}
          <div className="p-6 rounded-2xl bg-white border border-teal-300 shadow-xs flex flex-col justify-between space-y-3 feature-card-3d cursor-pointer scroll-reveal stagger-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-950 card-icon-bounce">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-[#102A2A]">Smart Academic Planner</h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Synthesizes attendance deficits, imminent deadlines, and exam milestones into a ranked, executable daily agenda.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#3B8F83] pt-2 border-t border-teal-100 flex items-center justify-between">
              <span>Dynamic Synthesis</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 7. PRODUCTIVITY & MEANINGFUL LEARNING                            */}
      {/* ================================================================ */}
      {/* ================================================================ */}
      {/* 7. PRODUCTIVITY & MEANINGFUL LEARNING                            */}
      {/* ================================================================ */}
      <section id="productivity" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-28 scroll-reveal">
        <div className="space-y-3 mb-12">
          <Badge
            variant="secondary"
            className="text-xs px-3 py-1 font-bold text-[#3B8F83] bg-teal-50 border border-teal-200"
          >
            Productivity & Gamification
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight">
            Consistency Powered by Meaningful Progress
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Not childish gaming gimmicks—StudentLens provides a quiet, disciplined progression system rewarding academic consistency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {/* Daily Brain Boost */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between feature-card-3d cursor-pointer scroll-reveal stagger-1">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  +10 XP Daily
                </span>
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Daily Brain Boost</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                One high-leverage technical question each day tailored to your target engineering role (CS fundamentals, SQL, Systems, Data).
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <span className="font-bold text-[#102A2A] block">Today's Topic: SQL Normalization</span>
              <span>Explain 3NF vs BCNF dependency preservation.</span>
            </div>
          </div>

          {/* StudentLens Streak */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between feature-card-3d cursor-pointer scroll-reveal stagger-2">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Daily Consistency
                </span>
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">Productivity Streak</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                Maintain an active learning streak by completing 3 daily academic tasks: attendance logging, Brain Boost solving, or assignment progress.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <div className="flex justify-between font-bold mb-1">
                <span>Daily Goal Progress</span>
                <span className="text-[#3B8F83] font-mono">3 / 3 completed</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#3B8F83] h-full rounded-full w-full" />
              </div>
            </div>
          </div>

          {/* XP & Leveling */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between feature-card-3d cursor-pointer scroll-reveal stagger-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#3B8F83] card-icon-bounce">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  Level Progression
                </span>
              </div>
              <h3 className="text-base font-bold text-[#102A2A] mt-3">XP & Academic Standing</h3>
              <p className="text-xs text-slate-700 leading-relaxed mt-1">
                Earn experience points for timely coursework submission, consistent study habits, and attendance recovery.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
              <span className="font-bold text-[#102A2A] block">Level 4 Student Scholar</span>
              <span>180 XP to Level 5 • Unlocks advanced analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 8. CAREER READINESS & INDUSTRY BENCHMARKS                        */}
      {/* ================================================================ */}
      <section id="career" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mb-28 scroll-reveal">
        <div className="space-y-3 mb-12">
          <Badge
            variant="secondary"
            className="text-xs px-3 py-1 font-bold text-[#3B8F83] bg-teal-50 border border-teal-200"
          >
            Industry Alignment
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight">
            Curriculum Coverage Meets Career Benchmarks
          </h2>
          <p className="text-slate-700 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            StudentLens maps your semester subjects against the real competency stacks demanded by employers for your target engineering role.
          </p>
        </div>

        <div className="bg-[#102A2A] text-white border border-[#102A2A] rounded-3xl p-6 sm:p-10 shadow-xl text-left space-y-8 relative overflow-hidden feature-card-3d">
          <div className="absolute -right-8 -bottom-8 w-80 h-80 bg-[#3B8F83]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8F5F2] px-2.5 py-0.5 rounded-full bg-[#3B8F83]/20 border border-[#3B8F83]/40">
                Target Role Alignment
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Software Engineer Curriculum Match
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                StudentLens evaluates your completed and active semester courses (Data Structures, DBMS, Operating Systems, Computer Networks) against standardized technical interview expectations.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {['Data Structures', 'Algorithms', 'SQL & RDBMS', 'Operating Systems', 'Git & CI/CD'].map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#143333] border border-[#3B8F83]/40 text-xs font-semibold text-[#E8F5F2] hover:border-[#3B8F83] transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3B8F83]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Score Card */}
            <div className="md:col-span-4 p-6 rounded-2xl bg-[#143333] border border-[#3B8F83]/40 text-center space-y-2 shadow-xs">
              <span className="text-xs uppercase font-bold text-slate-300 block">
                Curriculum Coverage
              </span>
              <div className="text-5xl font-black text-[#E8F5F2]">76%</div>
              <span className="text-xs text-slate-300 font-medium block">
                5 of 7 core competencies acquired
              </span>
              <div className="pt-3 border-t border-[#3B8F83]/30">
                <span className="text-[11px] text-amber-300 font-semibold block">
                  Skill Gap Spotlight: System Design & Indexing
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 9. FINAL CALL TO ACTION                                          */}
      {/* ================================================================ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-28 scroll-reveal">
        <div className="py-14 px-6 sm:px-12 rounded-3xl bg-white border border-slate-200/90 text-center space-y-6 shadow-xl feature-card-3d">
          <Badge
            variant="secondary"
            className="text-xs px-3 py-1 font-bold text-[#3B8F83] bg-teal-50 border border-teal-200 mx-auto inline-block"
          >
            Get Academic Clarity Today
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-black text-[#102A2A] tracking-tight max-w-2xl mx-auto">
            Ready to Take Control of Your Academic Standing?
          </h2>

          <p className="text-slate-700 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Experience mathematically proven attendance buffers, actionable daily priority queues, and career readiness tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="btn-3d-primary w-full sm:w-auto text-base font-bold px-9 bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-md border-0"
              >
                Sign Up for StudentLens Free
                <ArrowRight className="w-4 h-4 ml-2 btn-arrow-slide" />
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="btn-3d-secondary w-full sm:w-auto text-base font-bold px-8 border border-slate-300 bg-white hover:bg-slate-50 text-[#102A2A]"
              >
                Sign In to Existing Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 10. PRODUCT FOOTER                                               */}
      {/* ================================================================ */}
      <footer className="w-full border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-700">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <StudentLensLogo />
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Personalized Student Decision-Support Platform</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#philosophy" className="hover:text-[#3B8F83] transition-colors">Philosophy</a>
            <a href="#attendance" className="hover:text-[#3B8F83] transition-colors">Attendance</a>
            <a href="#academic" className="hover:text-[#3B8F83] transition-colors">Academic Hub</a>
            <a href="#career" className="hover:text-[#3B8F83] transition-colors">Career</a>
            <Link to="/login" className="hover:text-[#3B8F83] transition-colors">Sign In</Link>
          </div>

          <div className="text-slate-600 font-medium">
            Student Data → Analysis → Insight → Recommended Action
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
