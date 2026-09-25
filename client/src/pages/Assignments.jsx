import { useState, useEffect } from 'react';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  BookOpen
} from 'lucide-react';
import assignmentService from '../services/assignmentService.js';
import subjectService from '../services/subjectService.js';
import gamificationService from '../services/gamificationService.js';

export const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'submitted' | 'overdue'

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    subjectId: '',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [asgRes, subRes] = await Promise.all([
        assignmentService.getAssignments(),
        subjectService.getSubjects()
      ]);

      if (asgRes?.success) setAssignments(asgRes.data.assignments || []);
      if (subRes?.success) setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    setForm({
      subjectId: subjects[0]?._id || '',
      title: '',
      description: '',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium'
    });
    setError('');
    setModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!form.subjectId) {
      setError('Please select a subject.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await assignmentService.createAssignment(form);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to create assignment.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (assignment) => {
    const newStatus = assignment.status === 'submitted' ? 'pending' : 'submitted';
    try {
      await assignmentService.updateStatus(assignment._id, newStatus);
      if (newStatus === 'submitted') {
        try {
          await gamificationService.logAction('assignment_complete', 15, {
            assignmentId: assignment._id
          });
        } catch (gErr) {
          console.error('Gamification log error:', gErr);
        }
      }
      setAssignments((prev) =>
        prev.map((a) =>
          a._id === assignment._id
            ? {
                ...a,
                status: newStatus,
                submittedAt: newStatus === 'submitted' ? new Date().toISOString() : null
              }
            : a
        )
      );
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const handleDeleteAssignment = async (id, title) => {
    if (window.confirm(`Delete assignment "${title}"?`)) {
      try {
        await assignmentService.deleteAssignment(id);
        setAssignments((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete assignment.');
      }
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in3Days = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  const filteredAssignments = assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const isOverdue = a.status === 'pending' && due < today;
    const isDueSoon = a.status === 'pending' && due >= today && due <= in3Days;

    if (filterTab === 'due_soon') return isDueSoon;
    if (filterTab === 'overdue') return isOverdue;
    if (filterTab === 'completed') return a.status === 'submitted';
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[#3B8F83]" />
            Assignment & Deliverable Tracking
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Stay on top of coursework submissions, deadlines, and earn +15 XP for every completed assignment.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Assignment
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
        {[
          { key: 'all', label: 'All', count: assignments.length },
          {
            key: 'due_soon',
            label: 'Due Soon',
            count: assignments.filter(
              (a) => a.status === 'pending' && new Date(a.dueDate) >= today && new Date(a.dueDate) <= in3Days
            ).length
          },
          {
            key: 'overdue',
            label: 'Overdue',
            count: assignments.filter((a) => a.status === 'pending' && new Date(a.dueDate) < today).length
          },
          {
            key: 'completed',
            label: 'Completed',
            count: assignments.filter((a) => a.status === 'submitted').length
          }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              filterTab === tab.key
                ? 'bg-[#3B8F83] text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 bg-white border border-slate-200/90'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">Loading assignments...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 text-center bg-white shadow-xs">
          <ClipboardList className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#102A2A]">No assignments found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            {filterTab === 'all'
              ? 'Add your course assignments, lab reports, or project submissions to track deadlines.'
              : `No assignments under "${filterTab}".`}
          </p>
          {filterTab === 'all' && (
            <button
              onClick={handleOpenModal}
              disabled={subjects.length === 0}
              className="mt-4 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
            >
              Add First Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAssignments.map((a) => {
            const dueDate = new Date(a.dueDate);
            const isOverdue = a.status === 'pending' && dueDate < today;
            const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={a._id}
                className={`bg-white border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all shadow-xs ${
                  a.status === 'submitted'
                    ? 'border-slate-200/80 opacity-75 bg-slate-50/50'
                    : isOverdue
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-slate-200/90 hover:border-[#3B8F83]/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <button
                    onClick={() => handleToggleStatus(a)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                      a.status === 'submitted'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-[#3B8F83] text-transparent bg-white'
                    }`}
                    title={a.status === 'submitted' ? 'Mark pending' : 'Mark submitted'}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-bold tracking-tight ${
                          a.status === 'submitted' ? 'line-through text-slate-400' : 'text-[#102A2A]'
                        }`}
                      >
                        {a.title}
                      </h3>
                      {a.priority && (
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            a.priority === 'high'
                              ? 'bg-red-100 text-red-900 border border-red-200'
                              : a.priority === 'medium'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {a.priority}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                      <span className="font-bold text-[#3B8F83]">
                        {a.subjectId?.name || 'General'}
                      </span>
                      {a.description && (
                        <span className="text-slate-600 truncate max-w-sm">
                          • {a.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Due Date & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-9 sm:pl-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className={isOverdue ? 'text-red-700 font-bold' : 'text-slate-700 font-semibold'}>
                        {dueDate.toLocaleDateString()}
                      </span>
                    </div>

                    <span className="text-[10px] block mt-0.5">
                      {a.status === 'submitted' ? (
                        <span className="text-emerald-800 font-bold">Submitted</span>
                      ) : isOverdue ? (
                        <span className="text-red-700 font-bold">Overdue</span>
                      ) : diffDays === 0 ? (
                        <span className="text-amber-800 font-bold">Due today</span>
                      ) : diffDays === 1 ? (
                        <span className="text-amber-800 font-semibold">Due tomorrow</span>
                      ) : (
                        <span className="text-slate-600 font-medium">{diffDays} days left</span>
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteAssignment(a._id, a.title)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#102A2A] mb-4">Add Assignment Deliverable</h3>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveAssignment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  required
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                >
                  <option value="">Select subject...</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Report 3: B-Tree Implementations"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Details, submission link, guidelines..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {saving ? 'Creating...' : 'Create Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
