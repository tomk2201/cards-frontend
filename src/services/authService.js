import api from './api';

export const authService = {
  login(credentials) {
    return api.post('/login', credentials);
  },
  logout() {
    return api.post('/logout');
  },
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  setToken(token) {
    localStorage.setItem('token', token);
  },
  removeToken() {
    localStorage.removeItem('token');
  }
};