import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Bell, MessageSquare, Car, Calendar } from 'lucide-react-native';
import { useDriverStore } from '@/store/useDriverStore';

export default function NotificationsScreen() {
  const { notifications, updateNotifications } = useDriverStore();

  const toggleNotification = (key: keyof typeof notifications) => {
    updateNotifications({ [key]: !notifications[key] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1a365d" />
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#1a365d" />
            <Text style={styles.sectionTitle}>Préférences de notification</Text>
          </View>

          <View style={styles.optionsList}>
            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Car size={20} color="#64748b" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Nouvelles missions</Text>
                  <Text numberOfLines={2} style={styles.optionDescription}>
                    Alertes missions disponibles
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.newMissions}
                onValueChange={() => toggleNotification('newMissions')}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={notifications.newMissions ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <MessageSquare size={20} color="#64748b" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Messages</Text>
                  <Text numberOfLines={2} style={styles.optionDescription}>
                    Messages clients
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.messages}
                onValueChange={() => toggleNotification('messages')}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={notifications.messages ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Calendar size={20} color="#64748b" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>Rappels</Text>
                  <Text numberOfLines={2} style={styles.optionDescription}>
                    Alertes missions à venir
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications.reminders}
                onValueChange={() => toggleNotification('reminders')}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={notifications.reminders ? '#fff' : '#fff'}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginLeft: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  optionsList: {
    gap: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
});