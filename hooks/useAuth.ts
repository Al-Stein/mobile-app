import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: any | null;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  getProfile: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  user: null,

  login: async (phone: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(phone, password);
      
      // Store the token
      await SecureStore.setItemAsync('auth_token', response.token);
      
      // Get user profile
      const profile = await authService.getProfile();
      
      set({ 
        isAuthenticated: true, 
        isLoading: false,
        user: profile.data 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Une erreur est survenue',
        isLoading: false 
      });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      await SecureStore.deleteItemAsync('auth_token');
      set({ 
        isAuthenticated: false, 
        isLoading: false,
        user: null 
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await SecureStore.getItemAsync('auth_token');
      
      if (token) {
        // Get user profile
        const profile = await authService.getProfile();
        set({ 
          isAuthenticated: true,
          user: profile.data
        });
      }
    } catch (error) {
      await SecureStore.deleteItemAsync('auth_token');
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ isLoading: false });
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