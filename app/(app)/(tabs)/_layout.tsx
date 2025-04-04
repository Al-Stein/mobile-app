import { Tabs } from 'expo-router';
import {
  MapPin,
  ChartBar as BarChart,
  User,
  MessageSquare,
} from 'lucide-react-native';
import { StyleSheet } from 'react-native';

// Types
type TabBarIconProps = {
  color: string;
  size: number;
};

// Constants
const COLORS = {
  active: '#1a365d',
  inactive: '#4a5568',
  background: '#fff',
  border: '#e2e8f0',
} as const;

// Tab configuration
const TAB_SCREENS = [
  {
    name: 'index',
    href: '/(app)/(tabs)/',
    title: 'Missions',
    icon: MapPin,
  },
  {
    name: 'dashboard',
    href: '/(app)/(tabs)/dashboard',
    title: 'Dashboard',
    icon: BarChart,
  },
  {
    name: 'feedback',
    href: '/(app)/(tabs)/feedback',
    title: 'Avis',
    icon: MessageSquare,
  },
  {
    name: 'profile',
    href: '/(app)/(tabs)/profile',
    title: 'Profile',
    icon: User,
  },
] as const;

export default function TabLayout() {
  return (
    <Tabs screenOptions={styles.screenOptions}>
      {TAB_SCREENS.map((screen) => (
        <Tabs.Screen
          key={screen.name}
          name={screen.name}
          options={{
            href: screen.href,
            title: screen.title,
            tabBarIcon: ({ color, size }: TabBarIconProps) => (
              <screen.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = {
  screenOptions: {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: COLORS.background,
      borderTopColor: COLORS.border,
      height: 60,
      paddingBottom: 8,
    },
    tabBarActiveTintColor: COLORS.active,
    tabBarInactiveTintColor: COLORS.inactive,
    tabBarLabelStyle: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
    },
  },
} as const;
