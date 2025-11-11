import api from './api';

export const cardService = {
  getCards(page = 1, search = '') {
    const params = { page }; 


    if (search) {
      params.search = search;
    }

    // api
    return api.get('/cards', { params });
  },

  getCard(id) {
    return api.get(`/cards/${id}`);
  },

  createCard(data) {
    return api.post('/cards', data);
  },

  updateCard(id, data) {
    return api.put(`/cards/${id}`, data);
  },

  deleteCard(id) {
    return api.delete(`/cards/${id}`);
  }
};