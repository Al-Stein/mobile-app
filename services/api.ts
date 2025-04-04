import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Web storage fallback
const webStorage = {
  getItem: (key: string) => localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
};

const storage = Platform.OS === 'web' ? webStorage : {
  getItem: async (key: string) => await SecureStore.getItemAsync(key),
  setItem: async (key: string, value: string) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key: string) => await SecureStore.deleteItemAsync(key),
};

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'https://carresa.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await storage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error setting auth token:', error);
    return config;
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.removeItem('auth_token');
      if (Platform.OS === 'web') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/driver-login', {
        email,
        password,
      });
      
      if (response.data?.token) {
        await storage.setItem('auth_token', response.data.token);
        return response.data;
      } else {
        throw new Error('Token non reçu');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Login error response:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Erreur de connexion');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      await storage.removeItem('auth_token');
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement du profil');
      }
      throw error;
    }
  },

  verifyToken: async () => {
    try {
      const token = await storage.getItem('auth_token');
      if (!token) return false;
      
      const response = await api.post('/auth/verify-token');
      return response.data.valid;
    } catch (error) {
      return false;
    }
  },
};

export default api;