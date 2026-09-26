import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
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
  ChevronRight,
  ChevronLeft,
  User,
  Bell,
  Check,
  CheckCheck,
  AlertTriangle,
  Flame,
  Zap,
  Info,
  Filter
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import notificationService from '../services/notificationService.js';
import gamificationService from '../services/gamificationService.js';
import { StudentLensLogo } from '../components/shared/StudentLensLogo.jsx';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Notification state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifFilter, setNotifFilter] = useState('all'); // 'all', 'attendance', 'task'
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

  // Scroll detection for navbar elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    const interval = setInterval(() => {
      loadNotifications();
      loadGamification();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
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
        new Notification('StudentLens Alerts Active', {
          body: 'You will now receive timely academic reminders on your desktop.',
          icon: '/favicon.svg'
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

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'attendance') return n.type === 'attendance';
    if (notifFilter === 'task') return ['assignment', 'exam', 'brain_boost'].includes(n.type);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#102A2A] flex flex-col antialiased selection:bg-[#3B8F83] selection:text-white">
      {/* Top Header / Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs'
            : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-[#102A2A] rounded-xl hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <StudentLensLogo />
              <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#E8F5F2] text-[#3B8F83] border border-teal-200/80 ml-1 transition-transform group-hover:scale-105">
                Decision Support
              </span>
            </Link>
          </div>

          {/* Gamification, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Gamification Streak & Level Badge */}
            <div
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs shadow-2xs hover:border-[#3B8F83]/40 transition-all duration-200 cursor-default"
              title={`Streak: ${gamification.currentStreak || 0} days | Level ${gamification.level || 1} (${gamification.xp || 0} XP)`}
            >
              <div className="flex items-center gap-1.5 font-bold text-[#102A2A]">
                <Flame className="w-4 h-4 text-[#3B8F83] fill-[#3B8F83]/20 animate-soft-pulse" />
                <span>{gamification.currentStreak || 0}d</span>
                <span className="text-[10px] text-slate-400 font-normal">streak</span>
              </div>
              <span className="text-slate-200">•</span>
              <div className="flex items-center gap-1 text-[#3B8F83] font-semibold">
                <Zap className="w-3.5 h-3.5 text-[#3B8F83] fill-[#3B8F83]/20" />
                <span>Lvl {gamification.level || 1}</span>
                <span className="text-[10px] text-slate-500 font-mono">({gamification.xp || 0} XP)</span>
              </div>
            </div>

            {/* Smart Reminders Notification Center Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-[#102A2A] bg-white border border-slate-200/90 hover:border-[#3B8F83]/50 transition-all duration-200 focus:outline-none shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                aria-label="Smart Reminders"
                title="Smart Reminders & Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs ring-2 ring-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Center Dropdown Panel */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#102A2A] uppercase tracking-wider">
                        Smart Reminders
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#E8F5F2] text-[#3B8F83] text-[10px] font-bold border border-teal-200">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-[#3B8F83] hover:text-[#2d6f66] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Filter tabs */}
                  <div className="flex border-b border-slate-100 px-3 py-1.5 bg-white text-[11px] gap-1">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'attendance', label: 'Attendance' },
                      { id: 'task', label: 'Academic & Tasks' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setNotifFilter(tab.id)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          notifFilter === tab.id
                            ? 'bg-[#E8F5F2] text-[#3B8F83] font-semibold'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Desktop alerts prompt */}
                  {!browserAlertsEnabled && 'Notification' in window && (
                    <div className="p-2.5 bg-[#E8F5F2]/50 border-b border-teal-100/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-teal-900 font-medium">Enable desktop alerts?</span>
                      <button
                        onClick={requestBrowserPermission}
                        className="px-2.5 py-1 rounded-lg bg-[#3B8F83] hover:bg-[#327a70] text-[10px] font-semibold text-white transition-all shadow-xs cursor-pointer"
                      >
                        Allow
                      </button>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {filteredNotifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-slate-700">All caught up!</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">No unread notifications in this view.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((n) => (
                        <div
                          key={n._id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50/80 flex items-start gap-2.5 group ${
                            !n.isRead ? 'bg-[#E8F5F2]/40' : ''
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.type === 'attendance' ? (
                              <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                            ) : n.type === 'assignment' ? (
                              <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#3B8F83] flex items-center justify-center">
                                <ClipboardList className="w-3.5 h-3.5" />
                              </div>
                            ) : n.type === 'exam' ? (
                              <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#3B8F83] flex items-center justify-center">
                                <GraduationCap className="w-3.5 h-3.5" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-lg bg-slate-100 text-[#3B8F83] flex items-center justify-center">
                                <Zap className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-bold truncate ${!n.isRead ? 'text-[#102A2A]' : 'text-slate-600'}`}>
                                {n.title}
                              </span>
                              {!n.isRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(n._id, e)}
                                  className="text-[10px] text-slate-400 hover:text-[#3B8F83] shrink-0 font-medium transition-colors"
                                  title="Mark as read"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
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
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#3B8F83]/50 transition-all duration-200 shadow-2xs hover:shadow-xs group"
              title="View & Edit Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B8F83] to-[#102A2A] flex items-center justify-center text-white text-xs font-bold shadow-xs transition-transform group-hover:scale-105">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#102A2A] truncate max-w-[130px] group-hover:text-[#3B8F83] transition-colors">
                  {user?.name || 'Student'}
                </span>
                <span className="text-[10px] text-slate-500 truncate max-w-[130px]">
                  {user?.branch ? `${user.branch} • Sem ${user.semester || 1}` : user?.email}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200/90 hover:border-rose-200 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 lg:gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside
          className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div className="sticky top-24 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-3 shadow-xs">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-1">
              {!isSidebarCollapsed && (
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Navigation
                </span>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 rounded-lg text-slate-400 hover:text-[#3B8F83] hover:bg-slate-100 transition-colors ml-auto cursor-pointer"
                title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);

                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    title={isSidebarCollapsed ? item.name : undefined}
                    className={`flex items-center ${
                      isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-3'
                    } py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-[#E8F5F2] text-[#3B8F83] font-bold shadow-2xs border border-teal-200/80'
                        : 'text-slate-600 hover:text-[#102A2A] hover:bg-slate-100/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? 'text-[#3B8F83]' : 'text-slate-500 group-hover:text-[#3B8F83]'
                        }`}
                      />
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </div>

                    {!isSidebarCollapsed && (
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-all duration-200 ${
                          isActive
                            ? 'text-[#3B8F83] opacity-100 translate-x-0.5'
                            : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-slate-500 group-hover:translate-x-0.5'
                        }`}
                      />
                    )}

                    {/* Active accent dot for collapsed state */}
                    {isSidebarCollapsed && isActive && (
                      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#3B8F83]" />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {!isSidebarCollapsed && (
              <div className="mt-6 pt-3 border-t border-slate-100 px-1">
                <div className="p-3 rounded-xl bg-gradient-to-br from-[#E8F5F2]/80 to-white border border-teal-200/70 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#3B8F83] animate-pulse"></span>
                    <p className="text-[11px] font-bold text-[#102A2A]">Decision Engine</p>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                    Attendance buffers, action priorities, and career analytics synced.
                  </p>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <StudentLensLogo />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#102A2A] hover:bg-slate-100 transition-colors"
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
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-[#E8F5F2] text-[#3B8F83] font-bold border border-teal-200'
                              : 'text-slate-600 hover:text-[#102A2A] hover:bg-slate-100'
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-[#3B8F83]" />
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
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
