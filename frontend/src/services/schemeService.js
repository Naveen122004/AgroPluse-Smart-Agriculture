import api from './api';

export const schemeService = {
  getAll:           (params)    => api.get('/schemes', { params }),
  getLatest:        ()          => api.get('/schemes/latest'),
  getNew:           ()          => api.get('/schemes/new'),
  search:           (q)         => api.get('/schemes/search', { params: { q } }),
  filter:           (state)     => api.get('/schemes/filter', { params: { state } }),
  filterByCategory: (category)  => api.get(`/schemes/category/${encodeURIComponent(category)}`),
  getCategories:    ()          => api.get('/schemes/categories'),
  getStates:        ()          => api.get('/schemes/states'),
  getById:          (id)        => api.get(`/schemes/${id}`),
  save:             (id)        => api.post(`/schemes/${id}/save`),
  unsave:           (id)        => api.delete(`/schemes/${id}/save`),
  getSaved:         ()          => api.get('/schemes/saved'),
  triggerSync:      ()          => api.post('/schemes/sync'),
};
