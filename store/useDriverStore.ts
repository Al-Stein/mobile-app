import { create } from 'zustand';
import type { Driver, DriverUpdateDto } from '@/types/driver';
import { driverService } from '@/services/api';

interface NotificationPreferences {
  newMissions: boolean;
  messages: boolean;
  reminders: boolean;
}

interface PrivacySettings {
  locationTracking: boolean;
  dataSharing: boolean;
  biometricLogin: boolean;
}

type Language = 'fr' | 'en';

interface DriverState {
  profile: Driver | null;
  isLoading: boolean;
  error: string | null;
  notifications: NotificationPreferences;
  privacySettings: PrivacySettings;
  language: Language;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: DriverUpdateDto) => Promise<void>;
  updateNotifications: (data: Partial<NotificationPreferences>) => void;
  updatePrivacySettings: (data: Partial<PrivacySettings>) => void;
  updateLanguage: (language: Language) => void;
  clearError: () => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,
  notifications: {
    newMissions: true,
    messages: true,
    reminders: true,
  },
  privacySettings: {
    locationTracking: true,
    dataSharing: true,
    biometricLogin: false,
  },
  language: 'fr',
  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const profile = await driverService.getProfile();
      set({ profile, isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors du chargement du profil',
        isLoading: false,
        profile: null
      });
    }
  },
  updateProfile: async (data: DriverUpdateDto) => {
    try {
      set({ isLoading: true, error: null });
      const updatedProfile = await driverService.updateProfile(data);
      set({ profile: updatedProfile, isLoading: false, error: null });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil',
        isLoading: false 
      });
      throw error;
    }
  },
  updateNotifications: (data) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        ...data,
      },
    })),
  updatePrivacySettings: (data) =>
    set((state) => ({
      privacySettings: {
        ...state.privacySettings,
        ...data,
      },
    })),
  updateLanguage: (language) =>
    set(() => ({
      language,
    })),
  clearError: () => set({ error: null }),
}));