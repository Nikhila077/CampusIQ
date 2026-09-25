import api from './api.js';

export const subjectService = {
  async getSubjects() {
    const response = await api.get('/subjects');
    return response.data;
  },

  async createSubject(subjectData) {
    const response = await api.post('/subjects', subjectData);
    return response.data;
  },

  async updateSubject(id, subjectData) {
    const response = await api.put(`/subjects/${id}`, subjectData);
    return response.data;
  },

  async deleteSubject(id) {
    const response = await api.delete(`/subjects/${id}`);
    return response.data;
  },

  async updatePriority(id, priority) {
    const response = await api.put(`/subjects/${id}/priority`, { priority });
    return response.data;
  }
};

export default subjectService;
