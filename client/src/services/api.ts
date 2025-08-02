import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: { identifier: string; password: string }) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await this.api.put('/auth/profile', data);
    return response.data;
  }

  // Transaction endpoints
  async getTransactions(params?: any) {
    const response = await this.api.get('/transactions', { params });
    return response.data;
  }

  async getTransaction(transactionId: string) {
    const response = await this.api.get(`/transactions/${transactionId}`);
    return response.data;
  }

  async sendMoney(data: any) {
    const response = await this.api.post('/transactions/send', data);
    return response.data;
  }

  async requestMoney(data: any) {
    const response = await this.api.post('/transactions/request', data);
    return response.data;
  }

  async schedulePayment(data: any) {
    const response = await this.api.post('/transactions/schedule', data);
    return response.data;
  }

  async setupRecurring(data: any) {
    const response = await this.api.post('/transactions/recurring', data);
    return response.data;
  }

  async approveTransaction(transactionId: string, action: 'approve' | 'reject') {
    const response = await this.api.patch(`/transactions/${transactionId}/approve`, { action });
    return response.data;
  }

  // Rating endpoints
  async createRating(data: any) {
    const response = await this.api.post('/ratings', data);
    return response.data;
  }

  async getUserRatings(userId: string, params?: any) {
    const response = await this.api.get(`/ratings/user/${userId}`, { params });
    return response.data;
  }

  async getGivenRatings(params?: any) {
    const response = await this.api.get('/ratings/given', { params });
    return response.data;
  }

  async getReceivedRatings(params?: any) {
    const response = await this.api.get('/ratings/received', { params });
    return response.data;
  }

  async getTopRatedUsers() {
    const response = await this.api.get('/ratings/top-users');
    return response.data;
  }

  // User endpoints
  async searchUsers(query: string) {
    const response = await this.api.get(`/users/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  async getUser(userId: string) {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async getUserTransactions(userId: string, params?: any) {
    const response = await this.api.get(`/users/${userId}/transactions`, { params });
    return response.data;
  }

  // Truecaller endpoints
  async verifyPhone(phoneNumber: string) {
    const response = await this.api.post('/truecaller/verify-phone', { phoneNumber });
    return response.data;
  }

  async searchContact(phoneNumber: string) {
    const response = await this.api.post('/truecaller/search', { phoneNumber });
    return response.data;
  }

  async syncContacts() {
    const response = await this.api.post('/truecaller/sync-contacts');
    return response.data;
  }

  async getTruecallerStatus() {
    const response = await this.api.get('/truecaller/status');
    return response.data;
  }

  // Dashboard endpoints
  async getDashboard() {
    const response = await this.api.get('/dashboard/overview');
    return response.data;
  }

  async getTransactionAnalytics(period?: string) {
    const response = await this.api.get('/dashboard/analytics/transactions', {
      params: { period }
    });
    return response.data;
  }

  async getRatingAnalytics() {
    const response = await this.api.get('/dashboard/analytics/ratings');
    return response.data;
  }

  async getFinancialInsights() {
    const response = await this.api.get('/dashboard/insights/financial');
    return response.data;
  }

  async getSecurityOverview() {
    const response = await this.api.get('/dashboard/security');
    return response.data;
  }
}

export default new ApiService();