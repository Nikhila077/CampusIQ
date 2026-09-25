import api from './api.js';

export const timetableService = {
  async getTimetable() {
    const response = await api.get('/timetable');
    return response.data;
  },

  async getTodayClasses() {
    const response = await api.get('/timetable/today');
    return response.data;
  },

  async createSlot(slotData) {
    const response = await api.post('/timetable', slotData);
    return response.data;
  },

  async updateSlot(id, slotData) {
    const response = await api.put(`/timetable/${id}`, slotData);
    return response.data;
  },

  async deleteSlot(id) {
    const response = await api.delete(`/timetable/${id}`);
    return response.data;
  }
};

export default timetableService;
