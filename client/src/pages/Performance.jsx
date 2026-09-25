import { useState, useEffect } from 'react';
import {
  BarChart3,
  Award,
  TrendingUp,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import markService from '../services/markService.js';
import subjectService from '../services/subjectService.js';

export const Performance = () => {
  const [marks, setMarks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    subjectId: '',
    examType: 'Midterm 1',
    marksObtained: '',
    totalMarks: 50,
    remarks: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [markRes, subRes] = await Promise.all([
        markService.getMarks(),
        subjectService.getSubjects()
      ]);

      if (markRes?.success) {
        setMarks(markRes.data.marks || []);
        setSummary(markRes.data.summary || null);
      }
      if (subRes?.success) setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error('Error loading marks:', err);
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
      examType: 'Midterm 1',
      marksObtained: '',
      totalMarks: 50,
      remarks: ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSaveMark = async (e) => {
    e.preventDefault();
    const obtained = Number(form.marksObtained);
    const total = Number(form.totalMarks);

    if (isNaN(obtained) || obtained < 0) {
      setError('Marks obtained must be a positive number.');
      return;
    }
    if (isNaN(total) || total <= 0) {
      setError('Total marks must be greater than zero.');
      return;
    }
    if (obtained > total) {
      setError('Marks obtained cannot exceed total marks.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await markService.createMark({
        ...form,
        marksObtained: obtained,
        totalMarks: total
      });
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to record marks.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMark = async (id) => {
    if (window.confirm('Delete this assessment record?')) {
      try {
        await markService.deleteMark(id);
        await fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete mark.');
      }
    }
  };

  // Group marks by subject for Recharts visualization
  const subjectChartData = subjects.map((sub) => {
    const subMarks = marks.filter((m) => m.subjectId?._id === sub._id);
    let totalObt = 0;
    let totalMax = 0;
    for (const m of subMarks) {
      totalObt += m.marksObtained;
      totalMax += m.totalMarks;
    }
    const avgPercent = totalMax > 0 ? Number(((totalObt / totalMax) * 100).toFixed(1)) : 0;

    return {
      name: sub.code || sub.name.substring(0, 10),
      fullName: sub.name,
      percentage: avgPercent,
      assessments: subMarks.length
    };
  }).filter((item) => item.assessments > 0);

  // Chronological assessment trend
  const timelineData = [...marks]
    .reverse()
    .map((m, idx) => ({
      index: `#${idx + 1}`,
      subject: m.subjectId?.name || 'Subject',
      percentage: m.percentage,
      examType: m.examType
    }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#3B8F83]" />
            Academic Performance Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Real marks and assessment trends. Identify strengths and academic improvement areas.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record Marks
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">Loading performance data...</div>
      ) : marks.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 text-center bg-white shadow-xs">
          <Award className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#102A2A]">No marks recorded yet</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            Log your midterm scores, quizzes, or lab assessments to generate visual performance charts and unlock personalized study recommendations.
          </p>
          <button
            onClick={handleOpenModal}
            disabled={subjects.length === 0}
            className="mt-4 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            Record First Assessment
          </button>
        </div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          {summary && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Overall Score</span>
                <span className="text-2xl font-black text-[#102A2A] mt-1 block">
                  {summary.overallPercentage}%
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                  {summary.totalObtained} / {summary.totalMax} total marks
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Overall Grade</span>
                <span className="text-2xl font-black text-[#3B8F83] mt-1 block">
                  {summary.overallGrade}
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                  Weighted academic tier
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Total Assessments</span>
                <span className="text-2xl font-black text-[#102A2A] mt-1 block">
                  {summary.totalAssessments}
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                  Logged across all subjects
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Benchmark Status</span>
                <span
                  className={`text-2xl font-black mt-1 block ${
                    summary.overallPercentage >= 75
                      ? 'text-emerald-700'
                      : summary.overallPercentage >= 60
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  {summary.overallPercentage >= 75
                    ? 'Distinction'
                    : summary.overallPercentage >= 60
                    ? 'Passing'
                    : 'Needs Focus'}
                </span>
                <span className="text-[11px] text-slate-600 font-medium mt-1 block">
                  Target threshold: 75%
                </span>
              </div>
            </div>
          )}

          {/* Recharts Data Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Subject Comparison Bar Chart */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
                    Subject Performance Comparison
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Average percentage achieved per registered subject
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl text-xs text-[#102A2A]">
                              <span className="font-bold block">{item.fullName}</span>
                              <span className="text-[#3B8F83] font-bold block mt-1">
                                Score: {item.percentage}% ({item.assessments} tests)
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="percentage" fill="#3B8F83" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Assessment Timeline Chart */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
                    Assessment Score Progression
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Chronological performance trajectory across consecutive tests
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="index" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-xl text-xs text-[#102A2A]">
                              <span className="font-bold block">{item.subject}</span>
                              <span className="text-slate-600 text-[10px] block">{item.examType}</span>
                              <span className="text-[#3B8F83] font-bold block mt-1">
                                {item.percentage}%
                              </span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#102A2A"
                      strokeWidth={2.5}
                      dot={{ fill: '#3B8F83', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Assessment Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-[#102A2A]">All Recorded Assessments</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="pb-2.5 pl-2">Subject</th>
                    <th className="pb-2.5">Assessment Type</th>
                    <th className="pb-2.5">Marks Obtained</th>
                    <th className="pb-2.5">Percentage</th>
                    <th className="pb-2.5">Grade</th>
                    <th className="pb-2.5">Remarks</th>
                    <th className="pb-2.5 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {marks.map((m) => (
                    <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 pl-2 font-bold text-[#102A2A]">
                        {m.subjectId?.name || 'Subject'}
                      </td>
                      <td className="py-2.5 font-medium">{m.examType}</td>
                      <td className="py-2.5 font-mono">
                        {m.marksObtained} / {m.totalMarks}
                      </td>
                      <td className="py-2.5 font-mono font-bold text-[#3B8F83]">
                        {m.percentage}%
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          {m.grade || '—'}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600 truncate max-w-[150px]">
                        {m.remarks || '—'}
                      </td>
                      <td className="py-2.5 text-right pr-2">
                        <button
                          onClick={() => handleDeleteMark(m._id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Record Marks Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#102A2A] mb-4">Record Assessment Marks</h3>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveMark} className="space-y-4">
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
                  Assessment / Exam Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm 1, Quiz 2, Practical Final"
                  value={form.examType}
                  onChange={(e) => setForm({ ...form, examType: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Marks Obtained *
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="0.5"
                    required
                    placeholder="e.g. 42"
                    value={form.marksObtained}
                    onChange={(e) => setForm({ ...form, marksObtained: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Marks *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    placeholder="e.g. 50"
                    value={form.totalMarks}
                    onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teacher Remarks / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Good grasp of normalization concepts"
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
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
                  {saving ? 'Saving...' : 'Save Marks'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Performance;
