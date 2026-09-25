import api from './api.js';

export const opportunityService = {
  async getOpportunities(params = {}) {
    const response = await api.get('/opportunities', { params });
    return response.data;
  },

  async createOpportunity(data) {
    const response = await api.post('/opportunities', data);
    return response.data;
  }
};

export default opportunityService;
