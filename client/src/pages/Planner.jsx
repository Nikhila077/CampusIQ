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
  CheckCircle2
} from 'lucide-react';
import plannerService from '../services/plannerService.js';

export const Planner = () => {
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const res = await plannerService.getPlan();
      if (res?.success) {
        setPlan(res.data.actionPlan || []);
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
            Critical Priority
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
            Scheduled Focus
          </span>
        );
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'attendance':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      case 'exam':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'assignment':
        return <ClipboardList className="w-5 h-5 text-yellow-400" />;
      case 'performance':
        return <AlertTriangle className="w-5 h-5 text-purple-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-400" />;
    }
  };

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
            Prioritized daily and weekly action recommendations with explicit, deterministic reasoning.
          </p>
        </div>

        <button
          onClick={fetchPlan}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" /> Refresh Plan
        </button>
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
        <div className="space-y-3.5">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>
              Showing <strong className="text-white">{plan.length}</strong> prioritized action items
            </span>
            <span className="text-[11px] text-indigo-400 font-medium">
              Ranked in strict order of academic urgency
            </span>
          </div>

          {plan.map((item, index) => (
            <div
              key={item.id}
              className={`bg-slate-900/40 border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                item.priority === 'critical'
                  ? 'border-red-500/40 bg-red-950/10'
                  : item.priority === 'high'
                  ? 'border-orange-500/30 bg-orange-950/5'
                  : 'border-slate-800/80 hover:border-slate-700/80'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <span className="text-xs font-black font-mono text-slate-500 mb-1">
                    #{index + 1}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(item.category)}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    {getPriorityBadge(item.priority)}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {item.reason}
                  </p>

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-indigo-400">{item.subject}</span>
                    <span>•</span>
                    <span className="uppercase text-[10px] tracking-wider">{item.category}</span>
                  </div>
                </div>
              </div>

              {item.actionUrl && (
                <div className="shrink-0 pl-12 sm:pl-0">
                  <Link
                    to={item.actionUrl}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
                  >
                    <span>Take Action</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Planner;
