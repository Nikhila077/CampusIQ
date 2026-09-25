import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  Plus,
  Sliders,
  Trash2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import attendanceService from '../services/attendanceService.js';
import subjectService from '../services/subjectService.js';

export const Attendance = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ subjects: [], overall: null });
  const [logs, setLogs] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('all');

  // Log class modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    subjectId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
    classNumber: 1,
    remarks: ''
  });
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, logsRes] = await Promise.all([
        attendanceService.getSummary(),
        attendanceService.getAll({ limit: 20 })
      ]);

      if (summaryRes?.success) {
        setData(summaryRes.data);
      }
      if (logsRes?.success) {
        setLogs(logsRes.data.records || []);
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenLogModal = (subjectId = '') => {
    setLogForm({
      subjectId: subjectId || (data.subjects[0]?.subject?._id || ''),
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      classNumber: 1,
      remarks: ''
    });
    setLogError('');
    setLogModalOpen(true);
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!logForm.subjectId) {
      setLogError('Please select a subject.');
      return;
    }

    setLogging(true);
    setLogError('');
    try {
      await attendanceService.logAttendance(logForm);
      setLogModalOpen(false);
      await fetchData();
    } catch (err) {
      setLogError(err.message || 'Failed to log class.');
    } finally {
      setLogging(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (window.confirm('Delete this attendance record?')) {
      try {
        await attendanceService.deleteAttendance(id);
        await fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete record.');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Safe
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <AlertTriangle className="w-3 h-3" /> At Risk
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertOctagon className="w-3 h-3" /> Critical
          </span>
        );
      case 'Defaulter':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertOctagon className="w-3 h-3" /> Defaulter
          </span>
        );
      default:
        return null;
    }
  };

  const filteredLogs =
    selectedSubjectId === 'all'
      ? logs
      : logs.filter((l) => l.subjectId?._id === selectedSubjectId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-[#3B8F83]" />
            Smart Attendance Engine
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Deterministic decision support: Safe absence buffers, recovery targets, and predictive what-if modeling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/attendance/simulate"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#3B8F83]/70 text-[#3B8F83] text-xs font-semibold shadow-xs transition-all"
          >
            <Sliders className="w-4 h-4 text-[#3B8F83]" />
            What-If Simulator
          </Link>
          <button
            onClick={() => handleOpenLogModal()}
            disabled={!data.subjects || data.subjects.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Log Class
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
          Calculating smart attendance buffers...
        </div>
      ) : !data.subjects || data.subjects.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 text-center bg-white shadow-xs">
          <CalendarCheck className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h2 className="text-base font-bold text-[#102A2A]">No Subjects Configured</h2>
          <p className="text-xs text-slate-600 mt-1.5 max-w-md mx-auto">
            You haven't added any subjects yet. Add your semester subjects in your Profile to start tracking attendance and unlocking automated safety buffers.
          </p>
          <Link
            to="/profile"
            className="mt-5 inline-block px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs"
          >
            Go to Profile & Add Subjects
          </Link>
        </div>
      ) : (
        <>
          {/* Top Overall Summary Cards */}
          {data.overall && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Overall Attendance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight text-[#102A2A]">
                    {data.overall.overallPercent}%
                  </span>
                  {getStatusBadge(data.overall.overallStatus)}
                </div>
                <span className="text-xs text-slate-600 mt-1 block font-medium">
                  {data.overall.totalAttended} / {data.overall.totalConducted} classes attended
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Safe Subjects</span>
                <span className="text-2xl font-black tracking-tight text-emerald-700 mt-1 block">
                  {data.overall.safeCount}
                </span>
                <span className="text-xs text-slate-600 mt-1 block font-medium">
                  Above configured threshold + 5%
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">At Risk</span>
                <span className="text-2xl font-black tracking-tight text-amber-700 mt-1 block">
                  {data.overall.atRiskCount}
                </span>
                <span className="text-xs text-slate-600 mt-1 block font-medium">
                  Within 5% of minimum requirement
                </span>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
                <span className="text-xs font-bold text-slate-700 block">Critical / Shortage</span>
                <span className="text-2xl font-black tracking-tight text-red-600 mt-1 block">
                  {data.overall.criticalCount}
                </span>
                <span className="text-xs text-slate-600 mt-1 block font-medium">
                  Below threshold — requires recovery
                </span>
              </div>
            </div>
          )}

          {/* Per-Subject Attendance Cards */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-[#102A2A] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B8F83]" />
              Subject Intelligence Cards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.subjects.map((item) => {
                const s = item.subject;
                const isUnderThreshold = item.currentPercent < item.minPercent;

                return (
                  <div
                    key={s._id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#102A2A] tracking-tight">{s.name}</h3>
                            {s.code && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                                {s.code}
                              </span>
                            )}
                          </div>
                          {s.faculty && (
                            <p className="text-xs text-slate-600 mt-0.5">Faculty: {s.faculty}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(item.status)}
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              s.priority === 'high'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : s.priority === 'medium'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-teal-50 text-teal-800 border-teal-200'
                            }`}
                          >
                            {s.priority} Priority
                          </span>
                        </div>
                      </div>

                      {/* Percentage & Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-2xl font-black text-[#102A2A]">
                            {item.currentPercent}%
                          </span>
                          <span className="text-xs text-slate-600">
                            Min Requirement: <strong className="text-[#102A2A] font-bold">{item.minPercent}%</strong>
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.status === 'Safe'
                                ? 'bg-[#3B8F83]'
                                : item.status === 'At Risk'
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, item.currentPercent)}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-xs text-slate-600 mt-1.5 font-medium">
                          <span>
                            Attended: <strong className="text-[#102A2A]">{item.attended}</strong> / {item.conducted} classes
                          </span>
                          {item.absent > 0 && <span>Absent: {item.absent}</span>}
                        </div>
                      </div>

                      {/* Smart Engine Calculated Decision Indicators */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                        {!isUnderThreshold ? (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/90 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-emerald-950">
                                Safe Absence Buffer: {item.safeAbsenceBuffer}{' '}
                                {item.safeAbsenceBuffer === 1 ? 'class' : 'classes'}
                              </span>
                              <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
                                You can safely skip {item.safeAbsenceBuffer} more classes while staying at or above {item.minPercent}%.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200/90 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-bold text-red-950">
                                Attendance Shortage ({item.minPercent - item.currentPercent}% deficit)
                              </span>
                              <p className="text-[11px] text-slate-700 mt-0.5 font-medium">
                                {item.canRecover
                                  ? `Attend the next ${item.recoveryNeeded} consecutive classes to recover to ${item.projectedRecoveryPercent}%.`
                                  : 'Cannot mathematically recover to 100% since a class was missed.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Additional insights preview */}
                        {item.insights?.length > 1 && (
                          <p className="text-[11px] text-slate-600 italic px-1">
                            "{item.insights[1]?.text}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action footer */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        to={`/attendance/simulate?subjectId=${s._id}`}
                        className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100/70 text-[#3B8F83] border border-teal-200 text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Run What-If
                      </Link>
                      <button
                        onClick={() => handleOpenLogModal(s._id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-all"
                      >
                        + Log Class
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Attendance Logs Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#102A2A]">Recent Attendance Logs</h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  History of logged class attendance sessions.
                </p>
              </div>

              {/* Subject filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-semibold">Filter:</span>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                >
                  <option value="all">All Subjects</option>
                  {data.subjects.map((item) => (
                    <option key={item.subject._id} value={item.subject._id}>
                      {item.subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-600">
                No attendance logs found for this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="pb-2.5 pl-2">Date</th>
                      <th className="pb-2.5">Subject</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5">Class #</th>
                      <th className="pb-2.5">Remarks</th>
                      <th className="pb-2.5 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 pl-2 font-mono text-[11px] text-slate-700">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 font-bold text-[#102A2A]">
                          {log.subjectId?.name || 'Subject'}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                              log.status === 'present'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : log.status === 'absent'
                                ? 'bg-red-50 text-red-800 border-red-200'
                                : log.status === 'late'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-slate-700">{log.classNumber || 1}</td>
                        <td className="py-2.5 text-slate-600 truncate max-w-[200px]">
                          {log.remarks || '—'}
                        </td>
                        <td className="py-2.5 text-right pr-2">
                          <button
                            onClick={() => handleDeleteLog(log._id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete log"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Log Attendance Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#102A2A] mb-4">Log Attendance Record</h3>

            {logError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {logError}
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                <select
                  required
                  value={logForm.subjectId}
                  onChange={(e) => setLogForm({ ...logForm, subjectId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                >
                  <option value="">Select subject...</option>
                  {data.subjects.map((item) => (
                    <option key={item.subject._id} value={item.subject._id}>
                      {item.subject.name} (Min {item.minPercent}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={logForm.date}
                    onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status *</label>
                  <select
                    value={logForm.status}
                    onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class #</label>
                  <input
                    type="number"
                    min={1}
                    value={logForm.classNumber}
                    onChange={(e) =>
                      setLogForm({ ...logForm, classNumber: Number(e.target.value) })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab experiment 4"
                    value={logForm.remarks}
                    onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {logging ? 'Recording...' : 'Log Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
