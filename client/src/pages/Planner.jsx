import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  AlertOctagon,
  AlertTriangle,
  GraduationCap,
  ClipboardList,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Check,
  Zap,
  Target,
  Flame
} from 'lucide-react';
import plannerService from '../services/plannerService.js';
import gamificationService from '../services/gamificationService.js';

export const Planner = () => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [gamification, setGamification] = useState({ xp: 0, currentStreak: 0 });

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const [res, gRes] = await Promise.all([
        plannerService.getPlan(),
        gamificationService.getSummary()
      ]);
      if (res?.success) {
        setPlan(res.data.actionPlan || []);
      }
      if (gRes?.success) {
        setGamification(gRes.data);
      }
    } catch (err) {
      console.error('Error fetching academic plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleCompleteTask = async (taskId) => {
    if (completedTasks.includes(taskId)) return;
    try {
      setCompletedTasks((prev) => [...prev, taskId]);
      const res = await gamificationService.logAction('planner_task', 5, { taskId });
      if (res?.success) {
        setGamification((prev) => ({
          ...prev,
          xp: (prev.xp || 0) + 5,
          currentStreak: res.data.currentStreak || prev.currentStreak
        }));
      }
    } catch (err) {
      console.error('Error completing task:', err);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Low Priority
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'attendance':
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'exam':
        return <GraduationCap className="w-4 h-4 text-indigo-400" />;
      case 'assignment':
        return <ClipboardList className="w-4 h-4 text-yellow-400" />;
      case 'performance':
        return <AlertTriangle className="w-4 h-4 text-purple-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  const highPriorityTasks = plan.filter(
    (p) => p.priority === 'critical' || p.priority === 'high'
  );
  const mediumPriorityTasks = plan.filter((p) => p.priority === 'medium');
  const lowPriorityTasks = plan.filter(
    (p) => p.priority !== 'critical' && p.priority !== 'high' && p.priority !== 'medium'
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-indigo-400" />
            Smart Academic Decision Planner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized daily and weekly action recommendations with explicit reasoning. Complete actions to earn +5 XP each!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400">{gamification.currentStreak || 0}d Streak</span>
          </div>
          <button
            onClick={fetchPlan}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" /> Refresh Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Synthesizing academic schedules, exams, and attendance buffers...
        </div>
      ) : plan.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center bg-slate-900/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">All Caught Up!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No critical attendance shortages, upcoming exams, or pending overdue assignments right now. You are in a safe academic zone.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION: HIGH PRIORITY (Critical / Immediate) */}
          {highPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-red-400">
                  High Priority Actions ({highPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {highPriorityTasks.map((item, idx) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                          : 'bg-red-950/20 border-red-500/30 hover:border-red-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-700 hover:border-indigo-400 bg-slate-900'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              +5 XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-indigo-400">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
                          >
                            <span>Action</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: MEDIUM PRIORITY */}
          {mediumPriorityTasks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  Medium Priority Actions ({mediumPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {mediumPriorityTasks.map((item) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                          : 'bg-yellow-950/15 border-yellow-500/30 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-700 hover:border-indigo-400 bg-slate-900'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                              +5 XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-indigo-400">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold shadow-sm transition-all"
                          >
                            <span>Action</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION: LOW PRIORITY */}
          {lowPriorityTasks.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Scheduled Tasks ({lowPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {lowPriorityTasks.map((item) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                        isDone
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-700 hover:border-indigo-400 bg-slate-900'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium">
                            {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-400">
                            <span className="font-semibold text-indigo-400">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold shadow-sm transition-all"
                          >
                            <span>Action</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Planner;
