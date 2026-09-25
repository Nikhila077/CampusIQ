import api from './api.js';

export const assignmentService = {
  async getAssignments(params = {}) {
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  async createAssignment(data) {
    const response = await api.post('/assignments', data);
    return response.data;
  },

  async updateAssignment(id, data) {
    const response = await api.put(`/assignments/${id}`, data);
    return response.data;
  },

  async updateStatus(id, status) {
    const response = await api.put(`/assignments/${id}/status`, { status });
    return response.data;
  },

  async deleteAssignment(id) {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  }
};

export default assignmentService;
