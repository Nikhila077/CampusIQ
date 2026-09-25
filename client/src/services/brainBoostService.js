import api from './api.js';

export const getTodayQuestion = async () => {
  const response = await api.get('/brain-boost/today');
  return response.data;
};

export const submitAnswer = async (questionId, selectedOption) => {
  const response = await api.post('/brain-boost/answer', {
    questionId,
    selectedOption
  });
  return response.data;
};

export default {
  getTodayQuestion,
  submitAnswer
};
