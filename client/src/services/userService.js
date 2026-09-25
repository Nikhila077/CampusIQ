import api from './api.js';

export const userService = {
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  },

  async changePassword(passwords) {
    const response = await api.put('/user/password', passwords);
    return response.data;
  }
};

export default userService;
