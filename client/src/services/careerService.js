import api from './api.js';

export const careerService = {
  async getReadiness() {
    const response = await api.get('/career/readiness');
    return response.data;
  },

  async updateTarget(targetData) {
    const response = await api.put('/career/target', targetData);
    return response.data;
  }
};

export default careerService;
