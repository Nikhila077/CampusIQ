import api from './api.js';

export const markService = {
  async getMarks(params = {}) {
    const response = await api.get('/marks', { params });
    return response.data;
  },

  async getSubjectMarks(subjectId) {
    const response = await api.get(`/marks/subject/${subjectId}`);
    return response.data;
  },

  async createMark(data) {
    const response = await api.post('/marks', data);
    return response.data;
  },

  async updateMark(id, data) {
    const response = await api.put(`/marks/${id}`, data);
    return response.data;
  },

  async deleteMark(id) {
    const response = await api.delete(`/marks/${id}`);
    return response.data;
  }
};

export default markService;
