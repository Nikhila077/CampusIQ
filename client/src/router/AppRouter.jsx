import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing.jsx';
import { Login } from '../pages/Login.jsx';
import { Register } from '../pages/Register.jsx';
import { Dashboard } from '../pages/Dashboard.jsx';
import { Profile } from '../pages/Profile.jsx';
import { Attendance } from '../pages/Attendance.jsx';
import { AttendanceSimulator } from '../pages/AttendanceSimulator.jsx';
import { Timetable } from '../pages/Timetable.jsx';
import { Assignments } from '../pages/Assignments.jsx';
import { Exams } from '../pages/Exams.jsx';
import { Performance } from '../pages/Performance.jsx';
import { Planner } from '../pages/Planner.jsx';
import { Career } from '../pages/Career.jsx';
import { Opportunities } from '../pages/Opportunities.jsx';
import { Projects } from '../pages/Projects.jsx';
import { Settings } from '../pages/Settings.jsx';
import { AppLayout } from '../layouts/AppLayout.jsx';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { PublicRoute } from './PublicRoute.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />

      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Application Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/simulate" element={<AttendanceSimulator />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/career" element={<Career />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
