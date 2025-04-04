import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { LogIn, Mail, Lock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const [email, setEmail] = useState('john.doe@example.com'); // Pre-filled for testing
  const [password, setPassword] = useState('123456789'); // Pre-filled for testing
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    // Reset error state
    setError('');

    // Basic validation
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Format d\'email invalide');
      return;
    }

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await login(email.trim(), password);
      router.replace('/(app)/(tabs)');
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue. Veuillez réessayer');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LogIn size={48} color="#1a365d" />
          </View>
          <Text style={styles.title}>ShuttlePro</Text>
          <Text style={styles.subtitle}>Portail Chauffeur</Text>
        </View>

        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle size={20} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, error && email.length === 0 && styles.inputError]}>
              <Mail size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Votre adresse email"
                value={email}
                onChangeText={(text) => {
                  setError('');
                  setEmail(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#94a3b8"
                editable={!isLoading}
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={[styles.inputContainer, error && password.length === 0 && styles.inputError]}>
              <Lock size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                value={password}
                onChangeText={(text) => {
                  setError('');
                  setPassword(text);
                }}
                secureTextEntry
                placeholderTextColor="#94a3b8"
                editable={!isLoading}
                autoComplete="password"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.forgotPassword}
            disabled={isLoading}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.button,
              (!email.trim() || !password.trim() || isLoading) && styles.buttonDisabled
            ]} 
            onPress={handleLogin}
            disabled={!email.trim() || !password.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogIn size={20} color="#fff" />
                <Text style={styles.buttonText}>Se connecter</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} ShuttlePro. Tous droits réservés.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1a365d',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#64748b',
    marginTop: 8,
  },
  form: {
    gap: 16,
    marginTop: 48,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: '#dc2626',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1a365d',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    height: 56,
  },
  inputError: {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1a365d',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#1a365d',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    height: 56,
    backgroundColor: '#1a365d',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});