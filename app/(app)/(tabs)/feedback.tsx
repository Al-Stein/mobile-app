import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Star, ThumbsUp, ThumbsDown, Filter } from 'lucide-react-native';

type FeedbackType = 'all' | 'positive' | 'negative';

type Feedback = {
  id: string;
  bookingRef: string;
  rating: number;
  comment: string;
  date: string;
  clientName: string;
  clientAvatar: string;
  isPositive: boolean;
};

const feedbackData: Feedback[] = [
  {
    id: '1',
    bookingRef: 'BK-2024-001',
    rating: 5,
    comment: "Excellent service ! Le chauffeur était très professionnel et ponctuel. J'apprécie particulièrement son attention aux détails.",
    date: '2024-02-15',
    clientName: 'Sophie Martin',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&q=80',
    isPositive: true,
  },
  {
    id: '2',
    bookingRef: 'BK-2024-002',
    rating: 2,
    comment: "Le trajet était un peu chaotique et le chauffeur semblait pressé.",
    date: '2024-02-14',
    clientName: 'Pierre Dubois',
    clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&q=80',
    isPositive: false,
  },
  {
    id: '3',
    bookingRef: 'BK-2024-003',
    rating: 5,
    comment: "Service impeccable, voiture très propre et chauffeur courtois.",
    date: '2024-02-13',
    clientName: 'Marie Lambert',
    clientAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&q=80',
    isPositive: true,
  },
  {
    id: '4',
    bookingRef: 'BK-2024-004',
    rating: 4,
    comment: "Très bon service dans l'ensemble. Le chauffeur connaissait bien son itinéraire.",
    date: '2024-02-12',
    clientName: 'Lucas Bernard',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&q=80',
    isPositive: true,
  },
  {
    id: '5',
    bookingRef: 'BK-2024-005',
    rating: 1,
    comment: "Retard important et peu de communication.",
    date: '2024-02-11',
    clientName: 'Emma Petit',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&q=80',
    isPositive: false,
  },
];

export default function FeedbackScreen() {
  const [selectedType, setSelectedType] = useState<FeedbackType>('all');

  const filteredFeedback = feedbackData.filter(feedback => {
    if (selectedType === 'all') return true;
    return selectedType === 'positive' ? feedback.isPositive : !feedback.isPositive;
  });

  const averageRating = feedbackData.reduce((acc, curr) => acc + curr.rating, 0) / feedbackData.length;
  const positiveCount = feedbackData.filter(f => f.isPositive).length;
  const negativeCount = feedbackData.filter(f => !f.isPositive).length;

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={index < rating ? '#eab308' : '#e2e8f0'}
        fill={index < rating ? '#eab308' : 'none'}
      />
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Avis Clients</Text>
        <Text style={styles.subtitle}>Vos retours clients</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{averageRating.toFixed(1)}</Text>
          <View style={styles.starsContainer}>
            {renderStars(Math.round(averageRating))}
          </View>
          <Text style={styles.statLabel}>Note moyenne</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <ThumbsUp size={20} color="#15803d" />
            <Text style={[styles.statValue, { color: '#15803d' }]}>{positiveCount}</Text>
          </View>
          <Text style={styles.statLabel}>Avis positifs</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statRow}>
            <ThumbsDown size={20} color="#dc2626" />
            <Text style={[styles.statValue, { color: '#dc2626' }]}>{negativeCount}</Text>
          </View>
          <Text style={styles.statLabel}>Avis négatifs</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <Filter size={20} color="#1a365d" />
          <Text style={styles.filterTitle}>Filtrer les avis</Text>
        </View>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedType('all')}>
            <Text style={[styles.filterButtonText, selectedType === 'all' && styles.filterButtonTextActive]}>
              Tous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'positive' && styles.filterButtonActive]}
            onPress={() => setSelectedType('positive')}>
            <Text style={[styles.filterButtonText, selectedType === 'positive' && styles.filterButtonTextActive]}>
              Positifs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedType === 'negative' && styles.filterButtonActive]}
            onPress={() => setSelectedType('negative')}>
            <Text style={[styles.filterButtonText, selectedType === 'negative' && styles.filterButtonTextActive]}>
              Négatifs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.feedbackList}>
        {filteredFeedback.map((feedback) => (
          <View key={feedback.id} style={styles.feedbackCard}>
            <View style={styles.feedbackHeader}>
              <View style={styles.clientInfo}>
                <Image source={{ uri: feedback.clientAvatar }} style={styles.clientAvatar} />
                <View>
                  <Text style={styles.clientName}>{feedback.clientName}</Text>
                  <Text style={styles.bookingRef}>Réf: {feedback.bookingRef}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {renderStars(feedback.rating)}
              </View>
            </View>
            <Text style={styles.comment}>{feedback.comment}</Text>
            <Text style={styles.date}>
              {new Date(feedback.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        ))}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
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
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  filterContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#1a365d',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  feedbackList: {
    padding: 16,
    paddingTop: 0,
  },
  feedbackCard: {
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
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  bookingRef: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  comment: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4a5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
});