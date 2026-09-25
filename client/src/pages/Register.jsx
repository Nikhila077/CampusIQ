import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Building2,
  GraduationCap,
  Hash,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import useAuth from '../hooks/useAuth.js';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { StudentLensLogo } from '../components/shared/StudentLensLogo.jsx';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    branch: '',
    year: '1',
    semester: '1',
    rollNumber: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        college: formData.college.trim(),
        branch: formData.branch.trim(),
        year: Number(formData.year),
        semester: Number(formData.semester),
        rollNumber: formData.rollNumber.trim()
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#102A2A] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-[#3B8F83] selection:text-white">
      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#3B8F83]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <StudentLensLogo iconClassName="w-10 h-10" textClassName="text-2xl" />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A]">Create your student account</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#3B8F83] hover:text-[#2d6f66] transition-colors underline-offset-2 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4 sm:px-0">
        <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
          {serverError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <Input
              id="name"
              name="name"
              label="Full Name"
              type="text"
              placeholder="e.g. Alex Sharma"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              icon={User}
              required
            />

            {/* Email Address */}
            <Input
              id="email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="student@college.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            {/* Password and Confirm Password in 2-column on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
                required
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {/* College & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="college"
                name="college"
                label="College / University"
                type="text"
                placeholder="e.g. National Institute of Tech"
                value={formData.college}
                onChange={handleChange}
                icon={Building2}
              />

              <Input
                id="branch"
                name="branch"
                label="Branch / Major"
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.branch}
                onChange={handleChange}
                icon={GraduationCap}
              />
            </div>

            {/* Year, Semester & Roll Number */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="year" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Year
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200 hover:border-slate-300 focus:border-[#3B8F83] focus:ring-2 focus:ring-[#3B8F83]/20 outline-none"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="semester" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-900 rounded-xl px-3.5 py-2.5 text-sm border border-slate-200 hover:border-slate-300 focus:border-[#3B8F83] focus:ring-2 focus:ring-[#3B8F83]/20 outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="rollNumber"
                name="rollNumber"
                label="Roll Number"
                type="text"
                placeholder="e.g. 21CS042"
                value={formData.rollNumber}
                onChange={handleChange}
                icon={Hash}
              />
            </div>

            {/* Security note */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B8F83] shrink-0" />
              <span>Password is cryptographically hashed with bcrypt before storing.</span>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full font-semibold py-3 text-sm bg-[#3B8F83] hover:bg-[#327a70] text-white shadow-md border-0"
              >
                Register & Enter StudentLens
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Personalized Student Decision-Support Platform • Secure HttpOnly JWT Session
        </p>
      </div>
    </div>
  );
};

export default Register;
