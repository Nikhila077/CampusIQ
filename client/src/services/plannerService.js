import api from './api.js';

export const plannerService = {
  async getPlan() {
    const response = await api.get('/planner');
    return response.data;
  }
};

export default plannerService;
