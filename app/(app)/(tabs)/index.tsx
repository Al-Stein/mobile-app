import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, Clipboard } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocationPermissions } from '@/hooks/useLocationPermissions';
import { MapPin, Clock, Users, Plane, ChevronRight, Route, Car, MessageCircle, Navigation, Calendar, CircleCheck as CheckCircle2, Circle as XCircle, FileText, Copy, CheckCheck } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LocationIndicator } from '@/components/LocationIndicator';

type Mission = {
  id: string;
  bookingRef: string;
  passengerName: string;
  clientName: string;
  clientPhone: string;
  pickupTime: string;
  pickupLocation: string;
  destination: string;
  passengers: number;
  flightNumber?: string;
  flightStatus?: 'on-time' | 'delayed' | 'landed' | 'boarding';
  distance: number;
  category: 'Standard' | 'Executive';
  status: 'pending' | 'accepted' | 'en_route' | 'arrived' | 'on_board' | 'completed' | 'no_show';
  isAirportPickup: boolean;
  date: string;
};

type Tab = 'today' | 'tomorrow' | 'completed' | 'no-show';

export default function MissionsScreen() {
  const { hasPermission, requestPermission } = useLocationPermissions();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [lastStatusChange, setLastStatusChange] = useState<{ [key: string]: number }>({});
  const [timerProgress, setTimerProgress] = useState<{ [key: string]: number }>({});
  const [copiedRef, setCopiedRef] = useState<string | null>(null);
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: '1',
      bookingRef: 'BK-2024-001',
      passengerName: 'John Doe',
      clientName: 'Corporate Travel Ltd',
      clientPhone: '+33612345678',
      pickupTime: '14:30',
      pickupLocation: 'Terminal 2B',
      destination: 'Hotel Metropol',
      passengers: 2,
      flightNumber: 'AF1234',
      flightStatus: 'on-time',
      distance: 45.5,
      category: 'Executive',
      status: 'pending',
      isAirportPickup: true,
      date: new Date().toISOString(),
    },
    {
      id: '2',
      bookingRef: 'BK-2024-002',
      passengerName: 'Alice Smith',
      clientName: 'Direct Booking',
      clientPhone: '+33698765432',
      pickupTime: '15:45',
      pickupLocation: 'Hilton Paris',
      destination: 'Charles de Gaulle Terminal 1',
      passengers: 1,
      distance: 32.8,
      category: 'Standard',
      status: 'completed',
      isAirportPickup: false,
      date: new Date().toISOString(),
    },
    {
      id: '3',
      bookingRef: 'BK-2024-003',
      passengerName: 'Emma Wilson',
      clientName: 'Business Travel Inc',
      clientPhone: '+33678901234',
      pickupTime: '09:15',
      pickupLocation: 'Orly Airport Terminal 1',
      destination: 'La Défense',
      passengers: 3,
      flightNumber: 'BA789',
      flightStatus: 'on-time',
      distance: 38.2,
      category: 'Executive',
      status: 'pending',
      isAirportPickup: true,
      date: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: '4',
      bookingRef: 'BK-2024-004',
      passengerName: 'Michael Brown',
      clientName: 'Private Client',
      clientPhone: '+33634567890',
      pickupTime: '11:30',
      pickupLocation: 'Ritz Paris',
      destination: 'Versailles',
      passengers: 2,
      distance: 25.6,
      category: 'Executive',
      status: 'no_show',
      isAirportPickup: false,
      date: new Date().toISOString(),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newProgress = {};
      
      Object.entries(lastStatusChange).forEach(([missionId, timestamp]) => {
        const elapsed = now - timestamp;
        if (elapsed < 60000) {
          (newProgress as Record<string, number>)[missionId] = (60000 - elapsed) / 60000;
        }
      });
      
      setTimerProgress(newProgress);
    }, 100);

    return () => clearInterval(interval);
  }, [lastStatusChange]);

  const handleStatusChange = async (missionId: string, newStatus: Mission['status']) => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert(
          "Permission Required",
          "GPS location is required to update mission status.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    const now = Date.now();
    const lastChange = lastStatusChange[missionId] || 0;
    const timeDiff = now - lastChange;
    
    if (lastChange && timeDiff < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeDiff) / 1000);
      Alert.alert(
        "Changement de statut non autorisé",
        `Veuillez patienter ${remainingSeconds} secondes avant de changer à nouveau le statut.`,
        [{ text: "OK" }]
      );
      return;
    }

    setMissions(prev =>
      prev.map(mission =>
        mission.id === missionId ? { ...mission, status: newStatus } : mission
      )
    );
    
    setLastStatusChange(prev => ({
      ...prev,
      [missionId]: now
    }));
  };

  const handleWhatsAppPress = (phone: string) => {
    Linking.openURL(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`);
  };

  const handleNavigationPress = (destination: string) => {
    const encodedDestination = encodeURIComponent(destination);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`);
  };

  const handleCopyBookingRef = (bookingRef: string) => {
    Clipboard.setString(bookingRef);
    setCopiedRef(bookingRef);
    
    setTimeout(() => {
      setCopiedRef(null);
    }, 2000);
  };

  const getFlightStatusColor = (status?: Mission['flightStatus']) => {
    switch (status) {
      case 'on-time': return '#15803d';
      case 'delayed': return '#dc2626';
      case 'landed': return '#0891b2';
      case 'boarding': return '#eab308';
      default: return '#64748b';
    }
  };

  const renderMissionCard = (mission: Mission) => {
    const isAccepted = mission.status !== 'pending';
    const statusColors = {
      pending: '#64748b',
      accepted: '#0891b2',
      en_route: '#0d9488',
      arrived: '#0d9488',
      on_board: '#0d9488',
      completed: '#15803d',
      no_show: '#dc2626',
    };

    return (
      <View key={mission.id} style={[styles.missionCard, isAccepted && styles.acceptedMissionCard]}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[mission.status] }]}>
              <Text style={[styles.statusText, { color: '#fff' }]}>{mission.status.replace('_', ' ')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.bookingRef}
              onPress={() => handleCopyBookingRef(mission.bookingRef)}>
              <FileText size={14} color="#64748b" />
              <Text style={styles.bookingRefText}>{mission.bookingRef}</Text>
              {copiedRef === mission.bookingRef ? (
                <CheckCheck size={14} color="#15803d" />
              ) : (
                <Copy size={14} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.categoryBadge}>
            <Car size={14} color={mission.category === 'Executive' ? '#1a365d' : '#64748b'} />
            <Text style={[
              styles.categoryText,
              { color: mission.category === 'Executive' ? '#1a365d' : '#64748b' }
            ]}>
              {mission.category}
            </Text>
          </View>
        </View>

        <View style={styles.missionHeader}>
          <Text style={styles.passengerName}>{mission.passengerName}</Text>
          <Text style={styles.clientName}>{mission.clientName}</Text>
        </View>

        <View style={styles.missionDetails}>
          <View style={styles.detailSection}>
            <View style={styles.detailRow}>
              <Clock size={16} color="#4a5568" />
              <Text style={styles.detailText}>{mission.pickupTime}</Text>
            </View>

            <View style={styles.detailRow}>
              <MapPin size={16} color="#4a5568" />
              <Text style={styles.detailText}>{mission.pickupLocation}</Text>
            </View>

            <View style={styles.detailRow}>
              <Navigation size={16} color="#4a5568" />
              <Text style={styles.detailText}>{mission.destination}</Text>
              <TouchableOpacity 
                style={styles.navigationButton}
                onPress={() => handleNavigationPress(mission.destination)}>
                <Text style={styles.navigationButtonText}>Navigate</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.detailRow}>
              <Route size={16} color="#4a5568" />
              <Text style={styles.detailText}>{mission.distance} km</Text>
            </View>

            <View style={styles.detailRow}>
              <Users size={16} color="#4a5568" />
              <Text style={styles.detailText}>{mission.passengers} passengers</Text>
            </View>

            {mission.flightNumber && (
              <View style={styles.flightInfo}>
                <View style={styles.detailRow}>
                  <Plane size={16} color="#4a5568" />
                  <Text style={styles.detailText}>{mission.flightNumber}</Text>
                  {mission.flightStatus && (
                    <View style={[styles.flightStatusBadge, { backgroundColor: getFlightStatusColor(mission.flightStatus) }]}>
                      <Text style={styles.flightStatusText}>{mission.flightStatus}</Text>
                    </View>
                  )}
                </View>
                {mission.isAirportPickup && (
                  <TouchableOpacity 
                    style={styles.trackFlightButton}
                    onPress={() => Linking.openURL(`https://www.flightradar24.com/data/flights/${mission.flightNumber?.toLowerCase()}`)}>
                    <Text style={styles.trackFlightText}>Track Flight</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={() => handleWhatsAppPress(mission.clientPhone)}>
            <MessageCircle size={20} color="#25D366" />
            <Text style={styles.whatsappText}>WhatsApp Client</Text>
          </TouchableOpacity>

          {timerProgress[mission.id] > 0 && (
            <View style={styles.timerContainer}>
              <View style={styles.timerTrack}>
                <Animated.View 
                  style={[
                    styles.timerProgress,
                    { width: `${timerProgress[mission.id] * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.timerText}>
                {Math.ceil(timerProgress[mission.id] * 60)}s avant prochain changement
              </Text>
            </View>
          )}

          {mission.status === 'pending' && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleStatusChange(mission.id, 'accepted')}>
              <Text style={styles.buttonText}>Accept Mission</Text>
            </TouchableOpacity>
          )}
          {mission.status === 'accepted' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#0d9488' }]}
              onPress={() => handleStatusChange(mission.id, 'en_route')}>
              <Text style={styles.buttonText}>Start Route</Text>
            </TouchableOpacity>
          )}
          {mission.status === 'en_route' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#0d9488' }]}
              onPress={() => handleStatusChange(mission.id, 'arrived')}>
              <Text style={styles.buttonText}>Arrived at Pickup</Text>
            </TouchableOpacity>
          )}
          {mission.status === 'arrived' && (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#0d9488', flex: 1 }]}
                onPress={() => handleStatusChange(mission.id, 'on_board')}>
                <Text style={styles.buttonText}>Passenger On Board</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#dc2626', marginLeft: 8 }]}
                onPress={() => handleStatusChange(mission.id, 'no_show')}>
                <Text style={styles.buttonText}>No Show</Text>
              </TouchableOpacity>
            </View>
          )}
          {mission.status === 'on_board' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#15803d' }]}
              onPress={() => handleStatusChange(mission.id, 'completed')}>
              <Text style={styles.buttonText}>Complete Mission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const filteredMissions = missions.filter(mission => {
    const missionDate = new Date(mission.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = missionDate.toDateString() === today.toDateString();
    const isTomorrow = missionDate.toDateString() === tomorrow.toDateString();

    switch (activeTab) {
      case 'today':
        return isToday && !['completed', 'no_show'].includes(mission.status);
      case 'tomorrow':
        return isTomorrow && !['completed', 'no_show'].includes(mission.status);
      case 'completed':
        return mission.status === 'completed';
      case 'no-show':
        return mission.status === 'no_show';
      default:
        return false;
    }
  });

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'today', label: "Aujourd'hui", icon: Clock },
    { id: 'tomorrow', label: 'Demain', icon: Calendar },
    { id: 'completed', label: 'Complétées', icon: CheckCircle2 },
    { id: 'no-show', label: 'No-Show', icon: XCircle },
  ];

  return (
    <View style={styles.container}>
      <LocationIndicator />
      <View style={styles.header}>
        <Text style={styles.title}>Missions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <tab.icon
                size={18}
                color={activeTab === tab.id ? '#1a365d' : '#64748b'}
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.missionsList}>
        {filteredMissions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucune mission {
              activeTab === 'today' ? "aujourd'hui" :
              activeTab === 'tomorrow' ? 'demain' :
              activeTab === 'completed' ? 'complétée' : 'no-show'
            }</Text>
          </View>
        ) : (
          filteredMissions.map(renderMissionCard)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  missionsList: {
    padding: 16,
  },
  missionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptedMissionCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#0d9488',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingRef: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bookingRefText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
    marginRight: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  missionHeader: {
    marginBottom: 16,
  },
  passengerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  missionDetails: {
    gap: 16,
  },
  detailSection: {
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
  },
  infoSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4a5568',
  },
  flightInfo: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  flightStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  flightStatusText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
  },
  trackFlightButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  trackFlightText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  navigationButton: {
    backgroundColor: '#1a365d',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  actions: {
    marginTop: 16,
    gap: 8,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  whatsappText: {
    color: '#25D366',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#1a365d',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  tabsContainer: {
    marginTop: 16,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#e2e8f0',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  activeTabText: {
    color: '#1a365d',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  timerContainer: {
    marginVertical: 8,
  },
  timerTrack: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#0891b2',
    borderRadius: 2,
  },
  timerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
});