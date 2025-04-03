import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { locationService, LocationData } from '@/services/location';

export function useLocationPermissions() {
  const [hasPermission, setHasPermission] = useState(false);
  const [lastCheck, setLastCheck] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const checkPermissions = async () => {
    if (isCheckingStatus) return;
    
    try {
      setIsCheckingStatus(true);
      const now = Date.now();
      
      // Vérifier si on a déjà fait une vérification récemment
      if (now - lastCheck < 30000) {
        return;
      }
      
      setLastCheck(now);

      // Vérifier les permissions
      const { status } = await Location.getForegroundPermissionsAsync();
      const isGranted = status === 'granted';
      
      if (!isGranted) {
        setHasPermission(false);
        setCurrentLocation(null);
        setError('Permission de localisation non accordée');
        return;
      }

      // Vérifier si le service de localisation est activé
      const locationEnabled = await Location.hasServicesEnabledAsync();
      
      if (!locationEnabled) {
        setHasPermission(false);
        setCurrentLocation(null);
        setError('GPS désactivé');
        return;
      }

      try {
        // Tenter d'obtenir la position actuelle avec un timeout
        const location = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          )
        ]) as Location.LocationObject;

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          heading: location.coords.heading,
          speed: location.coords.speed,
          timestamp: location.timestamp
        });
        setHasPermission(true);
        setError(null);
      } catch (locationError) {
        console.error('Erreur lors de la récupération de la position:', locationError);
        setHasPermission(false);
        setCurrentLocation(null);
        setError('Impossible d\'obtenir la position GPS');
      }

    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      setHasPermission(false);
      setCurrentLocation(null);
      setError('Erreur lors de l\'accès à la localisation');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setHasPermission(false);
        setCurrentLocation(null);
        setError('Permission refusée');
        return false;
      }

      await checkPermissions();
      return true;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setHasPermission(false);
      setCurrentLocation(null);
      setError('Erreur lors de la demande de permission');
      return false;
    }
  };

  useEffect(() => {
    checkPermissions();
    const intervalId = setInterval(checkPermissions, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    hasPermission,
    currentLocation,
    error,
    requestPermission,
    locationService,
  };
}