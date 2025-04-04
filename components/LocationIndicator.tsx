import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MapPin, WifiOff, Navigation, Loader as Loader2 } from 'lucide-react-native';
import { useLocationPermissions } from '@/hooks/useLocationPermissions';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';

const AnimatedLoader = Animated.createAnimatedComponent(Loader2);

export function LocationIndicator() {
  const { hasPermission, currentLocation, error } = useLocationPermissions();

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotate: withRepeat(
          withTiming('360deg', { duration: 2000 }),
          -1,
          false
        ),
      }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      ),
    };
  });

  return (
    <View style={styles.container}>
      {error ? (
        <>
          <View style={[styles.indicator, styles.inactiveIndicator]}>
            <WifiOff size={14} color="#fff" />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.text, styles.inactiveText]} numberOfLines={2}>
              {error}
            </Text>
          </View>
        </>
      ) : hasPermission && currentLocation ? (
        <>
          <Animated.View style={[styles.indicator, styles.activeIndicator, pulseStyle]}>
            <MapPin size={14} color="#fff" />
          </Animated.View>
          <View style={styles.infoContainer}>
            <Text style={[styles.text, styles.activeText]}>GPS actif</Text>
            <Text style={styles.coordinates}>
              {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.indicator, styles.loadingIndicator]}>
            <AnimatedLoader size={14} color="#fff" style={rotationStyle} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.text, styles.loadingText]}>
              Vérification du GPS...
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 100,
    minWidth: 150,
  },
  indicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activeIndicator: {
    backgroundColor: '#0d9488',
  },
  inactiveIndicator: {
    backgroundColor: '#dc2626',
  },
  loadingIndicator: {
    backgroundColor: '#6366f1',
  },
  infoContainer: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  activeText: {
    color: '#0d9488',
  },
  inactiveText: {
    color: '#dc2626',
  },
  loadingText: {
    color: '#6366f1',
  },
  coordinates: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
});