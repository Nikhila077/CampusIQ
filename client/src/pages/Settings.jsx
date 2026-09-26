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
        <div className="md:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs space-y-1.5 sticky top-20">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 group ${
                  isActive
                    ? 'bg-[#102A2A] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#102A2A] hover:translate-x-0.5'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/10 text-[#3B8F83]'
                      : 'bg-teal-50 text-[#3B8F83] border border-teal-200/70 group-hover:border-teal-300'
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
            <div className="text-[11px] text-slate-500 space-y-1">
              <span className="block text-slate-700 font-bold font-sans">Active Session:</span>
              <span className="block font-mono text-slate-600 truncate">{user?.email}</span>
              <span className="inline-flex items-center gap-1.5 text-[#3B8F83] font-semibold text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Status: Authenticated
              </span>
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
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5"
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
                  <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60">
                    ID: {user?._id?.slice(-6) || 'active'}
                  </span>
                </div>

                {accountMsg.text && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      accountMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {accountMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{accountMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={accountForm.name}
                      onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Institutional Email</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">College / University</label>
                    <input
                      type="text"
                      value={accountForm.college}
                      onChange={(e) => setAccountForm({ ...accountForm, college: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Department / Branch</label>
                    <input
                      type="text"
                      value={accountForm.branch}
                      onChange={(e) => setAccountForm({ ...accountForm, branch: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Roll / Registration Number</label>
                    <input
                      type="text"
                      value={accountForm.rollNumber}
                      onChange={(e) => setAccountForm({ ...accountForm, rollNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Target Career Role</label>
                    <input
                      type="text"
                      value={accountForm.targetRole}
                      onChange={(e) => setAccountForm({ ...accountForm, targetRole: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={accountSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-50"
                  >
                    {accountSaving ? 'Saving...' : 'Save Account Changes'}
                  </button>
                </div>
              </form>

              {/* Password Change Form */}
              <form
                onSubmit={handlePasswordSubmit}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5"
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
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {passwordMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{passwordMsg.text}</span>
                  </div>
                )}

                <div className="space-y-4 text-xs max-w-md">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Current Password *</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Confirm New Password *</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-5 py-2.5 rounded-xl bg-[#102A2A] hover:bg-[#1a4040] text-white text-xs font-semibold hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-50"
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
              className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6"
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
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    prefMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {prefMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{prefMsg.text}</span>
                </div>
              )}

              {/* Notification Toggles with Modern Animated Switches */}
              <div className="space-y-3 divide-y divide-slate-100 text-xs">
                {[
                  {
                    key: 'attendanceWarnings',
                    title: 'Attendance Shortage Warnings',
                    desc: 'Alert when attendance drops below 75% or when safe absence buffer reaches 0.'
                  },
                  {
                    key: 'assignmentReminders',
                    title: 'Assignment Reminders',
                    desc: 'Remind 48 hours and 24 hours prior to submission deadlines.'
                  },
                  {
                    key: 'examReminders',
                    title: 'Exam Revision Countdowns',
                    desc: 'Periodic reminders for midterms, finals, and practical assessments.'
                  },
                  {
                    key: 'plannerReminders',
                    title: 'Smart Planner Daily Focus',
                    desc: 'Remind of uncompleted high-priority study milestones each morning.'
                  },
                  {
                    key: 'dailyBrainBoost',
                    title: 'Daily Brain Boost Challenge',
                    desc: "Notify when today's role-calibrated technical micro-challenge is active."
                  },
                  {
                    key: 'desktopAlerts',
                    title: 'Browser Desktop Notifications',
                    desc: 'Trigger native OS notification banners for imminent deadlines.',
                    isDesktop: true
                  }
                ].map((item, idx) => {
                  const isChecked = !!notifications[item.key];
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center justify-between gap-4 py-3 ${
                        idx === 0 ? 'pt-0' : ''
                      } hover:bg-slate-50/60 rounded-xl px-2 transition-colors`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <span className="font-bold text-[#102A2A] block text-xs">{item.title}</span>
                        <span className="text-slate-500 text-[11px] leading-relaxed block">
                          {item.desc}
                        </span>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        onClick={async () => {
                          if (item.isDesktop && !isChecked && 'Notification' in window && Notification.permission !== 'granted') {
                            const res = await Notification.requestPermission();
                            setNotifications({ ...notifications, desktopAlerts: res === 'granted' });
                          } else {
                            setNotifications({ ...notifications, [item.key]: !isChecked });
                          }
                        }}
                        className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                          isChecked ? 'bg-[#3B8F83]' : 'bg-slate-200 hover:bg-slate-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform duration-200 ease-in-out ${
                            isChecked ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Theme Preference */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
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
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                          isSelected
                            ? 'bg-teal-50 border-[#3B8F83] text-[#102A2A] shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50'
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
                  className="px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-50"
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
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5"
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
                    className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                      academicMsg.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {academicMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{academicMsg.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Academic Year</label>
                    <select
                      value={academicForm.year}
                      onChange={(e) => setAcademicForm({ ...academicForm, year: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
                    >
                      <option value={1}>1st Year (Freshman)</option>
                      <option value={2}>2nd Year (Sophomore)</option>
                      <option value={3}>3rd Year (Junior)</option>
                      <option value={4}>4th Year (Senior)</option>
                      <option value={5}>5th Year (Dual / Integrated)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">Active Semester</label>
                    <select
                      value={academicForm.semester}
                      onChange={(e) => setAcademicForm({ ...academicForm, semester: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3B8F83]/20 focus:border-[#3B8F83] transition-all"
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
                    className="px-5 py-2.5 rounded-xl bg-[#3B8F83] hover:bg-[#327a70] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all disabled:opacity-50"
                  >
                    {academicSaving ? 'Updating...' : 'Update Academic Standing'}
                  </button>
                </div>
              </form>

              {/* Curriculum Subjects Direct Link Panel */}
              <div className="bg-gradient-to-r from-teal-50/70 to-emerald-50/40 border border-teal-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-lift">
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
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#102A2A] hover:bg-[#143333] text-white text-xs font-semibold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:scale-98 transition-all shrink-0"
                >
                  <span>Manage Subjects in Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* CATEGORY 4: PRIVACY & SESSIONS */}
          {activeCategory === 'security' && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
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

              <div className="space-y-3 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-bold text-slate-700">Account ID:</span>
                  <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    {user?._id || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-bold text-slate-700">Account Registered:</span>
                  <span className="font-mono text-slate-600">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-bold text-slate-700">Last Active Date:</span>
                  <span className="font-mono text-slate-600">{user?.lastActiveDate || 'Today'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-700 block">Terminate Current Session</span>
                  <span className="text-[11px] text-slate-500">Sign out of your account on this device.</span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 hover:shadow-xs active:scale-98"
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
