import api from './api';

export const diseaseService = {
  getAll: () => api.get('/diseases'),
  search: (q) => api.get('/diseases/search', { params: { q } }),
  filter: (crop, category) => api.get('/diseases/filter', { params: { crop, category } }),
  getById: (id) => api.get(`/diseases/${id}`),
};
