import { defineStore } from 'pinia';
import { cardService } from '../services/cardService';

export const useCardStore = defineStore('card', {
  state: () => ({
    cards: [],
    currentCard: null, 
    pagination: {
      currentPage: 1,
      lastPage: 1,
      total: 0,
      perPage: 10
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchCards(page = 1, search = '') {
      this.loading = true;
      this.error = null;
      try {
        const response = await cardService.getCards(page, search);
        this.cards = response.data.data;
        this.pagination = {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total,
          perPage: response.data.per_page
        };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch cards';
      } finally {
        this.loading = false;
      }
    },

    async createCard(cardData) {
      this.loading = true;
      this.error = null;
      try {
        await cardService.createCard(cardData);
        await this.fetchCards(1); 
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create card';
        throw error; 
      } finally {
        this.loading = false;
      }
    },

    async updateCard(id, cardData) {
      this.loading = true;
      this.error = null;
      try {
        await cardService.updateCard(id, cardData);
        await this.fetchCards(this.pagination.currentPage); 
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update card';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteCard(id) {
      this.loading = true;
      this.error = null;
      try {
        await cardService.deleteCard(id);
        await this.fetchCards(this.pagination.currentPage);
        return true;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete card';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});