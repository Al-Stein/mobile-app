import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Save, Lock, CircleAlert as AlertCircle, Check } from 'lucide-react-native';
import { useState } from 'react';
import { useDriverStore } from '@/store/useDriverStore';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AccountSettingsScreen() {
  const { profile, updateProfile } = useDriverStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState(profile);

  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: success 
        ? withTiming('#15803d', { duration: 300 })
        : withTiming('#1a365d', { duration: 300 }),
      transform: [
        {
          scale: success 
            ? withSequence(
                withSpring(1.05),
                withSpring(1)
              )
            : 1
        }
      ]
    };
  });

  const handleSave = async () => {
    const { address, city, postalCode, vehicleModel, vehiclePlate } = formData;

    if (!address.trim() || !city.trim() || !postalCode.trim()) {
      Alert.alert(
        'Champs requis',
        'Tous les champs d\'adresse sont obligatoires.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (!vehicleModel.trim() || !vehiclePlate.trim()) {
      Alert.alert(
        'Champs requis',
        'Le modèle du véhicule et la plaque d\'immatriculation sont obligatoires.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      
      // Mise à jour du state global
      updateProfile({
        address: address.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        vehicleModel: vehicleModel.trim(),
        vehiclePlate: vehiclePlate.trim().toUpperCase(),
      });

      setSuccess(true);
      
      // Attendre que l'animation se termine avant de naviguer
      setTimeout(() => {
        Alert.alert(
          'Succès',
          'Vos informations ont été mises à jour avec succès.',
          [{ 
            text: 'OK',
            onPress: () => router.back()
          }]
        );
      }, 1000);

    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la mise à jour des informations.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Paramètres du compte</Text>
      </View>

      <View style={styles.infoBox}>
        <AlertCircle size={20} color="#1a365d" />
        <Text style={styles.infoText}>
          Certaines informations personnelles ne peuvent être modifiées que par le service client pour des raisons de sécurité.
          Contactez le support pour toute autre modification.
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Informations personnelles
            <Lock size={16} color="#64748b" style={styles.lockIcon} />
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.firstName}
              editable={false}
              placeholder="Prénom"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.lastName}
              editable={false}
              placeholder="Nom"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.email}
              editable={false}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.phone}
              editable={false}
              placeholder="Téléphone"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adresse *</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Rue</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Adresse"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
              placeholder="Ville"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.postalCode}
              onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
              placeholder="Code postal"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations professionnelles</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Numéro de licence VTC
              <Lock size={14} color="#64748b" style={styles.lockIcon} />
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.licenseNumber}
              editable={false}
              placeholder="Numéro de licence VTC"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modèle du véhicule *</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.vehicleModel}
              onChangeText={(text) => setFormData({ ...formData, vehicleModel: text })}
              placeholder="Modèle du véhicule"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plaque d'immatriculation *</Text>
            <TextInput
              style={[styles.input, styles.editableInput]}
              value={formData.vehiclePlate}
              onChangeText={(text) => setFormData({ ...formData, vehiclePlate: text.toUpperCase() })}
              placeholder="Plaque d'immatriculation"
              autoCapitalize="characters"
            />
          </View>
          <Text style={styles.requiredFieldsNote}>* Champs modifiables</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AnimatedTouchableOpacity 
          style={[
            styles.saveButton,
            buttonStyle,
            (loading || !formData.address.trim() || !formData.city.trim() || 
             !formData.postalCode.trim() || !formData.vehicleModel.trim() || 
             !formData.vehiclePlate.trim()) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={loading || !formData.address.trim() || !formData.city.trim() || 
                   !formData.postalCode.trim() || !formData.vehicleModel.trim() || 
                   !formData.vehiclePlate.trim()}>
          {success ? (
            <Check size={20} color="#fff" />
          ) : (
            <Save size={20} color="#fff" />
          )}
          <Text style={styles.saveButtonText}>
            {loading ? 'Enregistrement...' : success ? 'Modifications enregistrées' : 'Enregistrer les modifications'}
          </Text>
        </AnimatedTouchableOpacity>
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1a365d',
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a365d',
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  editableInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  requiredFieldsNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});