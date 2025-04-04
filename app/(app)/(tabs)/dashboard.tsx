import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Euro, TrendingUp, Calendar, Star, Route } from 'lucide-react-native';

const dailyOptionsData = [
  { revenue: 85, details: [
    { name: 'Siège bébé', count: 2, revenue: 40 },
    { name: 'Attente', count: 3, revenue: 45 }
  ]},
  { revenue: 120, details: [
    { name: 'Siège bébé', count: 3, revenue: 60 },
    { name: 'Attente', count: 4, revenue: 60 }
  ]},
  { revenue: 65, details: [
    { name: 'Siège bébé', count: 2, revenue: 40 },
    { name: 'Attente', count: 1, revenue: 25 }
  ]},
  { revenue: 95, details: [
    { name: 'Siège bébé', count: 1, revenue: 20 },
    { name: 'Attente', count: 5, revenue: 75 }
  ]},
  { revenue: 150, details: [
    { name: 'Siège bébé', count: 4, revenue: 80 },
    { name: 'Attente', count: 4, revenue: 70 }
  ]},
  { revenue: 55, details: [
    { name: 'Siège bébé', count: 1, revenue: 20 },
    { name: 'Attente', count: 2, revenue: 35 }
  ]},
  { revenue: 40, details: [
    { name: 'Siège bébé', count: 2, revenue: 40 }
  ]},
];

const stats = {
  rating: 4.92,
  totalTrips: 1234,
};

export default function DashboardScreen() {
  const maxRevenue = Math.max(...dailyOptionsData.map(d => d.revenue));
  const totalRevenue = dailyOptionsData.reduce((sum, day) => sum + day.revenue, 0);
  const currentDate = new Date();
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance</Text>
        <Text style={styles.subtitle}>
          {formatDate(weekStart)} - {formatDate(weekEnd)}
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Star size={24} color="#1a365d" />
          </View>
          <Text style={styles.statsValue}>{stats.rating}</Text>
          <Text style={styles.statsLabel}>Note de qualité</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsIcon}>
            <Route size={24} color="#1a365d" />
          </View>
          <Text style={styles.statsValue}>{stats.totalTrips}</Text>
          <Text style={styles.statsLabel}>Trajets réalisés</Text>
        </View>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalHeader}>
          <Euro size={24} color="#1a365d" />
          <Text style={styles.totalTitle}>Total des commissions</Text>
        </View>
        <Text style={styles.totalAmount}>{totalRevenue}€</Text>
        <Text style={styles.totalPeriod}>Cette semaine</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Détail Journalier</Text>
            <View style={styles.dateRange}>
              <Calendar size={16} color="#64748b" />
              <Text style={styles.dateRangeText}>Cette semaine</Text>
            </View>
          </View>
          <TrendingUp size={20} color="#1a365d" />
        </View>

        <View style={styles.chart}>
          {dailyOptionsData.map((data, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: (data.revenue / maxRevenue) * 150,
                      backgroundColor: '#0d9488',
                    }
                  ]} 
                />
              </View>
              <Text style={styles.barRevenue}>{data.revenue}€</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
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
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  statsLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },
  totalCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  totalTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  totalAmount: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#0d9488',
  },
  totalPeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  dateRange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  dateRangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
    paddingTop: 16,
  },
  barContainer: {
    alignItems: 'center',
    width: '13%',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 150,
  },
  bar: {
    width: 12,
    backgroundColor: '#0d9488',
    borderRadius: 6,
  },
  barRevenue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0d9488',
    marginTop: 12,
  },
});