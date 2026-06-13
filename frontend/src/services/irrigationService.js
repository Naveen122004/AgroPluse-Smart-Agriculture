import api from './api';

export const irrigationService = {
  getRecommendation: (data) => api.post('/irrigation/recommend', data),
  getHistory: () => api.get('/irrigation/history'),
};
