import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Trash2,
  CalendarDays,
  Sparkles,
  BookOpen
} from 'lucide-react';
import timetableService from '../services/timetableService.js';
import subjectService from '../services/subjectService.js';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' }
];

export const Timetable = () => {
  const [slots, setSlots] = useState([]);
  const [todayData, setTodayData] = useState({ day: '', slots: [] });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  // Add slot modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    subjectId: '',
    dayOfWeek: 'mon',
    startTime: '09:00',
    endTime: '10:00',
    room: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ttRes, todayRes, subRes] = await Promise.all([
        timetableService.getTimetable(),
        timetableService.getTodayClasses(),
        subjectService.getSubjects()
      ]);

      if (ttRes?.success) setSlots(ttRes.data.slots || []);
      if (todayRes?.success) setTodayData(todayRes.data || { day: '', slots: [] });
      if (subRes?.success) setSubjects(subRes.data.subjects || []);
    } catch (err) {
      console.error('Error loading timetable:', err);
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
      dayOfWeek: 'mon',
      startTime: '09:00',
      endTime: '10:00',
      room: ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!form.subjectId) {
      setError('Please select a subject.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await timetableService.createSlot(form);
      setModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to add class slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    if (window.confirm('Remove this class slot from your timetable?')) {
      try {
        await timetableService.deleteSlot(id);
        await fetchData();
      } catch (err) {
        alert(err.message || 'Failed to delete slot.');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-[#3B8F83]" />
            Weekly Class Schedule
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Organize lectures, laboratory sessions, and classrooms across the week.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          disabled={subjects.length === 0}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Class Slot
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 h-40 skeleton-shimmer shadow-xs" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200/90 bg-white p-4 h-48 skeleton-shimmer shadow-xs" />
            ))}
          </div>
        </div>
      ) : subjects.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 text-center bg-white shadow-xs">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-[#102A2A]">Add Subjects First</h3>
          <p className="text-xs text-slate-600 mt-1">
            Please add your semester subjects in Profile before building your timetable schedule.
          </p>
        </div>
      ) : (
        <>
          {/* Today's Classes Spotlight */}
          <div className="bg-[#102A2A] text-white border border-[#102A2A] rounded-2xl p-5 shadow-xs relative overflow-hidden card-lift">
            <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-[#3B8F83]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#E8F5F2] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#3B8F83]" />
                Today's Schedule ({new Date().toLocaleDateString(undefined, { weekday: 'long' })})
              </h2>
              <span className="text-[11px] text-slate-300 font-medium">
                {todayData.slots?.length || 0} classes today
              </span>
            </div>

            {todayData.slots?.length === 0 ? (
              <p className="text-xs text-slate-300 italic py-2 relative z-10">
                No classes scheduled for today. Enjoy your self-study time!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 relative z-10">
                {todayData.slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-3.5 rounded-xl bg-[#143333] border border-[#3B8F83]/40 flex flex-col justify-between hover:border-[#3B8F83] transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {slot.subjectId?.name || 'Class'}
                        </span>
                        {slot.subjectId?.code && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#102A2A] text-[#E8F5F2] border border-[#3B8F83]/30">
                            {slot.subjectId.code}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-[#E8F5F2] font-mono">
                        <Clock className="w-3.5 h-3.5 text-[#3B8F83]" />
                        <span>
                          {slot.startTime} - {slot.endTime}
                        </span>
                      </div>
                    </div>
                    {slot.room && (
                      <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-[#3B8F83]/20 text-[10px] text-slate-300">
                        <MapPin className="w-3 h-3 text-[#3B8F83]" />
                        <span>Room: {slot.room}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Day Filter Pills */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Schedule Explorer
            </h2>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/90 text-xs shadow-2xs overflow-x-auto max-w-full">
              {[{ key: 'all', label: 'All Days' }, ...DAYS].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setSelectedDayFilter(d.key)}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDayFilter === d.key
                      ? 'bg-[#3B8F83] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-[#102A2A] hover:bg-slate-50'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DAYS.filter((d) => selectedDayFilter === 'all' || selectedDayFilter === d.key).map((day) => {
              const daySlots = slots.filter((s) => s.dayOfWeek === day.key);
              const todayIndex = new Date().getDay();
              const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
              const isToday = dayKeys[todayIndex] === day.key;

              return (
                <div
                  key={day.key}
                  className={`rounded-2xl p-4 flex flex-col transition-all shadow-2xs card-lift ${
                    isToday
                      ? 'bg-white border-2 border-[#3B8F83] ring-2 ring-[#3B8F83]/15'
                      : 'bg-white border border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-[#102A2A] uppercase tracking-wider">
                        {day.label}
                      </h3>
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-900 border border-teal-200 text-[9px] font-bold uppercase tracking-wider">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono font-medium">
                      {daySlots.length} {daySlots.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>

                  {daySlots.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-slate-500 italic">
                      No classes
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {daySlots.map((slot) => (
                        <div
                          key={slot._id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between group hover:border-[#3B8F83]/40 transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-[#102A2A]">
                                {slot.subjectId?.name || 'Class'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-teal-800 mt-1 font-mono font-bold">
                              <Clock className="w-3 h-3 text-[#3B8F83]" />
                              <span>
                                {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            {slot.room && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{slot.room}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add Slot Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-[#102A2A] mb-4">Add Timetable Class</h3>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-4">
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
                      {s.name} ({s.code || 'No code'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Day of Week *
                </label>
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                >
                  {DAYS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room / Venue (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab 3, Hall B-201"
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
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
                  {saving ? 'Adding...' : 'Add Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
