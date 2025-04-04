import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { View, ActivityIndicator, Text, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function RootLayout() {
  useFrameworkReady();
  const { checkAuth } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      checkAuth().finally(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#fff' 
      }}>
        <ActivityIndicator size="large" color="#1a365d" />
        <Text style={{ 
          marginTop: 12,
          fontSize: 16,
          fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
          color: '#64748b'
        }}>
          Chargement...
        </Text>
      </View>
    );
  }

  return (
    <>
      <Slot />
      <StatusBar style="dark" />
    </>
  );
}