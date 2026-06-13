import api from './api';

export const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),
  getActivities: () => api.get('/dashboard/activities'),
};

export const contactService = {
  submit: (data) => api.post('/contact', data),
};
