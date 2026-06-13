import api from './api';

export const weatherService = {
  getCurrent: (city) => api.get('/weather/current', { params: { city } }),
  getForecast: (city) => api.get('/weather/forecast', { params: { city } }),
  getByLocation: (lat, lon) => api.get('/weather/location', { params: { lat, lon } }),
  getHistory: () => api.get('/weather/history'),
};
