import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { GlassView } from '../src/components/ui/GlassView';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { NeonButton } from '../src/components/ui/NeonButton';
import { useTheme } from '../src/contexts/ThemeContext';
import { AuthState, loginUser, registerUser } from '../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../src/state/store';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const { status, error, user } = useSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (user) {
      router.replace({ pathname: '/(tabs)' } as never);
    }
  }, [router, user]);

  const validate = () => {
    if (mode === 'login') {
      if (!identifier || !password) {
        setValidationError('Username/Email and password are required.');
        return false;
      }
      setValidationError('');
      return true;
    }

    if (!firstName || !lastName || !email || !identifier || !password) {
      setValidationError('All fields except avatar are required.');
      return false;
    }

    setValidationError('');
    return true;
  };
  
  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    if (mode === 'login') {
      dispatch(loginUser({ identifier, password }));
      return;
    }

    dispatch(
      registerUser({
        firstName,
        lastName,
        email,
        username: identifier,
        password,
        avatarUrl: avatarUrl || undefined,
      })
    );
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setValidationError('');
  };

  useEffect(() => {
    if (status === 'failed' && error) {
      Alert.alert(mode === 'login' ? 'Login Failed' : 'Registration Failed', error);
    }
  }, [status, error, mode]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassView style={styles.card}>
          <Text style={[styles.title, { color: colors.text.primary, textShadowColor: colors.primary }]}>
            {mode === 'login' ? 'Welcome to StreamVerse' : 'Create your account'}
          </Text>

          {mode === 'register' && (
            <>
              <Text style={[styles.label, { color: colors.text.secondary }]}>First Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={firstName}
                onChangeText={setFirstName}
                placeholderTextColor={colors.text.secondary}
              />

              <Text style={[styles.label, { color: colors.text.secondary }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={lastName}
                onChangeText={setLastName}
                placeholderTextColor={colors.text.secondary}
              />

              <Text style={[styles.label, { color: colors.text.secondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.text.secondary}
              />
            </>
          )}

          <Text style={[styles.label, { color: colors.text.secondary }]}>Username {mode === 'login' ? 'or Email' : ''}</Text>
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            placeholderTextColor={colors.text.secondary}
          />

          <Text style={[styles.label, { color: colors.text.secondary }]}>Password</Text>
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.text.secondary}
          />

          {mode === 'register' && (
            <>
              <Text style={[styles.label, { color: colors.text.secondary }]}>Avatar URL (optional)</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                autoCapitalize="none"
                placeholder="https://..."
                placeholderTextColor={colors.text.secondary}
              />
            </>
          )}
          
          {(error || validationError) ? (
            <Text style={[styles.errorText, { color: colors.status.error }]}>{error || validationError}</Text>
          ) : null}
          
          <NeonButton 
            title={mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'} 
            onPress={handleSubmit} 
            loading={status === 'loading'}
            style={styles.button}
          />

          <Text style={[styles.switchText, { color: colors.text.secondary }]}
            onPress={toggleMode}
          >
            {mode === 'login' ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
          </Text>
        </GlassView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 32,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    marginTop: 10,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});