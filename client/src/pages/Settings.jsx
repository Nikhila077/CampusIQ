import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Palette,
  CheckCircle,
  AlertCircle,
  LogOut,
  User,
  GraduationCap,
  Lock,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Moon,
  Sun,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';

export const Settings = () => {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('account'); // 'account' | 'preferences' | 'academic' | 'security'

  // Account Form
  const [accountForm, setAccountForm] = useState({
    name: '',
    college: '',
    branch: '',
    rollNumber: '',
    targetRole: ''
  });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState({ type: '', text: '' });

  // Preferences Form
  const [notifications, setNotifications] = useState({
    attendanceWarnings: true,
    assignmentReminders: true,
    examReminders: true,
    plannerReminders: true,
    dailyBrainBoost: true,
    desktopAlerts: false
  });
  const [themePreference, setThemePreference] = useState('dark');
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState({ type: '', text: '' });

  // Academic Form
  const [academicForm, setAcademicForm] = useState({
    year: 1,
    semester: 1
  });
  const [academicSaving, setAcademicSaving] = useState(false);
  const [academicMsg, setAcademicMsg] = useState({ type: '', text: '' });

  // Password Change Form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setAccountForm({
        name: user.name || '',
        college: user.college || '',
        branch: user.branch || '',
        rollNumber: user.rollNumber || '',
        targetRole: user.targetRole || ''
      });

      setAcademicForm({
        year: user.year || 1,
        semester: user.semester || 1
      });

      if (user.notificationPreferences) {
        setNotifications({
          attendanceWarnings: user.notificationPreferences.attendanceWarnings ?? true,
          assignmentReminders: user.notificationPreferences.assignmentReminders ?? true,
          examReminders: user.notificationPreferences.examReminders ?? true,
          plannerReminders: user.notificationPreferences.plannerReminders ?? true,
          dailyBrainBoost: user.notificationPreferences.dailyBrainBoost ?? true,
          desktopAlerts: user.notificationPreferences.desktopAlerts ?? false
        });
      }

      if (user.themePreference) {
        setThemePreference(user.themePreference);
      }
    }
  }, [user]);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setAccountSaving(true);
    setAccountMsg({ type: '', text: '' });

    try {
      await userService.updateProfile(accountForm);
      setAccountMsg({ type: 'success', text: 'Account details updated successfully.' });
      await checkAuth();
    } catch (err) {
      setAccountMsg({ type: 'error', text: err.message || 'Failed to update account.' });
    } finally {
      setAccountSaving(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setPrefSaving(true);
    setPrefMsg({ type: '', text: '' });

    try {
      await userService.updateProfile({
        notificationPreferences: notifications,
        themePreference
      });
      setPrefMsg({ type: 'success', text: 'Preferences saved successfully.' });
      await checkAuth();
    } catch (err) {
      setPrefMsg({ type: 'error', text: err.message || 'Failed to save preferences.' });
    } finally {
      setPrefSaving(false);
    }
  };

  const handleAcademicSubmit = async (e) => {
    e.preventDefault();
    setAcademicSaving(true);
    setAcademicMsg({ type: '', text: '' });

    try {
      await userService.updateProfile({
        year: Number(academicForm.year),
        semester: Number(academicForm.semester)
      });
      setAcademicMsg({ type: 'success', text: 'Academic standing updated successfully.' });
      await checkAuth();
    } catch (err) {
      setAcademicMsg({ type: 'error', text: err.message || 'Failed to update academic year/semester.' });
    } finally {
      setAcademicSaving(false);
    }
  };

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

  const CATEGORIES = [
    { key: 'account', label: 'Account & Security', icon: User, desc: 'Personal info, institutional identity, credentials' },
    { key: 'preferences', label: 'Preferences', icon: Bell, desc: 'Smart reminders, notification rules, theme' },
    { key: 'academic', label: 'Academic Standing', icon: GraduationCap, desc: 'Current year, semester, curriculum alignment' },
    { key: 'security', label: 'Privacy & Sessions', icon: Shield, desc: 'Authentication token, session termination' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Header: Control Center Identity */}
      <div className="border-b border-slate-200/90 pb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-900 border border-teal-200">
            Control Center
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Account & System Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#102A2A] mt-1 flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-[#3B8F83]" />
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Manage your account credentials, notifications, institutional profile, and platform preferences.
        </p>
      </div>

      {/* 2. Structured Split Layout: Left Navigation + Right Content Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Category Nav (4 cols) */}
        <div className="md:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#102A2A] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#102A2A]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white/10 text-[#3B8F83]'
                      : 'bg-teal-50 text-[#3B8F83] border border-teal-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold block">{cat.label}</span>
                  <span
                    className={`text-[11px] leading-tight block line-clamp-1 ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {cat.desc}
                  </span>
                </div>
              </button>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-100 px-3 pb-1">
            <div className="text-[11px] text-slate-500 space-y-1 font-mono">
              <span className="block text-slate-700 font-bold font-sans">Active Session:</span>
              <span className="block truncate">{user?.email}</span>
              <span className="block text-[#3B8F83] font-semibold">Status: Authenticated</span>
            </div>
          </div>
        </div>

        {/* Right Content Panel (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* CATEGORY 1: ACCOUNT & SECURITY */}
          {activeCategory === 'account' && (
            <div className="space-y-6">
              {/* Profile Information Panel */}
              <form
                onSubmit={handleAccountSubmit}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      <User className="w-4 h-4 text-[#3B8F83]" />
                      <span>Account Information</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Your primary institutional identity on StudentLens.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-slate-500">
                    ID: {user?._id?.slice(-6) || 'active'}
                  </span>
                </div>

                {accountMsg.text && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      accountMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {accountMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Institutional Email</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-500 cursor-not-allowed font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">College / University</label>
                    <input
                      type="text"
                      value={accountForm.college}
                      onChange={(e) => setAccountForm({ ...accountForm, college: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Department / Branch</label>
                    <input
                      type="text"
                      value={accountForm.branch}
                      onChange={(e) => setAccountForm({ ...accountForm, branch: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Roll / Registration Number</label>
                    <input
                      type="text"
                      value={accountForm.rollNumber}
                      onChange={(e) => setAccountForm({ ...accountForm, rollNumber: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Target Career Role</label>
                    <input
                      type="text"
                      value={accountForm.targetRole}
                      onChange={(e) => setAccountForm({ ...accountForm, targetRole: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={accountSaving}
                    className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                  >
                    {accountSaving ? 'Saving...' : 'Save Account Changes'}
                  </button>
                </div>
              </form>

              {/* Password Change Form */}
              <form
                onSubmit={handlePasswordSubmit}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#3B8F83]" />
                      <span>Change Account Password</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Ensure your account stays secure with a strong password.
                    </p>
                  </div>
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

                <div className="space-y-3 text-xs max-w-md">
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

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-4 py-2 rounded-xl bg-[#102A2A] hover:bg-[#1a4040] text-white text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CATEGORY 2: PREFERENCES */}
          {activeCategory === 'preferences' && (
            <form
              onSubmit={handlePreferencesSubmit}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#3B8F83]" />
                    <span>Smart Reminder Preferences</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Configure thresholds, alerts, and productivity notifications.
                  </p>
                </div>
              </div>

              {prefMsg.text && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    prefMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {prefMsg.text}
                </div>
              )}

              {/* Notification Toggles */}
              <div className="space-y-4 text-xs">
                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.attendanceWarnings}
                    onChange={(e) =>
                      setNotifications({ ...notifications, attendanceWarnings: e.target.checked })
                    }
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Attendance Shortage Warnings</span>
                    <span className="text-slate-600 text-[11px]">
                      Alert when attendance drops below 75% or when safe absence buffer reaches 0.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.assignmentReminders}
                    onChange={(e) =>
                      setNotifications({ ...notifications, assignmentReminders: e.target.checked })
                    }
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Assignment Reminders</span>
                    <span className="text-slate-600 text-[11px]">
                      Remind 48 hours and 24 hours prior to submission deadlines.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.examReminders}
                    onChange={(e) =>
                      setNotifications({ ...notifications, examReminders: e.target.checked })
                    }
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Exam Revision Countdowns</span>
                    <span className="text-slate-600 text-[11px]">
                      Periodic reminders for midterms, finals, and practical assessments.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.plannerReminders}
                    onChange={(e) =>
                      setNotifications({ ...notifications, plannerReminders: e.target.checked })
                    }
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Smart Planner Daily Focus</span>
                    <span className="text-slate-600 text-[11px]">
                      Remind of uncompleted high-priority study milestones each morning.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.dailyBrainBoost}
                    onChange={(e) =>
                      setNotifications({ ...notifications, dailyBrainBoost: e.target.checked })
                    }
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Daily Brain Boost Challenge</span>
                    <span className="text-slate-600 text-[11px]">
                      Notify when today's role-calibrated technical micro-challenge is active.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={notifications.desktopAlerts}
                    onChange={async (e) => {
                      const checked = e.target.checked;
                      if (checked && 'Notification' in window && Notification.permission !== 'granted') {
                        const res = await Notification.requestPermission();
                        setNotifications({ ...notifications, desktopAlerts: res === 'granted' });
                      } else {
                        setNotifications({ ...notifications, desktopAlerts: checked });
                      }
                    }}
                    className="rounded mt-0.5 text-[#3B8F83] focus:ring-0"
                  />
                  <div>
                    <span className="font-bold text-[#102A2A] block">Browser Desktop Notifications</span>
                    <span className="text-slate-600 text-[11px]">
                      Trigger native OS notification banners for imminent deadlines.
                    </span>
                  </div>
                </label>
              </div>

              {/* Theme Preference */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-[#102A2A] block">Interface Theme</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'light', label: 'Light', icon: Sun },
                    { key: 'dark', label: 'Dark', icon: Moon },
                    { key: 'system', label: 'System', icon: Laptop }
                  ].map((theme) => {
                    const Icon = theme.icon;
                    const isSelected = themePreference === theme.key;
                    return (
                      <button
                        key={theme.key}
                        type="button"
                        onClick={() => setThemePreference(theme.key)}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-teal-50 border-teal-300 text-[#102A2A] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#3B8F83]" />
                        <span>{theme.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={prefSaving}
                  className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                >
                  {prefSaving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {/* CATEGORY 3: ACADEMIC */}
          {activeCategory === 'academic' && (
            <div className="space-y-6">
              <form
                onSubmit={handleAcademicSubmit}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#3B8F83]" />
                      <span>Academic Standing & Timeline</span>
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Your current semester progress and curriculum stage.
                    </p>
                  </div>
                </div>

                {academicMsg.text && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium ${
                      academicMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {academicMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={academicForm.year}
                      onChange={(e) => setAcademicForm({ ...academicForm, year: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    >
                      <option value={1}>1st Year (Freshman)</option>
                      <option value={2}>2nd Year (Sophomore)</option>
                      <option value={3}>3rd Year (Junior)</option>
                      <option value={4}>4th Year (Senior)</option>
                      <option value={5}>5th Year (Dual / Integrated)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Active Semester</label>
                    <select
                      value={academicForm.semester}
                      onChange={(e) => setAcademicForm({ ...academicForm, semester: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-[#3B8F83]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={academicSaving}
                    className="px-4 py-2 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-50"
                  >
                    {academicSaving ? 'Updating...' : 'Update Academic Standing'}
                  </button>
                </div>
              </form>

              {/* Curriculum Subjects Direct Link Panel */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#102A2A]">
                    Curriculum Subjects & Attendance Rules
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                    Subject faculty, minimum attendance percentages, credits, and priority tags are configured in your Profile workspace.
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#102A2A] hover:bg-[#143333] text-white text-xs font-semibold shadow-xs transition-all shrink-0"
                >
                  <span>Manage Subjects in Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* CATEGORY 4: PRIVACY & SESSIONS */}
          {activeCategory === 'security' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#102A2A] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#3B8F83]" />
                    <span>Privacy & Session Controls</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Security status, active JSON Web Token, and session termination.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-[#102A2A]">
                  <CheckCircle2 className="w-4 h-4 text-[#3B8F83]" />
                  <span>Session Protected</span>
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Your communication with the StudentLens backend is encrypted. Authentication tokens are verified on every API interaction.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700">Account ID:</span>
                  <span className="font-mono text-slate-600">{user?._id || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700">Account Registered:</span>
                  <span className="font-mono text-slate-600">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700">Last Active Date:</span>
                  <span className="font-mono text-slate-600">{user?.lastActiveDate || 'Today'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-700 block">Terminate Current Session</span>
                  <span className="text-[11px] text-slate-500">Sign out of your account on this device.</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
