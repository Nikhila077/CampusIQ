import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [comingSoonModal, setComingSoonModal] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/login');
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      to: '/dashboard',
      isComingSoon: false
    },
    {
      name: 'Attendance',
      icon: CalendarCheck,
      to: '/attendance',
      isComingSoon: true,
      phase: 'Phase 4: Smart Attendance Engine'
    },
    {
      name: 'Timetable',
      icon: Calendar,
      to: '/timetable',
      isComingSoon: true,
      phase: 'Phase 5: Class Scheduling'
    },
    {
      name: 'Assignments',
      icon: ClipboardList,
      to: '/assignments',
      isComingSoon: true,
      phase: 'Phase 5: Academic Tracking'
    },
    {
      name: 'Exams',
      icon: GraduationCap,
      to: '/exams',
      isComingSoon: true,
      phase: 'Phase 5: Exam Countdown'
    },
    {
      name: 'Performance',
      icon: BarChart3,
      to: '/performance',
      isComingSoon: true,
      phase: 'Phase 6: Visual Analytics'
    },
    {
      name: 'Smart Planner',
      icon: Clock,
      to: '/planner',
      isComingSoon: true,
      phase: 'Phase 7: Priority Planner'
    },
    {
      name: 'Career Readiness',
      icon: Briefcase,
      to: '/career',
      isComingSoon: true,
      phase: 'Phase 8: Career Gaps'
    },
    {
      name: 'Opportunities',
      icon: Sparkles,
      to: '/opportunities',
      isComingSoon: true,
      phase: 'Phase 8: Opportunity Hub'
    },
    {
      name: 'Project Hub',
      icon: FolderGit2,
      to: '/projects',
      isComingSoon: true,
      phase: 'Phase 9: Student Projects'
    },
    {
      name: 'Settings',
      icon: Settings,
      to: '/settings',
      isComingSoon: true,
      phase: 'Phase 10: Preferences'
    }
  ];

  const handleNavClick = (e, item) => {
    if (item.isComingSoon) {
      e.preventDefault();
      setComingSoonModal(item);
      setMobileMenuOpen(false);
    } else {
      setMobileMenuOpen(false);
    }
  };

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
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white">Campus<span className="text-indigo-400">IQ</span></span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Phase 1
                </span>
              </div>
            </div>
          </div>

          {/* User profile & actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
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
            </div>

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
                    onClick={(e) => handleNavClick(e, item)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group ${
                        isActive && !item.isComingSoon
                          ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <span>{item.name}</span>
                    </div>
                    {item.isComingSoon ? (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                        Soon
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-800/60 px-3 pb-2">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20">
                <p className="text-[11px] font-medium text-indigo-300">Phase 1 Architecture</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Auth, MongoDB Atlas & Session foundation active.
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
                        onClick={(e) => handleNavClick(e, item)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive && !item.isComingSoon
                              ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </div>
                        {item.isComingSoon && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            Soon
                          </span>
                        )}
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

      {/* Coming Soon Modal */}
      {comingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <comingSoonModal.icon className="w-6 h-6" />
            </div>
            <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
              Coming Soon
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {comingSoonModal.name} Module
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This module is scheduled for development in <span className="text-indigo-300 font-medium">{comingSoonModal.phase}</span>. In Phase 1, only the core authentication foundation, MongoDB Atlas connection, and protected Dashboard are active.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setComingSoonModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
