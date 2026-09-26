import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Flame,
  Zap,
  Sliders,
  Sparkles,
  TrendingUp,
  Database,
  Lock,
  Target,
  CheckCircle2,
  Activity
} from 'lucide-react';
import LightPillar from '../LightPillar.jsx';

export const Hero3DScene = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth interpolated coordinates for 60fps lerp
  const animFrameRef = useRef(null);
  const currentPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  // Real-time hover tilt states for individual cards
  const [card1Tilt, setCard1Tilt] = useState({ rx: 0, ry: 0, s: 1 });
  const [card2Tilt, setCard2Tilt] = useState({ rx: 0, ry: 0, s: 1 });
  const [card3Tilt, setCard3Tilt] = useState({ rx: 0, ry: 0, s: 1 });
  const [card4Tilt, setCard4Tilt] = useState({ rx: 0, ry: 0, s: 1 });

  // Mouse move handler with normalized -1 to +1 coordinates
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Center-offset normalized between -1 and +1
    targetPos.current = {
      x: (x - 0.5) * 2,
      y: (y - 0.5) * 2
    };
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    targetPos.current = { x: 0, y: 0 };
    setIsHovered(false);
  };

  // Lerp animation loop for smooth, luxury mouse movement
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let isRunning = true;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const loop = () => {
      if (!isRunning) return;

      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.075);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.075);

      setMousePos({
        x: Number(currentPos.current.x.toFixed(4)),
        y: Number(currentPos.current.y.toFixed(4))
      });

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Card tilt helper on cursor move
  const createTiltHandler = (setter) => (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setter({
      rx: -y * 14,
      ry: x * 14,
      s: 1.03
    });
  };

  const resetTilt = (setter) => () => {
    setter({ rx: 0, ry: 0, s: 1 });
  };

  const { x, y } = mousePos;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero relative overflow-hidden w-full min-h-[700px] sm:min-h-[780px] lg:min-h-[840px] flex flex-col justify-between selection:bg-[#3B8F83] selection:text-white"
      style={{ perspective: '1200px' }}
    >
      {/* ============================================================ */}
      {/* LAYER 1: BACKGROUND LAYER (LIGHTPILLAR + PARALLAX SHIFT)     */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 z-0 will-change-transform pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${x * 6}px, ${y * 5}px, 0px) scale(1.02)`
        }}
      >
        <LightPillar
          topColor="#F4F7F5"
          bottomColor="#3B8F83"
          intensity={0.82}
          rotationSpeed={0.22}
          glowAmount={0.0035}
          pillarWidth={3.0}
          pillarHeight={0.42}
          noiseIntensity={0.5}
          pillarRotation={0}
          interactive={true}
          mixBlendMode="normal"
          quality="high"
          lightMode={true}
        />
      </div>

      {/* ============================================================ */}
      {/* LAYER 2: MIDDLE LAYER (3D ABSTRACT GEOMETRIC OBJECTS)        */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 z-5 pointer-events-none overflow-hidden"
        style={{
          transform: `translate3d(${x * 15}px, ${y * 12}px, 15px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Abstract 3D Geometric Ring Orbit (Left Side) */}
        <div className="hidden lg:block absolute left-[6%] top-[22%] w-48 h-48 rounded-full border-2 border-dashed border-[#3B8F83]/30 animate-spin-slow opacity-60" />
        <div className="hidden lg:block absolute left-[8%] top-[25%] w-36 h-36 rounded-full border border-[#3B8F83]/40 animate-spin-reverse-slow opacity-50" />

        {/* 3D Tumbling Prism Wireframe (Right Side) */}
        <div className="hidden lg:block absolute right-[8%] top-[18%] w-32 h-32 rounded-3xl border border-teal-300/40 bg-gradient-to-br from-teal-100/20 to-emerald-50/10 backdrop-blur-xs animate-tumble-3d shadow-xs opacity-75" />

        {/* Floating Ambient Sparkles / Light Glow Nodes */}
        <div className="absolute left-[20%] top-[12%] w-3 h-3 rounded-full bg-[#3B8F83]/40 blur-xs animate-subtle-float" />
        <div className="absolute right-[22%] top-[16%] w-4 h-4 rounded-full bg-emerald-400/40 blur-xs animate-subtle-float" style={{ animationDelay: '2s' }} />
        <div className="absolute left-[35%] bottom-[20%] w-2.5 h-2.5 rounded-full bg-teal-500/30 blur-xs animate-subtle-float" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* ============================================================ */}
      {/* LAYER 3: FOREGROUND FLOATING 3D CARDS (ACTIVE MOTION & TILT) */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 z-15 pointer-events-none max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{
          transform: `translate3d(${x * 26}px, ${y * 22}px, 30px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* CARD 1: 3D SMART ATTENDANCE RING CARD (Top-Left) */}
        <div
          onMouseMove={createTiltHandler(setCard1Tilt)}
          onMouseLeave={resetTilt(setCard1Tilt)}
          className="hidden xl:flex absolute left-4 lg:left-8 top-[18%] p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/90 shadow-xl shadow-slate-900/8 text-left gap-3.5 items-center pointer-events-auto cursor-pointer animate-float-card-1"
          style={{
            transform: `perspective(1000px) rotateX(${card1Tilt.rx}deg) rotateY(${card1Tilt.ry}deg) scale3d(${card1Tilt.s}, ${card1Tilt.s}, 1) translateZ(20px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          }}
        >
          {/* Animated SVG Attendance Progress Ring */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            {/* Rotating dashed orbit ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-[#3B8F83]/50 animate-spin-slow" />
            <svg className="w-11 h-11 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3B8F83"
                strokeWidth="10"
                strokeLinecap="round"
                className="animate-fill-ring"
              />
            </svg>
            <span className="absolute text-[11px] font-black text-[#102A2A] font-mono">
              84%
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Smart Attendance
              </p>
            </div>
            <p className="text-xs font-black text-[#102A2A]">
              +3 Lectures Safe Buffer
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              Threshold: 75% • Met
            </span>
          </div>
        </div>

        {/* CARD 2: 3D LEARNING VELOCITY SPARKLINE CARD (Top-Right) */}
        <div
          onMouseMove={createTiltHandler(setCard2Tilt)}
          onMouseLeave={resetTilt(setCard2Tilt)}
          className="hidden xl:flex absolute right-4 lg:right-8 top-[16%] p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/90 shadow-xl shadow-slate-900/8 text-left gap-3.5 items-center pointer-events-auto cursor-pointer animate-float-card-2"
          style={{
            transform: `perspective(1000px) rotateX(${card2Tilt.rx}deg) rotateY(${card2Tilt.ry}deg) scale3d(${card2Tilt.s}, ${card2Tilt.s}, 1) translateZ(25px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-700 flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500/20" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Learning Velocity
              </p>
              <span className="text-[10px] font-bold text-[#3B8F83] font-mono">+18%</span>
            </div>
            <p className="text-xs font-black text-[#102A2A]">
              7-Day Streak Active
            </p>

            {/* Live Drawing Animated SVG Sparkline */}
            <div className="w-28 h-6 relative pt-0.5">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
                <defs>
                  <linearGradient id="sparklineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3B8F83" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 18 Q 20 6, 40 14 T 70 8 T 96 4"
                  fill="none"
                  stroke="url(#sparklineGrad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-draw-sparkline"
                />
                {/* Live pulsing beacon at peak */}
                <circle cx="96" cy="4" r="3.5" fill="#10B981" className="animate-ping" />
                <circle cx="96" cy="4" r="2.5" fill="#3B8F83" />
              </svg>
            </div>
          </div>
        </div>

        {/* CARD 3: 3D CAREER READINESS BADGE (Bottom-Right / Mid) */}
        <div
          onMouseMove={createTiltHandler(setCard3Tilt)}
          onMouseLeave={resetTilt(setCard3Tilt)}
          className="hidden xl:flex absolute right-12 bottom-[18%] p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/90 shadow-xl shadow-slate-900/8 text-left gap-3 items-center pointer-events-auto cursor-pointer animate-float-card-3"
          style={{
            transform: `perspective(1000px) rotateX(${card3Tilt.rx}deg) rotateY(${card3Tilt.ry}deg) scale3d(${card3Tilt.s}, ${card3Tilt.s}, 1) translateZ(15px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#3B8F83] flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Role Benchmark
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-[#102A2A]">Full-Stack Eng</span>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                94% Match
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: 3D LIVE ENGINE STATUS PILL (Bottom-Left / Mid) */}
        <div
          onMouseMove={createTiltHandler(setCard4Tilt)}
          onMouseLeave={resetTilt(setCard4Tilt)}
          className="hidden xl:flex absolute left-12 bottom-[20%] p-3 rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/90 shadow-lg shadow-slate-900/6 text-left gap-2.5 items-center pointer-events-auto cursor-pointer animate-float-card-4"
          style={{
            transform: `perspective(1000px) rotateX(${card4Tilt.rx}deg) rotateY(${card4Tilt.ry}deg) scale3d(${card4Tilt.s}, ${card4Tilt.s}, 1) translateZ(15px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              Mathematical Engine
            </p>
            <p className="text-xs font-black text-[#102A2A]">
              100% Deterministic • 0ms Delay
            </p>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* LAYER 4: TEXT & CTA LAYER (LAYERED 3D DEPTH + PARALLAX)      */}
      {/* ============================================================ */}
      <div
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16 flex flex-col items-center justify-center text-center space-y-6"
        style={{
          transform: `translate3d(${x * 8}px, ${y * 6}px, 20px)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.08s ease-out'
        }}
      >
        {/* Core Concept Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-teal-700/20 text-teal-950 text-xs font-bold shadow-xs backdrop-blur-sm card-lift">
          <span className="w-2 h-2 rounded-full bg-[#3B8F83] animate-pulse" />
          <span>Personalized Student Decision-Support Platform</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-medium">Data → Analysis → Action</span>
        </div>

        {/* Main Title with 3D Depth Layering */}
        <div className="space-y-2">
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#102A2A] leading-[1.08] title-3d-layered"
            style={{
              transform: `perspective(1000px) rotateX(${-y * 2.5}deg) rotateY(${x * 2.5}deg) translateZ(10px)`,
              transition: 'transform 0.1s ease-out'
            }}
          >
            Understand Where You Stand.
            <br />
            <span className="text-[#3B8F83] inline-block mt-1">
              Know What To Do Next.
            </span>
          </h1>
        </div>

        {/* Subtitle / Positioning Idea */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
          StudentLens turns raw student records into clear mathematical insights, safe absence buffers, prioritized study schedules, and career readiness.
        </p>

        {/* Primary & Secondary 3D Physical Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link to="/register" className="w-full sm:w-auto">
            <button
              type="button"
              className="btn-3d-primary w-full sm:w-auto text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white border-0 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Decision Engine</span>
              <ArrowRight className="w-4 h-4 btn-arrow-slide" />
            </button>
          </Link>

          <Link to="/login" className="w-full sm:w-auto">
            <button
              type="button"
              className="btn-3d-secondary w-full sm:w-auto text-sm sm:text-base font-bold px-8 py-3.5 rounded-xl border border-slate-300 bg-white/95 hover:bg-white text-[#102A2A] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Sign In to Command Center</span>
            </button>
          </Link>
        </div>

        {/* Truth / Reliability Pillars */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-5 sm:gap-8 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
            <ShieldCheck className="w-4 h-4 text-[#3B8F83]" />
            <span>100% Deterministic Math</span>
          </div>
          <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
            <Database className="w-4 h-4 text-[#3B8F83]" />
            <span>Real MongoDB Atlas Backend</span>
          </div>
          <div className="flex items-center gap-1.5 transition-transform hover:scale-105">
            <Lock className="w-4 h-4 text-[#3B8F83]" />
            <span>Authenticated Session Security</span>
          </div>
        </div>
      </div>

      {/* Bottom subtle edge divider */}
      <div className="relative z-10 w-full h-8 bg-gradient-to-b from-transparent to-[#F4F7F5]" />
    </section>
  );
};

export default Hero3DScene;
