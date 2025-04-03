import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, Shield, Lock, Eye, Smartphone, Bell, Key, X, Globe } from 'lucide-react-native';
import { useState } from 'react';
import { useDriverStore } from '@/store/useDriverStore';

export default function PrivacyScreen() {
  const { privacySettings, updatePrivacySettings, language, updateLanguage } = useDriverStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const t = (fr: string, en: string) => language === 'fr' ? fr : en;

  const handleChangePassword = () => {
    setError('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(true);
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleSubmitPassword = () => {
    setError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError(t(
        'Tous les champs sont obligatoires',
        'All fields are required'
      ));
      return;
    }

    if (!validatePassword(passwordForm.newPassword)) {
      setError(t(
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
      ));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t(
        'Les mots de passe ne correspondent pas',
        'Passwords do not match'
      ));
      return;
    }

    // Simuler une vérification du mot de passe actuel
    if (passwordForm.currentPassword !== 'Password123!') {
      setError(t(
        'Mot de passe actuel incorrect',
        'Current password is incorrect'
      ));
      return;
    }

    // Simuler le changement de mot de passe
    Alert.alert(
      t('Succès', 'Success'),
      t(
        'Votre mot de passe a été modifié avec succès',
        'Your password has been successfully changed'
      ),
      [
        {
          text: 'OK',
          onPress: () => {
            setShowPasswordModal(false);
            setPasswordForm({
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            });
          },
        },
      ]
    );
  };

  const handle2FA = () => {
    Alert.alert(
      t('Authentification à deux facteurs', 'Two-Factor Authentication'),
      t(
        'Voulez-vous activer l\'authentification à deux facteurs ?',
        'Do you want to enable two-factor authentication?'
      ),
      [
        {
          text: t('Annuler', 'Cancel'),
          style: 'cancel',
        },
        {
          text: t('Activer', 'Enable'),
          onPress: () => {
            Alert.alert(
              t('Configuration 2FA', '2FA Setup'),
              t(
                'Un SMS avec un code de vérification va vous être envoyé.',
                'An SMS with a verification code will be sent to you.'
              ),
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('Suppression de compte', 'Account Deletion'),
      t(
        'Pour des raisons de sécurité, la suppression de compte doit être effectuée par notre service client. Veuillez contacter le support pour procéder à la suppression de votre compte.',
        'For security reasons, account deletion must be performed by our customer service. Please contact support to proceed with the deletion of your account.'
      ),
      [
        {
          text: t('Annuler', 'Cancel'),
          style: 'cancel'
        },
        {
          text: t('Contacter le support', 'Contact Support'),
          onPress: () => {
            Alert.alert(
              t('Service Client', 'Customer Service'),
              t(
                'Service client disponible 24/7\n\nTél: 01 23 45 67 89\nEmail: support@shuttlepro.com',
                'Customer service available 24/7\n\nPhone: 01 23 45 67 89\nEmail: support@shuttlepro.com'
              ),
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const toggleSetting = (key: keyof typeof privacySettings) => {
    updatePrivacySettings({ [key]: !privacySettings[key] });
    
    Alert.alert(
      t('Paramètre mis à jour', 'Setting Updated'),
      t(
        `Le paramètre a été ${privacySettings[key] ? 'désactivé' : 'activé'} avec succès.`,
        `The setting has been successfully ${privacySettings[key] ? 'disabled' : 'enabled'}.`
      ),
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ChevronLeft size={24} color="#1a365d" />
          <Text style={styles.backText}>{t('Retour', 'Back')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('Confidentialité & Sécurité', 'Privacy & Security')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.section, styles.languageSectionContainer]}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#1a365d" />
            <Text style={styles.sectionTitle}>
              {t('Langue', 'Language')}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.languageSelector}
            onPress={() => updateLanguage(language === 'fr' ? 'en' : 'fr')}>
            <Text style={styles.languageText}>
              {language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
            </Text>
            <Text style={styles.languageChange}>
              {t('Changer pour', 'Change to')} {language === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#1a365d" />
            <Text style={styles.sectionTitle}>
              {t('Paramètres de confidentialité', 'Privacy Settings')}
            </Text>
          </View>

          <View style={styles.optionsList}>
            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Smartphone size={20} color="#64748b" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>
                    {t('Suivi de localisation', 'Location Tracking')}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t(
                      'Autoriser le suivi de position pendant les missions',
                      'Allow location tracking during missions'
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.locationTracking}
                onValueChange={() => toggleSetting('locationTracking')}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={privacySettings.locationTracking ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.optionItem}>
              <View style={styles.optionInfo}>
                <Eye size={20} color="#64748b" />
                <View style={styles.optionTextContainer}>
                  <Text style={styles.optionTitle}>
                    {t('Partage des données', 'Data Sharing')}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {t(
                      'Autoriser le partage des statistiques anonymes',
                      'Allow sharing of anonymous statistics'
                    )}
                  </Text>
                </View>
              </View>
              <Switch
                value={privacySettings.dataSharing}
                onValueChange={() => toggleSetting('dataSharing')}
                trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
                thumbColor={privacySettings.dataSharing ? '#fff' : '#fff'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Lock size={20} color="#1a365d" />
            <Text style={styles.sectionTitle}>
              {t('Sécurité du compte', 'Account Security')}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handleChangePassword}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>
                {t('Changer le mot de passe', 'Change Password')}
              </Text>
              <Text style={styles.menuItemDescription}>
                {t(
                  'Modifier votre mot de passe actuel',
                  'Change your current password'
                )}
              </Text>
            </View>
            <Key size={20} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={handle2FA}>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>
                {t('Authentification à deux facteurs', 'Two-Factor Authentication')}
              </Text>
              <Text style={styles.menuItemDescription}>
                {t(
                  'Ajouter une couche de sécurité supplémentaire',
                  'Add an extra layer of security'
                )}
              </Text>
            </View>
            <Shield size={20} color="#64748b" />
          </TouchableOpacity>

          <View style={styles.optionItem}>
            <View style={styles.optionInfo}>
              <Bell size={20} color="#64748b" />
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>
                  {t('Connexion biométrique', 'Biometric Login')}
                </Text>
                <Text style={styles.optionDescription}>
                  {t(
                    'Se connecter avec empreinte digitale',
                    'Login with fingerprint'
                  )}
                </Text>
              </View>
            </View>
            <Switch
              value={privacySettings.biometricLogin}
              onValueChange={() => toggleSetting('biometricLogin')}
              trackColor={{ false: '#e2e8f0', true: '#0d9488' }}
              thumbColor={privacySettings.biometricLogin ? '#fff' : '#fff'}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={styles.dangerButton}
          onPress={handleDeleteAccount}>
          <Text style={styles.dangerButtonText}>
            {t('Demander la suppression du compte', 'Request Account Deletion')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {t('Changer le mot de passe', 'Change Password')}
              </Text>
              <TouchableOpacity 
                onPress={() => setShowPasswordModal(false)}
                style={styles.closeButton}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('Mot de passe actuel', 'Current Password')}
              </Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={passwordForm.currentPassword}
                  onChangeText={(text) => {
                    setError('');
                    setPasswordForm({ ...passwordForm, currentPassword: text });
                  }}
                  secureTextEntry={!showCurrentPassword}
                  placeholder={t(
                    'Entrez votre mot de passe actuel',
                    'Enter your current password'
                  )}
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={styles.eyeButton}>
                  <Eye size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('Nouveau mot de passe', 'New Password')}
              </Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={passwordForm.newPassword}
                  onChangeText={(text) => {
                    setError('');
                    setPasswordForm({ ...passwordForm, newPassword: text });
                  }}
                  secureTextEntry={!showNewPassword}
                  placeholder={t(
                    'Entrez votre nouveau mot de passe',
                    'Enter your new password'
                  )}
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeButton}>
                  <Eye size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('Confirmer le nouveau mot de passe', 'Confirm New Password')}
              </Text>
              <View style={styles.passwordInput}>
                <TextInput
                  style={styles.input}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => {
                    setError('');
                    setPasswordForm({ ...passwordForm, confirmPassword: text });
                  }}
                  secureTextEntry={!showConfirmPassword}
                  placeholder={t(
                    'Confirmez votre nouveau mot de passe',
                    'Confirm your new password'
                  )}
                  placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}>
                  <Eye size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.passwordRequirements}>
              {t(
                'Le mot de passe doit contenir au moins :',
                'Password must contain at least:'
              )}
              {'\n'}- {t('8 caractères', '8 characters')}
              {'\n'}- {t('Une majuscule', 'One uppercase letter')}
              {'\n'}- {t('Une minuscule', 'One lowercase letter')}
              {'\n'}- {t('Un chiffre', 'One number')}
              {'\n'}- {t('Un caractère spécial', 'One special character')}
            </Text>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) && 
                styles.submitButtonDisabled
              ]}
              onPress={handleSubmitPassword}
              disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}>
              <Text style={styles.submitButtonText}>
                {t('Changer le mot de passe', 'Change Password')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  languageSectionContainer: {
    marginBottom: 20,
  },
  languageSelector: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginTop: 12,
  },
  languageText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
    marginBottom: 4,
  },
  languageChange: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
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
    paddingVertical: 12,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuItemContent: {
    flex: 1,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
  },
  menuItemDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginTop: 2,
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  dangerButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1a365d',
  },
  closeButton: {
    padding: 4,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginBottom: 8,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a365d',
  },
  eyeButton: {
    padding: 12,
  },
  passwordRequirements: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#1a365d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});