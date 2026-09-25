import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  ClipboardList,
  GraduationCap,
  BarChart3,
  Clock,
  Briefcase,
  Sparkles,
  FolderGit2,
  Settings,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronRight,
  User,
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import notificationService from '../services/notificationService.js';
import gamificationService from '../services/gamificationService.js';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [browserAlertsEnabled, setBrowserAlertsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const notifRef = useRef(null);

  // Gamification summary state
  const [gamification, setGamification] = useState({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  // Fetch notifications and gamification summary
  const loadNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      if (res?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const loadGamification = async () => {
    try {
      const res = await gamificationService.getSummary();
      if (res?.success) {
        setGamification(res.data);
      }
    } catch (err) {
      console.error('Error loading gamification:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadGamification();

    // Poll notifications every 45s for live updates
    const interval = setInterval(() => {
      loadNotifications();
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      await handleMarkAsRead(notif._id);
    }
    setNotificationsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setBrowserAlertsEnabled(true);
        new Notification('CampusIQ Alerts Active', {
          body: 'You will receive intelligent academic alerts for attendance and deadlines.',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { name: 'Profile & Subjects', icon: User, to: '/profile' },
    { name: 'Attendance', icon: CalendarCheck, to: '/attendance' },
    { name: 'Timetable', icon: Calendar, to: '/timetable' },
    { name: 'Assignments', icon: ClipboardList, to: '/assignments' },
    { name: 'Exams', icon: GraduationCap, to: '/exams' },
    { name: 'Performance', icon: BarChart3, to: '/performance' },
    { name: 'Smart Planner', icon: Clock, to: '/planner' },
    { name: 'Career Readiness', icon: Briefcase, to: '/career' },
    { name: 'Opportunities', icon: Sparkles, to: '/opportunities' },
    { name: 'Project Hub', icon: FolderGit2, to: '/projects' },
    { name: 'Settings', icon: Settings, to: '/settings' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">
                  Campus<span className="text-indigo-400">IQ</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Decision Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Gamification, Notifications & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Gamification Streak & Level Badge */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-400" title="Active meaningful learning streak">
                <Flame className="w-3.5 h-3.5 fill-amber-400/20" />
                <span>{gamification.currentStreak || 0}d Streak</span>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1 text-indigo-300 font-semibold" title="Student Level & XP">
                <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
                <span>Lvl {gamification.level || 1}</span>
                <span className="text-[10px] text-slate-400 font-mono">({gamification.xp || 0} XP)</span>
              </span>
            </div>

            {/* Smart Reminders Notification Center Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 transition-colors focus:outline-none"
                aria-label="Smart Reminders"
                title="Smart Reminders & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-950 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Smart Reminders
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          {unreadCount} unread
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Browser notification opt-in prompt if not granted */}
                  {!browserAlertsEnabled && 'Notification' in window && (
                    <div className="p-2.5 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-indigo-300">Enable desktop alerts?</span>
                      <button
                        onClick={requestBrowserPermission}
                        className="px-2 py-0.5 rounded bg-indigo-600 text-[10px] font-semibold text-white hover:bg-indigo-500"
                      >
                        Allow
                      </button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        All caught up! No urgent reminders.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-800/50 flex items-start gap-2.5 ${
                            !n.isRead ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'attendance' ? (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            ) : n.type === 'assignment' ? (
                              <ClipboardList className="w-4 h-4 text-yellow-400" />
                            ) : n.type === 'exam' ? (
                              <GraduationCap className="w-4 h-4 text-purple-400" />
                            ) : n.type === 'brain_boost' ? (
                              <Zap className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Info className="w-4 h-4 text-indigo-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-bold truncate ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(n._id, e)}
                                  className="text-[10px] text-slate-500 hover:text-indigo-400 shrink-0"
                                  title="Mark as read"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Info */}
            <Link
              to="/profile"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/40 transition-colors"
              title="View & Edit Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px]">
                  {user?.name || 'Student'}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[130px]">
                  {user?.branch ? `${user.branch} • Sem ${user.semester || 1}` : user?.email}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-slate-800 hover:border-red-500/30 transition-all duration-200"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-3 shadow-sm">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            <nav className="space-y-1 mt-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                        isActive
                          ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-800/60 px-3 pb-2">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <p className="text-[11px] font-medium text-indigo-300">Decision Support Engine</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Attendance buffers, planner priorities, and career analytics active.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Compass className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-white">CampusIQ</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1 mt-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-600/10 text-red-400 hover:bg-red-600/20 border border-red-500/30 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Page Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
