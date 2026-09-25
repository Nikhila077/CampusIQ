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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-indigo-400" />
            Smart Attendance Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic decision support: Safe absence buffers, recovery targets, and predictive what-if modeling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/attendance/simulate"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-indigo-300 text-xs font-semibold shadow-sm transition-all"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            What-If Simulator
          </Link>
          <button
            onClick={() => handleOpenLogModal()}
            disabled={!data.subjects || data.subjects.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Log Class
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Calculating smart attendance buffers...
        </div>
      ) : !data.subjects || data.subjects.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 text-center bg-slate-900/20">
          <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">No Subjects Configured</h2>
          <p className="text-xs text-slate-400 mt-1.5 max-w-md mx-auto">
            You haven't added any subjects yet. Add your semester subjects in your Profile to start tracking attendance and unlocking automated safety buffers.
          </p>
          <Link
            to="/profile"
            className="mt-5 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Go to Profile & Add Subjects
          </Link>
        </div>
      ) : (
        <>
          {/* Top Overall Summary Cards */}
          {data.overall && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[11px] font-medium text-slate-400 block">Overall Attendance</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black tracking-tight text-white">
                    {data.overall.overallPercent}%
                  </span>
                  {getStatusBadge(data.overall.overallStatus)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {data.overall.totalAttended} / {data.overall.totalConducted} classes attended
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[11px] font-medium text-slate-400 block">Safe Subjects</span>
                <span className="text-2xl font-black tracking-tight text-emerald-400 mt-1 block">
                  {data.overall.safeCount}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Above configured threshold + 5%
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[11px] font-medium text-slate-400 block">At Risk</span>
                <span className="text-2xl font-black tracking-tight text-yellow-400 mt-1 block">
                  {data.overall.atRiskCount}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Within 5% of minimum requirement
                </span>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4">
                <span className="text-[11px] font-medium text-slate-400 block">Critical / Shortage</span>
                <span className="text-2xl font-black tracking-tight text-red-400 mt-1 block">
                  {data.overall.criticalCount}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Below threshold — requires recovery
                </span>
              </div>
            </div>
          )}

          {/* Per-Subject Attendance Cards */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Subject Intelligence Cards
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.subjects.map((item) => {
                const s = item.subject;
                const isUnderThreshold = item.currentPercent < item.minPercent;

                return (
                  <div
                    key={s._id}
                    className="bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all"
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white tracking-tight">{s.name}</h3>
                            {s.code && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                                {s.code}
                              </span>
                            )}
                          </div>
                          {s.faculty && (
                            <p className="text-xs text-slate-400 mt-0.5">Faculty: {s.faculty}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(item.status)}
                          <span
                            className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                              s.priority === 'high'
                                ? 'bg-red-500/10 text-red-400'
                                : s.priority === 'medium'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {s.priority} Priority
                          </span>
                        </div>
                      </div>

                      {/* Percentage & Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <span className="text-2xl font-black text-white">
                            {item.currentPercent}%
                          </span>
                          <span className="text-xs text-slate-400">
                            Min Requirement: <strong className="text-slate-200">{item.minPercent}%</strong>
                          </span>
                        </div>

                        {/* Progress track */}
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              item.status === 'Safe'
                                ? 'bg-emerald-500'
                                : item.status === 'At Risk'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, item.currentPercent)}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                          <span>
                            Attended: <strong>{item.attended}</strong> / {item.conducted} classes
                          </span>
                          {item.absent > 0 && <span>Absent: {item.absent}</span>}
                        </div>
                      </div>

                      {/* Smart Engine Calculated Decision Indicators */}
                      <div className="mt-4 pt-3.5 border-t border-slate-800/60 space-y-2">
                        {!isUnderThreshold ? (
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-semibold text-emerald-300">
                                Safe Absence Buffer: {item.safeAbsenceBuffer}{' '}
                                {item.safeAbsenceBuffer === 1 ? 'class' : 'classes'}
                              </span>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                You can safely skip {item.safeAbsenceBuffer} more classes while staying at or above {item.minPercent}%.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="font-semibold text-red-300">
                                Attendance Shortage ({item.minPercent - item.currentPercent}% deficit)
                              </span>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {item.canRecover
                                  ? `Attend the next ${item.recoveryNeeded} consecutive classes to recover to ${item.projectedRecoveryPercent}%.`
                                  : 'Cannot mathematically recover to 100% since a class was missed.'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Additional insights preview */}
                        {item.insights?.length > 1 && (
                          <p className="text-[11px] text-slate-400 italic px-1">
                            "{item.insights[1]?.text}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quick Action footer */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                      <Link
                        to={`/attendance/simulate?subjectId=${s._id}`}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Run What-If
                      </Link>
                      <button
                        onClick={() => handleOpenLogModal(s._id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
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
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Recent Attendance Logs</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  History of logged class attendance sessions.
                </p>
              </div>

              {/* Subject filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Filter:</span>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
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
              <div className="py-8 text-center text-xs text-slate-500">
                No attendance logs found for this filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-medium">
                    <tr>
                      <th className="pb-2.5 pl-2">Date</th>
                      <th className="pb-2.5">Subject</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5">Class #</th>
                      <th className="pb-2.5">Remarks</th>
                      <th className="pb-2.5 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-slate-300">
                    {filteredLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-800/20">
                        <td className="py-2.5 pl-2 font-mono text-[11px]">
                          {new Date(log.date).toLocaleDateString()}
                        </td>
                        <td className="py-2.5 font-semibold text-white">
                          {log.subjectId?.name || 'Subject'}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              log.status === 'present'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : log.status === 'absent'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : log.status === 'late'
                                ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono">{log.classNumber || 1}</td>
                        <td className="py-2.5 text-slate-400 truncate max-w-[200px]">
                          {log.remarks || '—'}
                        </td>
                        <td className="py-2.5 text-right pr-2">
                          <button
                            onClick={() => handleDeleteLog(log._id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Log Attendance Record</h3>

            {logError && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {logError}
              </div>
            )}

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                <select
                  required
                  value={logForm.subjectId}
                  onChange={(e) => setLogForm({ ...logForm, subjectId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={logForm.date}
                    onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status *</label>
                  <select
                    value={logForm.status}
                    onChange={(e) => setLogForm({ ...logForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Class #</label>
                  <input
                    type="number"
                    min={1}
                    value={logForm.classNumber}
                    onChange={(e) =>
                      setLogForm({ ...logForm, classNumber: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Remarks</label>
                  <input
                    type="text"
                    placeholder="e.g. Lab experiment 4"
                    value={logForm.remarks}
                    onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
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
