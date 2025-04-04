import { Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(app)/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}