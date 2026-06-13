import api from './api';

export const marketService = {
  getPrices: (params) => api.get('/market/prices', { params }),
  search: (crop, params = {}) => api.get('/market/prices/search', { params: { crop, ...params } }),
  filter: (state, district, params = {}) =>
    api.get('/market/prices/filter', { params: { state, district, ...params } }),
  getTrends: (crop) => api.get('/market/prices/trends', { params: { crop } }),
  getWeekly: (crop) => api.get('/market/prices/weekly', { params: { crop } }),
};
