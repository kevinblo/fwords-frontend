import {useState} from 'react';
import i18n from '@/i18n';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {useAuth} from '@/context/AuthContext';
import {UserPlus} from 'lucide-react-native';
import {ErrorMessage} from '@/components/ui/ErrorMessage';
import styles from '@/assets/styles/registerScreen.styles'

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  const { signUp, isLoading } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(i18n.t('register.error.empty'));
      return;
    }

    if (password !== confirmPassword) {
      setError(i18n.t('register.error.password_mismatch'));
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      setError(i18n.t('register.error.password_to_short'));
    }

    try {
      setError(null);
      const result = await signUp(name, email, password, confirmPassword);
      setRegistrationResult(result);
      // Переход на страницу логина с сообщением об успешной регистрации
      router.replace({
        pathname: '/auth/login',
        params: {successMessage: i18n.t('register.success_email_sent')}
      });
    } catch (err) {
// Извлекаем только текст ошибки из err.message (поддержка JSON с произвольным ключом)
      let errorMessage = i18n.t('register.error.failed');
      if (err && typeof err === 'object') {
        if ('message' in err && typeof err.message === 'string') {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed && typeof parsed === 'object') {
              const firstKey = Object.keys(parsed)[0];
              const messages = parsed[firstKey];
              if (Array.isArray(messages) && messages.length > 0) {
                errorMessage = `${firstKey}: ${messages[0]}`;
              } else if (typeof messages === 'string') {
                errorMessage = `${firstKey}: ${messages[0]}`;
              }
            }
          } catch {
            errorMessage = err.message;
          }
        }
      }
      setError(errorMessage);
      console.error('Registration error:', err);
    }
  };

  return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Foreign Word</Text>
          <Text style={styles.tagline}>{i18n.t('register.subtitle')}</Text>
        </View>

        <View style={styles.formContainer}>
          {error && <ErrorMessage message={error} />}

          {registrationResult && (
              <View style={[styles.inputContainer, {backgroundColor: '#e8f5e8', padding: 15, borderRadius: 8}]}>
                <Text style={[styles.label, {color: '#2d5a2d'}]}>Результат регистрации:</Text>
                <Text style={{fontSize: 12, color: '#2d5a2d', fontFamily: 'monospace'}}>
                  {JSON.stringify(registrationResult, null, 2)}
                </Text>
              </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{i18n.t('register.name.label')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('register.name.placeholder')}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{i18n.t('register.email.label')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('register.email.placeholder')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{i18n.t('register.password.label')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('register.password.placeholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{i18n.t('register.confirm_password.label')}</Text>
            <TextInput
              style={styles.input}
              placeholder={i18n.t('register.confirm_password.placeholder')}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
                <Text style={styles.buttonText}>{i18n.t('register.loading')}</Text>
            ) : (
              <>
                <UserPlus size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>{i18n.t('register.create_account')}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>
              {i18n.t('register.already_account')} <Text style={styles.loginTextBold}>{i18n.t('register.signin')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
