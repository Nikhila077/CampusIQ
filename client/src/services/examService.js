import api from './api.js';

export const examService = {
  async getExams(params = {}) {
    const response = await api.get('/exams', { params });
    return response.data;
  },

  async createExam(data) {
    const response = await api.post('/exams', data);
    return response.data;
  },

  async updateExam(id, data) {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  async deleteExam(id) {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  }
};

export default examService;
