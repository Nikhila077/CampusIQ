import api from './api.js';

export const attendanceService = {
  async getSummary() {
    const response = await api.get('/attendance/summary');
    return response.data;
  },

  async getInsights() {
    const response = await api.get('/attendance/insights');
    return response.data;
  },

  async simulate(params) {
    const response = await api.post('/attendance/simulate', params);
    return response.data;
  },

  async getAll(params = {}) {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  async getSubjectAttendance(subjectId) {
    const response = await api.get(`/attendance/subject/${subjectId}`);
    return response.data;
  },

  async logAttendance(data) {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  async updateAttendance(id, data) {
    const response = await api.put(`/attendance/${id}`, data);
    return response.data;
  },

  async deleteAttendance(id) {
    const response = await api.delete(`/attendance/${id}`);
    return response.data;
  }
};

export default attendanceService;
