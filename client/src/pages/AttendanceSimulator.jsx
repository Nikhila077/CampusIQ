import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sliders,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import attendanceService from '../services/attendanceService.js';
import subjectService from '../services/subjectService.js';

export const AttendanceSimulator = () => {
  const [searchParams] = useSearchParams();
  const initialSubjectId = searchParams.get('subjectId') || '';

  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  // Simulation inputs
  const [scenarioType, setScenarioType] = useState('miss'); // 'miss' | 'attend'
  const [classCount, setClassCount] = useState(2);
  const [customConducted, setCustomConducted] = useState(25);
  const [customAttended, setCustomAttended] = useState(21);
  const [customMinPercent, setCustomMinPercent] = useState(75);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Simulation output
  const [simulation, setSimulation] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const res = await attendanceService.getSummary();
        if (res?.success) {
          const subjs = res.data.subjects || [];
          setSubjects(subjs);
          if (initialSubjectId && subjs.some((s) => s.subject._id === initialSubjectId)) {
            setSelectedSubjectId(initialSubjectId);
          } else if (subjs.length > 0) {
            setSelectedSubjectId(subjs[0].subject._id);
          } else {
            setIsCustomMode(true);
          }
        }
      } catch (err) {
        console.error('Error loading subjects for simulator:', err);
        setIsCustomMode(true);
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [initialSubjectId]);

  // Run simulation whenever parameters change
  useEffect(() => {
    const runSimulation = async () => {
      setSimulating(true);
      try {
        let payload = {
          type: scenarioType,
          count: classCount
        };

        if (isCustomMode || !selectedSubjectId) {
          payload = {
            ...payload,
            conducted: Number(customConducted),
            attended: Number(customAttended),
            minPercent: Number(customMinPercent)
          };
        } else {
          payload = {
            ...payload,
            subjectId: selectedSubjectId
          };
        }

        const res = await attendanceService.simulate(payload);
        if (res?.success) {
          setSimulation(res.data);
        }
      } catch (err) {
        console.error('Simulation error:', err);
      } finally {
        setSimulating(false);
      }
    };

    const timer = setTimeout(runSimulation, 150);
    return () => clearTimeout(timer);
  }, [
    scenarioType,
    classCount,
    selectedSubjectId,
    isCustomMode,
    customConducted,
    customAttended,
    customMinPercent
  ]);

  const activeSubjectItem = subjects.find((s) => s.subject._id === selectedSubjectId);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <Link
            to="/attendance"
            className="text-xs text-[#3B8F83] hover:text-[#327a70] font-bold inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Attendance Overview
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-[#3B8F83]" />
            What-If Attendance Simulator
          </h1>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Test scenarios before making decisions. Understand exact projected percentages, buffers, and recovery impacts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Simulation Setup
              </h2>
              <button
                type="button"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] font-bold text-[#3B8F83] hover:underline cursor-pointer"
              >
                {isCustomMode ? 'Use My Real Subjects' : 'Custom Numbers Mode'}
              </button>
            </div>

            {/* Subject Selector or Custom Inputs */}
            {!isCustomMode ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Subject
                </label>
                {subjects.length === 0 ? (
                  <p className="text-xs text-slate-600">
                    No subjects found. Switched to custom values mode.
                  </p>
                ) : (
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    {subjects.map((item) => (
                      <option key={item.subject._id} value={item.subject._id}>
                        {item.subject.name} (Current: {item.currentPercent}%, Min:{' '}
                        {item.minPercent}%)
                      </option>
                    ))}
                  </select>
                )}

                {activeSubjectItem && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between">
                    <div>
                      <span className="text-slate-600 block text-[10px] font-semibold">Conducted</span>
                      <span className="font-bold text-[#102A2A]">{activeSubjectItem.conducted}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px] font-semibold">Attended</span>
                      <span className="font-bold text-[#102A2A]">{activeSubjectItem.attended}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px] font-semibold">Current %</span>
                      <span className="font-bold text-[#3B8F83]">
                        {activeSubjectItem.currentPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 block text-[10px] font-semibold">Min Req</span>
                      <span className="font-bold text-[#102A2A]">
                        {activeSubjectItem.minPercent}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Conducted</label>
                    <input
                      type="number"
                      min={0}
                      value={customConducted}
                      onChange={(e) => setCustomConducted(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Attended</label>
                    <input
                      type="number"
                      min={0}
                      max={customConducted}
                      value={customAttended}
                      onChange={(e) => setCustomAttended(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Required Attendance %
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={customMinPercent}
                    onChange={(e) => setCustomMinPercent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-900"
                  />
                </div>
              </div>
            )}

            {/* Scenario Type Selection */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Scenario Question
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScenarioType('miss')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    scenarioType === 'miss'
                      ? 'bg-red-50 border-red-300 text-red-950 ring-1 ring-red-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <TrendingDown className="w-4 h-4 mb-2 text-red-600" />
                  <span className="text-xs font-bold">What if I miss?</span>
                  <span className="text-[10px] text-slate-600 mt-0.5">Skip upcoming classes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setScenarioType('attend')}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    scenarioType === 'attend'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-1 ring-emerald-300'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mb-2 text-emerald-600" />
                  <span className="text-xs font-bold">What if I attend?</span>
                  <span className="text-[10px] text-slate-600 mt-0.5">Attend next classes</span>
                </button>
              </div>
            </div>

            {/* Class Count Slider */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Number of upcoming classes:
                </label>
                <span className="text-xs font-bold font-mono text-[#3B8F83] px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200">
                  {classCount} {classCount === 1 ? 'class' : 'classes'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={classCount}
                onChange={(e) => setClassCount(Number(e.target.value))}
                className="w-full accent-[#3B8F83] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-semibold text-slate-600 mt-1">
                <span>1 class</span>
                <span>10 classes</span>
                <span>20 classes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7">
          {simulation ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3B8F83]">
                    Projected Scenario Result
                  </span>
                  <h3 className="text-lg font-bold text-[#102A2A] mt-0.5">
                    {simulation.subjectName}: {simulation.scenario}
                  </h3>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    simulation.status === 'Safe'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : simulation.status === 'At Risk'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-red-50 text-red-800 border-red-200'
                  }`}
                >
                  Status: {simulation.status}
                </div>
              </div>

              {/* Before and After Comparison Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-700 block mb-1">Current Attendance</span>
                  <span className="text-3xl font-black text-[#102A2A]">
                    {simulation.currentPercent}%
                  </span>
                  <span className="text-xs text-slate-600 block mt-1 font-medium">
                    {simulation.currentAttended} / {simulation.currentConducted} classes
                  </span>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center ${
                    simulation.projectedPercent >= simulation.minPercent
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Projected Attendance
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span
                      className={`text-3xl font-black ${
                        simulation.projectedPercent >= simulation.minPercent
                          ? 'text-emerald-700'
                          : 'text-red-700'
                      }`}
                    >
                      {simulation.projectedPercent}%
                    </span>
                  </div>
                  <span className="text-xs text-slate-700 block mt-1 font-medium">
                    {simulation.projectedAttended} / {simulation.projectedConducted} classes (
                    {simulation.differenceFromCurrent >= 0 ? '+' : ''}
                    {simulation.differenceFromCurrent}%)
                  </span>
                </div>
              </div>

              {/* Requirement Delta & Buffers */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-600 block text-[10px] font-semibold">Difference from Min ({simulation.minPercent}%)</span>
                  <span
                    className={`text-sm font-black ${
                      simulation.differenceFromMin >= 0 ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {simulation.differenceFromMin >= 0 ? '+' : ''}
                    {simulation.differenceFromMin}%
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  {simulation.projectedPercent >= simulation.minPercent ? (
                    <>
                      <span className="text-slate-600 block text-[10px] font-semibold">Updated Absence Buffer</span>
                      <span className="text-sm font-black text-emerald-700">
                        +{simulation.updatedBuffer} classes safe
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-slate-600 block text-[10px] font-semibold">Classes Needed to Recover</span>
                      <span className="text-sm font-black text-red-600">
                        {simulation.recoveryNeeded} classes consecutively
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Plain English Transparent Explanation */}
              <div className="p-4 rounded-xl bg-teal-50/80 border border-teal-200 text-xs space-y-1">
                <span className="font-bold text-teal-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B8F83]" /> Engine Decision Summary
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{simulation.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-semibold text-slate-600 border border-dashed border-slate-300 rounded-2xl bg-white shadow-xs">
              Computing projection...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceSimulator;
