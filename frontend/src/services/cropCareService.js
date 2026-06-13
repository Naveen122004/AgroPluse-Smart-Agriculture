import api from './api';

export const cropCareService = {
  getAll: () => api.get('/crop-care'),
  search: (q) => api.get('/crop-care/search', { params: { q } }),
  filter: (crop, category) => api.get('/crop-care/filter', { params: { crop, category } }),
  getById: (id) => api.get(`/crop-care/${id}`),
  getTipOfDay: () => api.get('/crop-care/tip-of-day'),
};
