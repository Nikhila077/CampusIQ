import api from './api.js';

export const authService = {
  /**
   * Register a new student account
   * @param {Object} userData - Form values
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log in an existing student
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Fetch current authenticated student profile via HttpOnly cookie
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Log out student and clear HttpOnly cookie
   */
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

export default authService;
