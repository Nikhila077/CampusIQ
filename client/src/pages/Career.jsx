import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Info,
  BookOpen,
  Code2,
  FolderGit2,
  Zap,
  Target,
  ChevronRight,
  Check,
  Compass
} from 'lucide-react';
import careerService from '../services/careerService.js';
import useAuth from '../hooks/useAuth.js';
import { Skeleton } from '../components/ui/Loader.jsx';

export const Career = () => {
  const { user, checkAuth } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const fetchReadiness = async () => {
    try {
      setLoading(true);
      const res = await careerService.getReadiness();
      if (res?.success) {
        setData(res.data);
        setSelectedRole(res.data.targetRole);
        setSkillsInput((res.data.studentSkills || []).join(', '));
      }
    } catch (err) {
      console.error('Error fetching career readiness:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateMsg('');

    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await careerService.updateTarget({
        targetRole: selectedRole,
        skills
      });

      setUpdateMsg('Target career role and skills updated successfully.');
      await checkAuth();
      await fetchReadiness();
    } catch (err) {
      setUpdateMsg(err.message || 'Failed to update preferences.');
    } finally {
      setUpdating(false);
    }
  };

  // Derive biggest skill gap and suggested focus roadmap
  const biggestGap = data?.missingSkills && data.missingSkills.length > 0 ? data.missingSkills[0] : null;

  const getSuggestedFocus = (gap) => {
    if (!gap) return 'Advanced System Architecture & Optimization';
    switch (gap.toLowerCase()) {
      case 'dsa':
        return 'Arrays → Strings → Hashing → Trees & Graphs';
      case 'sql':
      case 'dbms':
        return 'Normalization → Complex JOINs → Indexing & B+ Trees';
      case 'react':
        return 'Hooks → Context & State Management → Performance Optimization';
      case 'python':
        return 'Data Structures → OOP & Modules → Scripting & Asynchronous I/O';
      case 'git':
        return 'Branching Strategies → Rebasing → Conflict Resolution';
      default:
        return 'Fundamental Concepts → Problem Sets → Guided Projects';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-teal-50 border border-teal-200/80 text-[#3B8F83] shadow-xs">
              <Briefcase className="w-5 h-5" />
            </span>
            Career Readiness & Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Deterministic curriculum coverage tracking, role alignments, and prioritized skill gaps.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="h-44 rounded-2xl border border-slate-200/90 bg-white p-6 space-y-4 shadow-xs">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-10 w-3/5" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : !data ? (
        <div className="p-8 text-center text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl">
          Failed to load career data.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Target Role & Readiness Banner */}
          <div className="bg-[#102A2A] text-white border border-[#102A2A] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-md relative overflow-hidden transition-all duration-300 card-depth-3d">
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#3B8F83]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-2 max-w-xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B8F83]/30 border border-[#3B8F83]/50 text-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                Target Role
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {data.targetRole}
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed">{data.roleDescription}</p>
            </div>

            {/* Score Gauge */}
            <div className="p-5 rounded-2xl bg-[#143333] border border-[#3B8F83]/40 text-center shrink-0 min-w-[220px] relative z-10 shadow-xs hover:border-[#3B8F83] transition-colors">
              <span className="text-[10px] uppercase font-bold text-slate-300 block mb-1">
                Curriculum Coverage
              </span>
              <div className="text-4xl font-black text-[#E8F5F2]">{data.readinessScore}%</div>
              
              {/* Visual mini progress bar */}
              <div className="w-full bg-slate-800/80 rounded-full h-2 mt-2 overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(100, Math.max(5, data.readinessScore || 0))}%` }}
                />
              </div>

              <span className="text-[10px] text-slate-300 font-medium block mt-2">
                {data.matchedSkills?.length || 0} of {data.totalCoreSkills} core competencies acquired
              </span>
            </div>
          </div>

          {/* Biggest Skill Gap & Suggested Focus Spotlight */}
          {biggestGap && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#E8F5F2] to-teal-50/80 border border-[#3B8F83]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs card-lift">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#3B8F83] text-white shadow-xs">
                    Highest Priority Gap
                  </span>
                  <h3 className="text-sm font-bold text-[#102A2A]">Your Biggest Skill Gap: {biggestGap}</h3>
                </div>
                <p className="text-xs text-slate-700">
                  <strong className="text-[#102A2A]">Suggested Focus:</strong> {getSuggestedFocus(biggestGap)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Solve Daily Brain Boost</span>
                  <ArrowRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Core Competencies Progress Grid */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3B8F83]" />
                Core Competencies for {data.targetRole}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {data.matchedSkills?.length || 0} / {data.coreSkills?.length || 0} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(data.coreSkills || []).map((skill) => {
                const isAcquired = (data.matchedSkills || []).includes(skill);
                return (
                  <div
                    key={skill}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 card-lift ${
                      isAcquired
                        ? 'bg-teal-50/70 border-teal-200/90 text-teal-950 font-bold hover:border-teal-300'
                        : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isAcquired ? (
                        <div className="p-1 rounded-full bg-teal-100 text-[#3B8F83] shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-1 rounded-full bg-slate-200/80 text-slate-400 shrink-0">
                          <XCircle className="w-4 h-4" />
                        </div>
                      )}
                      <span className="text-xs font-bold text-[#102A2A] truncate">{skill}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 ${
                        isAcquired
                          ? 'bg-teal-100/80 text-teal-900 border border-teal-200/70'
                          : 'bg-slate-200/90 text-slate-600'
                      }`}
                    >
                      {isAcquired ? 'Mastered' : 'Gap'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Portfolio Projects */}
          {data.recommendedProjects && data.recommendedProjects.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#3B8F83]" /> Recommended Portfolio Projects for {data.targetRole}
                </h3>
                <Link
                  to="/projects"
                  className="text-xs font-bold text-[#3B8F83] hover:text-[#2d6f66] flex items-center gap-1 group transition-colors"
                >
                  <span>Project Hub</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
              <p className="text-xs text-slate-600">
                Building one of these projects demonstrates mastery of your target role's core stack.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {data.recommendedProjects.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-[#3B8F83]/50 text-xs font-bold text-[#102A2A] flex items-center gap-3 transition-all duration-200 card-lift group"
                  >
                    <div className="p-2 rounded-lg bg-teal-50 text-[#3B8F83] group-hover:bg-[#3B8F83] group-hover:text-white transition-colors shrink-0">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span className="leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update Career Target & Skills Form */}
          <form
            onSubmit={handleSavePreferences}
            className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs"
          >
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
                Customize Target Role & Skills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Align your degree progress against custom industry profiles.
              </p>
            </div>

            {updateMsg && (
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-[#3B8F83] shrink-0" />
                <span>{updateMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Change Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                >
                  {(data.availableRoles || []).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  My Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, React, Git, DSA"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Career Target'}
              </button>
            </div>
          </form>

          {/* Transparent Disclaimer Alert */}
          <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#3B8F83] shrink-0 mt-0.5" />
            <p className="leading-relaxed">{data.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Career;
