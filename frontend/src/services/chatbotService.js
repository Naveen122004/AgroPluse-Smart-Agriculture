import api from './api';

export const chatbotService = {
  sendMessage: (message) => api.post('/chatbot/message', { message }),
  getHistory: () => api.get('/chatbot/history'),
  getSuggestions: () => api.get('/chatbot/suggestions'),
};
