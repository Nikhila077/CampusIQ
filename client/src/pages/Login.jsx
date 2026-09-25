import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StudentLensLogo } from '../components/shared/StudentLensLogo.jsx';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#102A2A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3B8F83] selection:text-white">
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#3B8F83]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <StudentLensLogo iconClassName="w-10 h-10" textClassName="text-2xl" />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">Welcome back</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          New to StudentLens?{' '}
          <Link to="/register" className="font-semibold text-[#3B8F83] hover:text-[#2d6f66] transition-colors underline-offset-2 hover:underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Input
              id="email"
              name="email"
              label="Student Email"
              type="email"
              placeholder="student@college.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            {/* Password */}
            <Input
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              required
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full font-semibold py-3 text-sm bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-md border-0"
              >
                Sign In to StudentLens
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>

              {/* Quick Demo Login Shortcut */}
              <button
                type="button"
                onClick={async () => {
                  setIsLoading(true);
                  setServerError('');
                  try {
                    await login({
                      email: 'student@campusiq.edu',
                      password: 'password123'
                    });
                    navigate('/dashboard', { replace: true });
                  } catch (err) {
                    setServerError(err.message || 'Demo login failed');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-teal-200 bg-teal-50/70 hover:bg-teal-100/70 text-teal-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#3B8F83]" />
                <span>Instant Demo Login (Alex Johnson)</span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              ← Back to Homepage
            </Link>
            <div className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3B8F83]" />
              <span>Isolated Student Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
