import api from './api.js';

export const getSummary = async () => {
  const response = await api.get('/gamification/summary');
  return response.data;
};

export const logAction = async (actionType, xp, extraData = {}) => {
  const response = await api.post('/gamification/action', {
    actionType,
    xp,
    extraData
  });
  return response.data;
};

export default {
  getSummary,
  logAction
};
