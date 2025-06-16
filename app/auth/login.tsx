import { useState } from 'react';
import i18n from '@/i18n';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LogIn } from 'lucide-react-native';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import styles from '@/assets/styles/loginScreen.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const params = useLocalSearchParams();
  const successMessage = typeof params.successMessage === 'string' ? params.successMessage : undefined;

  const { signIn, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(i18n.t('login.error.empty'));
      return;
    }
    
    try {
      setError(null);
      await signIn(email, password);
      // @ts-ignore
      router.replace('/(tabs)/');
    } catch (err) {
      setError(i18n.t('login.error.invalid'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Foreign Words</Text>
        <Text style={styles.tagline}>{i18n.t('login.subtitle')}</Text>
      </View>

      <View style={styles.formContainer}>
        {successMessage && (
          <View style={{ backgroundColor: '#e8f5e8', padding: 12, borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ color: '#2d5a2d', textAlign: 'center' }}>{successMessage}</Text>
          </View>
        )}
        {error && <ErrorMessage message={error} />}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{i18n.t('login.email.label')}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t('login.email.placeholder')}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{i18n.t('login.password.label')}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t('login.password.placeholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.buttonText}>Loading...</Text>
          ) : (
            <>
              <LogIn size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>{i18n.t('login.signin')}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.registerText}>
            {i18n.t('login.no_account')} <Text style={styles.registerTextBold}>{i18n.t('login.signup')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

