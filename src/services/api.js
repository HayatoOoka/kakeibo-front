import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

export default {
  getorganizations() {
    return apiClient.get('/organizations');
  },
  getArticle(id) {
    return apiClient.get(`/organizations/${id}`);
  },
  createArticle(article) {
    return apiClient.post('/organizations', article);
  },
  updateArticle(id, article) {
    return apiClient.put(`/organizations/${id}`, article);
  },
  deleteArticle(id) {
    return apiClient.delete(`/organizations/${id}`);
  }
};
