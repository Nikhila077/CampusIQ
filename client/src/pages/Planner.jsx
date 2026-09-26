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
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200">
            Critical
          </span>
        );
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-900 border border-teal-300">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-700 border border-slate-200">
            Low Priority
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'attendance':
        return <AlertOctagon className="w-4 h-4 text-red-600" />;
      case 'exam':
        return <GraduationCap className="w-4 h-4 text-[#3B8F83]" />;
      case 'assignment':
        return <ClipboardList className="w-4 h-4 text-amber-600" />;
      case 'performance':
        return <AlertTriangle className="w-4 h-4 text-purple-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#3B8F83]" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <Clock className="w-6 h-6 text-[#3B8F83]" />
            Smart Academic Decision Planner
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Prioritized daily and weekly action recommendations with explicit reasoning. Complete actions to earn +5 XP each!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-950 shadow-xs">
            <Flame className="w-4 h-4 text-[#3B8F83] fill-[#3B8F83]/20" />
            <span>{gamification.currentStreak || 0}d Streak</span>
          </div>
          <button
            onClick={fetchPlan}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Refresh Plan
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 h-20 skeleton-shimmer shadow-xs" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200/90 bg-white p-4.5 h-24 skeleton-shimmer shadow-xs" />
          ))}
        </div>
      ) : plan.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 text-center bg-white shadow-xs">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2 animate-subtle-float" />
          <h3 className="text-base font-bold text-[#102A2A]">All Caught Up!</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            No critical attendance shortages, upcoming exams, or pending overdue assignments right now. You are in a safe academic zone.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily Completion Progress Banner */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-2xs card-lift">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#3B8F83]" />
                <span className="text-xs font-bold text-[#102A2A]">Daily Action Plan Velocity</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#3B8F83]">
                {completedTasks.length} / {plan.length} actions completed ({Math.round((completedTasks.length / (plan.length || 1)) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#3B8F83] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.round((completedTasks.length / (plan.length || 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* SECTION: HIGH PRIORITY (Critical / Immediate) */}
          {highPriorityTasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  High Priority Actions ({highPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {highPriorityTasks.map((item) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 shadow-2xs card-lift ${
                        isDone
                          ? 'bg-slate-50/80 border-slate-200/90 opacity-60'
                          : 'bg-white border-rose-200/90 hover:border-rose-400 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-[#3B8F83] bg-white'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-[#102A2A]'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              +5 XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            <strong className="text-slate-900">Reason:</strong> {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-600">
                            <span className="font-bold text-[#3B8F83]">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all"
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
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Medium Priority Actions ({mediumPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {mediumPriorityTasks.map((item) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all shadow-xs ${
                        isDone
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-[#3B8F83] bg-white'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-[#102A2A]'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                            <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              +5 XP
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            <strong className="text-slate-900">Reason:</strong> {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-600">
                            <span className="font-bold text-[#3B8F83]">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all"
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
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                  Scheduled Tasks ({lowPriorityTasks.length})
                </h2>
              </div>

              <div className="space-y-2.5">
                {lowPriorityTasks.map((item) => {
                  const isDone = completedTasks.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all shadow-xs ${
                        isDone
                          ? 'bg-slate-50 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => handleCompleteTask(item.id)}
                          disabled={isDone}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-[#3B8F83] bg-white'
                          }`}
                          title="Complete task (+5 XP)"
                        >
                          {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-[#102A2A]'}`}>
                              {item.title}
                            </h3>
                            {getPriorityBadge(item.priority)}
                          </div>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {item.reason}
                          </p>
                          <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-600">
                            <span className="font-bold text-[#3B8F83]">{item.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                      </div>

                      {item.actionUrl && !isDone && (
                        <div className="shrink-0 pl-9 sm:pl-0">
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-[#3B8F83]/40 text-slate-800 text-xs font-semibold shadow-xs transition-all"
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
