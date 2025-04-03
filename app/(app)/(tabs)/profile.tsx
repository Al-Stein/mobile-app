import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native';
import { Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, X, Phone, Mail } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDriverStore } from '@/store/useDriverStore';
import { useState } from 'react';

const profileImage = 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80';

const menuItems = [
  {
    icon: Settings,
    title: 'Paramètres du compte',
    subtitle: 'Modifier vos informations personnelles',
    onPress: () => {
      router.push('/settings/account');
    }
  },
  {
    icon: Bell,
    title: 'Notifications',
    subtitle: 'Gérer vos préférences de notification',
    onPress: () => {
      router.push('/settings/notifications');
    }
  },
  {
    icon: Shield,
    title: 'Confidentialité & Sécurité',
    subtitle: 'Gérer vos paramètres de sécurité',
    onPress: () => {
      router.push('/settings/privacy');
    }
  },
  {
    icon: HelpCircle,
    title: 'Aide & Support',
    subtitle: 'Obtenir de l\'aide ou contacter le support',
    onPress: () => {}
  },
];

export default function ProfileScreen() {
  const { profile } = useDriverStore();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel'
        },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleSupport = () => {
    setShowSupportModal(true);
  };

  // Update the menu items to include the support handler
  menuItems[3].onPress = handleSupport;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
            <Text style={styles.role}>Chauffeur Professionnel</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Chauffeur Premium</Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.92</Text>
            <Text style={styles.statLabel}>Note</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2a 3m</Text>
            <Text style={styles.statLabel}>Expérience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,234</Text>
            <Text style={styles.statLabel}>Trajets</Text>
          </View>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}>
            <View style={styles.menuIcon}>
              <item.icon size={24} color="#1a365d" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>

      <Modal
        visible={showSupportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSupportModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Aide & Support</Text>
              <TouchableOpacity 
                onPress={() => setShowSupportModal(false)}
                style={styles.closeButton}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Notre équipe de support est disponible 24/7 pour vous aider
            </Text>

            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>Service Client</Text>
              
              <TouchableOpacity style={styles.contactItem}>
                <Phone size={20} color="#1a365d" />
                <Text style={styles.contactText}>01 23 45 67 89</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.contactItem}>
                <Mail size={20} color="#1a365d" />
                <Text style={styles.contactText}>support@shuttlepro.com</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.supportSection}>
              <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
              <Text style={styles.scheduleText}>
                Lundi - Dimanche : 24h/24, 7j/7
              </Text>
              <Text style={styles.scheduleNote}>
                Temps de réponse moyen : moins de 5 minutes
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowSupportModal(false)}>
              <Text style={styles.closeModalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  role: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  badge: {
    backgroundColor: '#1a365d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  menu: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 24,
  },
  supportSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginLeft: 12,
  },
  scheduleText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a365d',
    marginBottom: 8,
  },
  scheduleNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    fontStyle: 'italic',
  },
  closeModalButton: {
    backgroundColor: '#1a365d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  closeModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});