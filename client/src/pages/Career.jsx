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
  ChevronRight
} from 'lucide-react';
import careerService from '../services/careerService.js';
import useAuth from '../hooks/useAuth.js';

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-indigo-400" />
            Career Readiness & Skill Gap Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic curriculum coverage tracking, role alignments, and prioritized skill gaps.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Analyzing skill inventory against role benchmarks...
        </div>
      ) : !data ? (
        <div className="p-8 text-center text-xs text-red-400">Failed to load career data.</div>
      ) : (
        <div className="space-y-6">
          {/* Target Role & Readiness Banner */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/40 border border-indigo-500/20 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Target Role
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {data.targetRole}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">{data.roleDescription}</p>
            </div>

            {/* Score Gauge */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-center shrink-0 min-w-[200px]">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                Curriculum Coverage
              </span>
              <div className="text-4xl font-black text-indigo-400">{data.readinessScore}%</div>
              <span className="text-[10px] text-slate-500 block mt-1">
                {data.matchedSkills?.length || 0} of {data.totalCoreSkills} core competencies acquired
              </span>
            </div>
          </div>

          {/* Biggest Skill Gap & Suggested Focus Spotlight */}
          {biggestGap && (
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Highest Priority Gap
                  </span>
                  <h3 className="text-sm font-bold text-white">Your Biggest Skill Gap: {biggestGap}</h3>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Suggested Focus:</strong> {getSuggestedFocus(biggestGap)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Solve Daily Brain Boost</span>
                </Link>
              </div>
            </div>
          )}

          {/* Core Competencies Progress Grid */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Core Competencies for {data.targetRole}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(data.coreSkills || []).map((skill) => {
                const isAcquired = (data.matchedSkills || []).includes(skill);
                return (
                  <div
                    key={skill}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isAcquired
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isAcquired ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs font-bold text-white">{skill}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                        isAcquired
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
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
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4" /> Recommended Portfolio Projects for {data.targetRole}
                </h3>
                <Link to="/projects" className="text-xs text-indigo-400 hover:underline">
                  Project Hub →
                </Link>
              </div>
              <p className="text-xs text-slate-400">
                Building one of these projects demonstrates mastery of your target role's core stack.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {data.recommendedProjects.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs font-semibold text-white flex items-center gap-2"
                  >
                    <Code2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Update Career Target & Skills Form */}
          <form
            onSubmit={handleSavePreferences}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Customize Target Role & Skills
            </h3>

            {updateMsg && (
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
                {updateMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Change Target Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {(data.availableRoles || []).map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  My Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Python, SQL, React, Git, DSA"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Career Target'}
              </button>
            </div>
          </form>

          {/* Transparent Disclaimer Alert */}
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{data.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Career;
