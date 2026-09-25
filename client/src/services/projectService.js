import api from './api.js';

export const projectService = {
  async getProjects(params = {}) {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async createProject(data) {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async updateProject(id, data) {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id) {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  async requestToJoin(id, message) {
    const response = await api.post(`/projects/${id}/request`, { message });
    return response.data;
  },

  async getMyRequests() {
    const response = await api.get('/projects/my-requests');
    return response.data;
  },

  async getProjectRequests(projectId) {
    const response = await api.get(`/projects/${projectId}/requests`);
    return response.data;
  },

  async updateRequestStatus(requestId, status) {
    const response = await api.put(`/projects/requests/${requestId}`, { status });
    return response.data;
  }
};

export default projectService;
