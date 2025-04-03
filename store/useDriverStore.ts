import { create } from 'zustand';

interface DriverProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
}

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
  profile: DriverProfile;
  notifications: NotificationPreferences;
  privacySettings: PrivacySettings;
  language: Language;
  updateProfile: (data: Partial<DriverProfile>) => void;
  updateNotifications: (data: Partial<NotificationPreferences>) => void;
  updatePrivacySettings: (data: Partial<PrivacySettings>) => void;
  updateLanguage: (language: Language) => void;
}

export const useDriverStore = create<DriverState>((set) => ({
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+33612345678',
    address: '123 Rue de Paris',
    city: 'Paris',
    postalCode: '75001',
    licenseNumber: 'VTC123456',
    vehicleModel: 'Mercedes Classe S',
    vehiclePlate: 'AB-123-CD',
  },
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
  updateProfile: (data) => 
    set((state) => ({
      profile: {
        ...state.profile,
        ...data,
      },
    })),
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
}));