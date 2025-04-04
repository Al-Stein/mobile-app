export default {
  name: 'ShuttlePro',
  slug: 'shuttlepro',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    backgroundColor: '#ffffff'
  },
  updates: {
    fallbackToCacheTimeout: 0
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    backgroundColor: '#FFFFFF'
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  },
  plugins: [
    'expo-router',
    'expo-secure-store'
  ]
}