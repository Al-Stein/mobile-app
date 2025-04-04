import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/api';

// Web storage fallback
const webStorage = {
  setItemAsync: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getItemAsync: (key: string) => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (e) {
      return Promise.reject(e);
    }
  },
  deleteItemAsync: (key: string) => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

// Use SecureStore on native platforms, localStorage on web
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  user: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(email, password);
      
      const profile = await authService.getProfile();
      
      set({ 
        isAuthenticated: true, 
        isLoading: false,
        user: profile.data,
        error: null
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Une erreur est survenue',
        isLoading: false,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await authService.logout();
      await storage.deleteItemAsync('auth_token');
      
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        user: null,
        error: null
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if there's an error, ensure we clear the state
      await storage.deleteItemAsync('auth_token');
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        user: null,
        error: error.message || 'Une erreur est survenue lors de la déconnexion'
      });
      throw error;
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      
      const isValid = await authService.verifyToken();
      
      if (isValid) {
        const profile = await authService.getProfile();
        set({ 
          isAuthenticated: true,
          user: profile.data,
          error: null,
          isLoading: false
        });
      } else {
        await storage.deleteItemAsync('auth_token');
        set({ 
          isAuthenticated: false,
          user: null,
          error: null,
          isLoading: false
        });
      }
    } catch (error) {
      await storage.deleteItemAsync('auth_token');
      set({ 
        isAuthenticated: false, 
        user: null,
        error: null,
        isLoading: false
      });
    }
  },

  getProfile: async () => {
    try {
      const profile = await authService.getProfile();
      set({ user: profile.data });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  },
}));