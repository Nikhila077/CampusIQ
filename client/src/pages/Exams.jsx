import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  FileText
} from 'lucide-react';
import examService from '../services/examService.js';
import subjectService from '../services/subjectService.js';

export const Exams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    subjectId: '',
    examType: 'midterm',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    venue: '',
    syllabus: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examRes, subRes] = await Promise.all([
        examService.getExams(),
        subjectService.getSubjects()
      ]);

      if (examRes?.success) setExams(examRes.data.exams || []);
      if (subRes?.success) setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error('Error fetching exams:', err);
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
      examType: 'midterm',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      startTime: '10:00',
      venue: '',
      syllabus: ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSaveExam = async (e) => {
    e.preventDefault();
    if (!form.subjectId) {
      setError('Please select a subject.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await examService.createExam(form);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to schedule exam.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExam = async (id, subjectName) => {
    if (window.confirm(`Delete exam for ${subjectName}?`)) {
      try {
        await examService.deleteExam(id);
        setExams((prev) => prev.filter((e) => e._id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete exam.');
      }
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            Exam Schedules & Countdown
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track midterms, finals, quizzes, and practical assessments with live preparation countdowns.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Schedule Exam
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading exams...</div>
      ) : exams.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center bg-slate-900/20">
          <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-300">No exams scheduled</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Add your upcoming midterms, finals, or practical dates so the Smart Planner can prioritize study sessions for you.
          </p>
          <button
            onClick={handleOpenModal}
            disabled={subjects.length === 0}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50"
          >
            Schedule First Exam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const examDate = new Date(exam.date);
            const diffDays = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
            const isPast = diffDays < 0;

            return (
              <div
                key={exam._id}
                className={`bg-slate-900/40 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isPast
                    ? 'border-slate-800/40 opacity-60'
                    : diffDays <= 2
                    ? 'border-red-500/40 bg-red-950/10'
                    : diffDays <= 7
                    ? 'border-yellow-500/40'
                    : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block mb-1">
                        {exam.examType}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {exam.subjectId?.name || 'Subject Exam'}
                      </h3>
                      {exam.subjectId?.code && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {exam.subjectId.code}
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      {isPast ? (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          Completed
                        </span>
                      ) : diffDays === 0 ? (
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                          Today!
                        </span>
                      ) : diffDays === 1 ? (
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">
                          Tomorrow
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          In {diffDays} days
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{examDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{exam.startTime || '10:00 AM'}</span>
                    </div>
                  </div>

                  {exam.venue && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Venue: {exam.venue}</span>
                    </div>
                  )}

                  {exam.syllabus && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300 block mb-0.5">Syllabus:</span>
                      <p className="line-clamp-2">{exam.syllabus}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                  <button
                    onClick={() => handleDeleteExam(exam._id, exam.subjectId?.name)}
                    className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                    title="Delete exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Exam Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Schedule Upcoming Exam</h3>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveExam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                <select
                  required
                  value={form.subjectId}
                  onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Select subject...</option>
                  {subjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Exam Type *
                  </label>
                  <select
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="practical">Practical / Lab</option>
                    <option value="viva">Viva Voce</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Venue</label>
                  <input
                    type="text"
                    placeholder="e.g. Exam Hall 4"
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Syllabus Units / Chapters
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Units 1, 2, 3: Relational Algebra & SQL Normalization"
                  value={form.syllabus}
                  onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Scheduling...' : 'Save Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;
