import { useState, useEffect } from 'react';
import {
  User,
  BookOpen,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  GraduationCap,
  Flame,
  Zap,
  Sliders,
  CheckCircle2,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';
import subjectService from '../services/subjectService.js';

export const Profile = () => {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    college: '',
    branch: '',
    year: 1,
    semester: 1,
    rollNumber: '',
    targetRole: '',
    skillsInput: '',
    interestsInput: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  // Subjects state
  const [subjects, setSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    faculty: '',
    minAttendancePercent: 75,
    priority: 'medium',
    credits: 3,
    semester: 1
  });
  const [subjectSaving, setSubjectSaving] = useState(false);
  const [subjectError, setSubjectError] = useState('');

  // Populate profile form from user
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        year: user.year || 1,
        semester: user.semester || 1,
        rollNumber: user.rollNumber || '',
        targetRole: user.targetRole || '',
        skillsInput: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        interestsInput: Array.isArray(user.interests) ? user.interests.join(', ') : ''
      });
    }
  }, [user]);

  // Load subjects
  const fetchSubjects = async () => {
    try {
      setLoadingSubjects(true);
      const res = await subjectService.getSubjects();
      if (res?.success) {
        setSubjects(res.data.subjects || []);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
    } finally {
      setLoadingSubjects(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg({ type: '', text: '' });

    try {
      const skills = profileForm.skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const interests = profileForm.interestsInput
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean);

      const res = await userService.updateProfile({
        name: profileForm.name,
        college: profileForm.college,
        branch: profileForm.branch,
        year: Number(profileForm.year),
        semester: Number(profileForm.semester),
        rollNumber: profileForm.rollNumber,
        targetRole: profileForm.targetRole,
        skills,
        interests
      });

      if (res?.success) {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully.' });
        await checkAuth();
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res?.success) {
        setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  // Subject Modal Actions
  const openAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: '',
      faculty: '',
      minAttendancePercent: 75,
      priority: 'medium',
      credits: 3,
      semester: user?.semester || 1
    });
    setSubjectError('');
    setSubjectModalOpen(true);
  };

  const openEditSubject = (subj) => {
    setEditingSubject(subj);
    setSubjectForm({
      name: subj.name,
      code: subj.code || '',
      faculty: subj.faculty || '',
      minAttendancePercent: subj.minAttendancePercent || 75,
      priority: subj.priority || 'medium',
      credits: subj.credits || 3,
      semester: subj.semester || user?.semester || 1
    });
    setSubjectError('');
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = async (e) => {
    e.preventDefault();
    setSubjectSaving(true);
    setSubjectError('');

    try {
      if (editingSubject) {
        await subjectService.updateSubject(editingSubject._id, subjectForm);
      } else {
        await subjectService.createSubject(subjectForm);
      }
      setSubjectModalOpen(false);
      await fetchSubjects();
    } catch (err) {
      setSubjectError(err.message || 'Failed to save subject.');
    } finally {
      setSubjectSaving(false);
    }
  };

  const handleDeleteSubject = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}"?`)) {
      try {
        await subjectService.deleteSubject(id);
        await fetchSubjects();
      } catch (err) {
        alert(err.message || 'Failed to delete subject.');
      }
    }
  };

  const handleQuickPriorityChange = async (id, newPriority) => {
    try {
      await subjectService.updatePriority(id, newPriority);
      setSubjects((prev) =>
        prev.map((s) => (s._id === id ? { ...s, priority: newPriority } : s))
      );
    } catch (err) {
      console.error('Failed to change priority:', err);
    }
  };

  // Profile completion calculation
  const completionItems = [
    Boolean(user?.name),
    Boolean(user?.college),
    Boolean(user?.branch),
    Boolean(user?.year),
    Boolean(user?.semester),
    Boolean(user?.rollNumber),
    Boolean(user?.targetRole),
    Boolean(user?.skills?.length > 0),
    Boolean(user?.interests?.length > 0)
  ];
  const completionPercentage = Math.round(
    (completionItems.filter(Boolean).length / completionItems.length) * 100
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header: Student Identity Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/90 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
              Identity Workspace
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Student Records & Curriculum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#102A2A] mt-1 flex items-center gap-2.5">
            <User className="w-7 h-7 text-[#3B8F83]" />
            Student Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Manage your personal academic identity, curriculum subjects, and security credentials.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-white text-[#102A2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Identity
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'subjects'
                ? 'bg-white text-[#102A2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subjects ({subjects.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-white text-[#102A2A] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* 2. TAB 1: Profile Information */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Identity Showcase Card (Clean, high-contrast, brand colors) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#102A2A] text-[#E8F5F2] flex items-center justify-center text-2xl font-black shadow-xs ring-4 ring-teal-50 shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-[#102A2A]">{user?.name || 'Student'}</h2>
                    {user?.targetRole && (
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200 text-[11px] font-bold">
                        {user.targetRole}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    {user?.college || 'Institution not configured'} {user?.branch ? `• ${user.branch}` : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Year {user?.year || 1}, Semester {user?.semester || 1}{' '}
                    {user?.rollNumber ? `• Roll: ${user.rollNumber}` : ''}
                  </p>
                </div>
              </div>

              {/* Badges: Level & Streak */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    Active Streak
                  </span>
                  <span className="text-sm font-black text-[#102A2A] flex items-center justify-center gap-1 mt-0.5">
                    <Flame className="w-4 h-4 text-[#3B8F83] fill-[#3B8F83]/20" />
                    <span>{user?.currentStreak || 0}d</span>
                  </span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">
                    Student Level
                  </span>
                  <span className="text-sm font-black text-[#102A2A] flex items-center justify-center gap-1 mt-0.5">
                    <Zap className="w-4 h-4 text-[#3B8F83] fill-[#3B8F83]/20" />
                    <span>Lvl {user?.level || 1}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion Gauge */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#3B8F83]" />
                  <span>Profile Completion</span>
                </span>
                <span className="font-mono font-bold text-[#102A2A]">
                  {completionPercentage}% Complete
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#3B8F83] h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Skills & Focus Chips Preview */}
            {(user?.skills?.length > 0 || user?.interests?.length > 0) && (
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 mr-1">Skills:</span>
                {(user?.skills || []).map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-0.5 rounded-lg bg-teal-50 border border-teal-200 text-[10px] text-teal-950 font-bold"
                  >
                    {sk}
                  </span>
                ))}
                {(user?.interests || []).map((inr) => (
                  <span
                    key={inr}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                  >
                    #{inr}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {profileMsg.text && (
              <div
                className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-medium ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {profileMsg.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-2">
                <User className="w-4 h-4 text-[#3B8F83]" />
                <span>Academic Identity Details</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Institutional Email</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-500 cursor-not-allowed font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">College / University</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Department / Branch</label>
                  <input
                    type="text"
                    value={profileForm.branch}
                    onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Academic Year</label>
                    <select
                      value={profileForm.year}
                      onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Semester</label>
                    <select
                      value={profileForm.semester}
                      onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Sem {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Roll / Registration Number</label>
                  <input
                    type="text"
                    value={profileForm.rollNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#102A2A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#3B8F83]" />
                <span>Career Direction & Skills</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Target Career Role</label>
                  <select
                    value={profileForm.targetRole}
                    onChange={(e) => setProfileForm({ ...profileForm, targetRole: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  >
                    <option value="">Select target role...</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Analyst">Data Analyst</option>
                    <option value="ML Engineer">Machine Learning Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, Java, SQL, React, DSA, Git"
                    value={profileForm.skillsInput}
                    onChange={(e) => setProfileForm({ ...profileForm, skillsInput: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Interests / Focus (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Development, Open Source, Distributed Systems"
                    value={profileForm.interestsInput}
                    onChange={(e) => setProfileForm({ ...profileForm, interestsInput: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
              >
                {profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. TAB 2: Subject Management */}
      {activeTab === 'subjects' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#102A2A]">Your Registered Subjects</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Set minimum attendance thresholds and planning priority preferences per subject.
              </p>
            </div>
            <button
              onClick={openAddSubject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          {loadingSubjects ? (
            <div className="p-16 text-center text-xs font-semibold text-slate-600 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
              Loading curriculum subjects...
            </div>
          ) : subjects.length === 0 ? (
            <div className="p-16 rounded-2xl border border-dashed border-slate-300 text-center bg-white space-y-3.5 max-w-xl mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#3B8F83] flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-[#102A2A]">No subjects added yet</p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Add your current semester subjects to unlock the Smart Attendance Engine, Timetable, and Academic Planner.
                </p>
              </div>
              <button
                onClick={openAddSubject}
                className="mt-2 px-4 py-2 rounded-xl bg-[#3B8F83] text-white text-xs font-semibold shadow-xs"
              >
                + Add Your First Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((s) => (
                <div
                  key={s._id}
                  className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#102A2A]">{s.name}</h3>
                          {s.code && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200">
                              {s.code}
                            </span>
                          )}
                        </div>
                        {s.faculty && (
                          <p className="text-xs text-slate-600 mt-0.5">Faculty: {s.faculty}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditSubject(s)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#3B8F83] hover:bg-slate-50 transition-colors"
                          title="Edit Subject"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(s._id, s.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Min Attendance
                        </span>
                        <span className="text-sm font-black text-[#102A2A] font-mono">
                          {s.minAttendancePercent || 75}%
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          Credits / Weight
                        </span>
                        <span className="text-sm font-black text-[#102A2A] font-mono">
                          {s.credits || 3} Credits
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Priority Switcher */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600">Planner Priority:</span>
                    <div className="flex items-center gap-1">
                      {['low', 'medium', 'high'].map((p) => {
                        const isCurrent = (s.priority || 'medium') === p;
                        return (
                          <button
                            key={p}
                            onClick={() => handleQuickPriorityChange(s._id, p)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              isCurrent
                                ? p === 'high'
                                  ? 'bg-red-50 text-red-800 border border-red-200'
                                  : 'bg-teal-50 text-teal-900 border border-teal-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 3: Security */}
      {activeTab === 'security' && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 max-w-xl shadow-xs"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-[#102A2A] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#3B8F83]" />
              <span>Change Security Password</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Update your account credentials to keep your student profile safe.
            </p>
          </div>

          {passwordMsg.text && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {passwordMsg.text}
            </div>
          )}

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}

      {/* 5. Subject Modal (Add/Edit) */}
      {subjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#102A2A]">
                  {editingSubject ? 'Edit Subject' : 'Add Curriculum Subject'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Configure attendance requirements and course weight.
                </p>
              </div>
              <button
                onClick={() => setSubjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {subjectError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {subjectError}
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS302"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Reynolds"
                    value={subjectForm.faculty}
                    onChange={(e) => setSubjectForm({ ...subjectForm, faculty: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Attendance %</label>
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={subjectForm.minAttendancePercent}
                    onChange={(e) =>
                      setSubjectForm({
                        ...subjectForm,
                        minAttendancePercent: Number(e.target.value)
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={subjectForm.credits}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, credits: Number(e.target.value) })
                    }
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Study Priority</label>
                <select
                  value={subjectForm.priority}
                  onChange={(e) => setSubjectForm({ ...subjectForm, priority: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={subjectSaving}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white font-semibold disabled:opacity-50"
                >
                  {subjectSaving ? 'Saving...' : editingSubject ? 'Update Subject' : 'Add Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
