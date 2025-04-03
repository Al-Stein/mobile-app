import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (phone: string, password: string) => {
    const response = await api.post('/auth/login', {
      phone,
      password,
    });
    return response.data;
  },

  register: async (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    await SecureStore.deleteItemAsync('auth_token');
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }>) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Mission service
export const missionService = {
  getMissions: async (params?: {
    status?: string;
    date?: string;
  }) => {
    const response = await api.get('/missions', { params });
    return response.data;
  },

  getMissionById: async (id: string) => {
    const response = await api.get(`/missions/${id}`);
    return response.data;
  },

  updateMissionStatus: async (id: string, status: string) => {
    const response = await api.patch(`/missions/${id}/status`, { status });
    return response.data;
  },
};

// Feedback service
export const feedbackService = {
  getFeedbacks: async (params?: {
    type?: 'positive' | 'negative';
    page?: number;
  }) => {
    const response = await api.get('/feedbacks', { params });
    return response.data;
  },
};

export default api;