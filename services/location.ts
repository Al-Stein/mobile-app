import * as Location from 'expo-location';
import { Platform } from 'react-native';
import api from './api';

// Types pour la localisation
export interface LocationData {
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

class LocationService {
  private watchId: Location.LocationSubscription | null = null;
  private lastLocation: LocationData | null = null;
  private isTracking = false;

  // Configuration du suivi de localisation
  private readonly trackingConfig: Location.LocationOptions = {
    accuracy: Location.Accuracy.High,
    timeInterval: 5000, // Mise à jour toutes les 5 secondes
    distanceInterval: 10, // Mise à jour tous les 10 mètres
  };

  // Démarrer le suivi de localisation
  async startTracking(missionId: string) {
    try {
      // Vérifier les permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Permission de localisation refusée');
      }

      // Vérifier si le service de localisation est activé
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        throw new Error('Service de localisation désactivé');
      }

      // Obtenir la position initiale
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      this.lastLocation = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        heading: initialLocation.coords.heading,
        speed: initialLocation.coords.speed,
        timestamp: initialLocation.timestamp
      };

      // Envoyer la position initiale au serveur
      await this.sendLocationUpdate(missionId, this.lastLocation);

      // Démarrer le suivi en temps réel
      this.watchId = await Location.watchPositionAsync(
        this.trackingConfig,
        async (location) => {
          const locationData: LocationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            heading: location.coords.heading,
            speed: location.coords.speed,
            timestamp: location.timestamp
          };

          this.lastLocation = locationData;
          await this.sendLocationUpdate(missionId, locationData);
        }
      );

      this.isTracking = true;
    } catch (error) {
      console.error('Erreur lors du démarrage du suivi:', error);
      throw error;
    }
  }

  // Arrêter le suivi de localisation
  async stopTracking() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.isTracking = false;
    this.lastLocation = null;
  }

  // Obtenir la dernière position connue
  getLastLocation(): LocationData | null {
    return this.lastLocation;
  }

  // Vérifier si le suivi est actif
  isTrackingActive(): boolean {
    return this.isTracking;
  }

  // Envoyer la mise à jour de position au serveur
  private async sendLocationUpdate(missionId: string, location: LocationData) {
    try {
      await api.post(`/missions/${missionId}/location`, location);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la position:', error);
      // On continue le suivi même en cas d'erreur d'envoi
    }
  }

  // Calculer la distance entre deux points
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Rayon de la terre en mètres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  }
}

export const locationService = new LocationService();