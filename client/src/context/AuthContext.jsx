import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if student has an active session on startup / refresh
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
        if (res?.data?.token) {
          localStorage.setItem('campusiq_token', res.data.token);
        }
      } else {
        localStorage.removeItem('campusiq_token');
        setUser(null);
      }
    } catch {
      // 401 or network error - user is unauthenticated
      localStorage.removeItem('campusiq_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Log in user with credentials
   */
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res?.success && res?.data?.user) {
      if (res?.data?.token) {
        localStorage.setItem('campusiq_token', res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res?.message || 'Login failed');
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res?.success && res?.data?.user) {
      if (res?.data?.token) {
        localStorage.setItem('campusiq_token', res.data.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  /**
   * Log out user
   */
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API warning:', err.message);
    } finally {
      localStorage.removeItem('campusiq_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
