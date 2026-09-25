import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bell,
  Palette,
  CheckCircle,
  AlertCircle,
  LogOut,
  User
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import userService from '../services/userService.js';

export const Settings = () => {
  const { user, logout, checkAuth } = useAuth();

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    attendanceWarnings: true,
    assignmentReminders: true,
    examReminders: true,
    plannerReminders: true,
    dailyBrainBoost: true,
    desktopAlerts: false
  });
  const [themePreference, setThemePreference] = useState('dark');
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefMsg, setPrefMsg] = useState('');

  // Password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
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

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setSavingPrefs(true);
    setPrefMsg('');
    try {
      await userService.updateProfile({
        notificationPreferences: notifications,
        themePreference
      });
      setPrefMsg('Preferences saved successfully.');
      await checkAuth();
    } catch (err) {
      setPrefMsg(err.message || 'Failed to update preferences.');
    } finally {
      setSavingPrefs(false);
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-indigo-400" />
            Platform Settings & Preferences
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your account security, notification rules, and application experience.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification & Experience Settings */}
        <form
          onSubmit={handleSavePreferences}
          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-5"
        >
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Bell className="w-4 h-4" /> Smart Reminder Preferences
          </div>

          {prefMsg && (
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
              {prefMsg}
            </div>
          )}

          <div className="space-y-3.5 text-xs">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.attendanceWarnings}
                onChange={(e) =>
                  setNotifications({ ...notifications, attendanceWarnings: e.target.checked })
                }
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Attendance Warnings</span>
                <span className="text-slate-400 text-[11px]">
                  Alert when attendance drops below minimum threshold or safe absence buffer is low.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.assignmentReminders}
                onChange={(e) =>
                  setNotifications({ ...notifications, assignmentReminders: e.target.checked })
                }
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Assignment Reminders</span>
                <span className="text-slate-400 text-[11px]">
                  Remind 48 hours before coursework deadlines with direct XP reward preview.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.examReminders}
                onChange={(e) =>
                  setNotifications({ ...notifications, examReminders: e.target.checked })
                }
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Exam Reminders</span>
                <span className="text-slate-400 text-[11px]">
                  Send revision countdown notices for midterms, finals, and practical assessments.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.plannerReminders}
                onChange={(e) =>
                  setNotifications({ ...notifications, plannerReminders: e.target.checked })
                }
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Planner Reminders</span>
                <span className="text-slate-400 text-[11px]">
                  Daily reminder for uncompleted high-priority academic tasks.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.dailyBrainBoost}
                onChange={(e) =>
                  setNotifications({ ...notifications, dailyBrainBoost: e.target.checked })
                }
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Daily Brain Boost Challenge</span>
                <span className="text-slate-400 text-[11px]">
                  Alert when today's micro-challenge is ready to maintain your learning streak.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
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
                className="rounded mt-0.5 text-indigo-600 focus:ring-0"
              />
              <div>
                <span className="font-semibold text-white block">Browser Desktop Notifications</span>
                <span className="text-slate-400 text-[11px]">
                  Show OS-level browser notification popups when deadlines or shortages are detected.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Palette className="w-4 h-4" /> Appearance Theme
            </div>
            <select
              value={themePreference}
              onChange={(e) => setThemePreference(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="dark">Dark Theme (Default SaaS Aesthetic)</option>
              <option value="system">System Preference</option>
            </select>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={savingPrefs}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {savingPrefs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>

        {/* Change Password Form */}
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4"
        >
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Change Password
          </div>

          {passwordMsg.text && (
            <div
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs ${
                passwordMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {passwordMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{passwordMsg.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Current Password *
            </label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Confirm New Password *
            </label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              {passwordSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info Card & Danger Zone */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-white block">Active Account Session</span>
          <span className="text-xs text-slate-400">
            Logged in as <strong>{user?.name}</strong> ({user?.email})
          </span>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
