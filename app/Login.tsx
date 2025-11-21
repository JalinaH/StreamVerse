import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { GlassView } from '../src/components/ui/GlassView';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { NeonButton } from '../src/components/ui/NeonButton';
import type { AuthState } from '../src/features/auth/authSlice';
import { loginUser } from '../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../src/state/store';
import { colors } from '../src/theme/colors';

export default function LoginScreen() {
  const [username, setUsername] = useState('kminchelle'); // Default for easy testing
  const [password, setPassword] = useState('0lelplR'); // Default for easy testing
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { status, error, user } = useSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    // Replace the login route with the tab stack once authenticated
    if (user) {
      router.replace({ pathname: '/(tabs)' } as never);
    }
  }, [router, user]);

  const validate = () => {
    if (!username || !password) {
      setValidationError('Username and Password are required.');
      return false;
    }
    setValidationError('');
    return true;
  };
  
  const handleSubmit = () => {
    if (validate()) {
      dispatch(loginUser({ username, password }));
    }
  };

  useEffect(() => {
    // Show API error in an Alert
    if (status === 'failed' && error) {
      Alert.alert('Login Failed', error);
    }
  }, [status, error]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassView style={styles.card}>
          <Text style={styles.title}>StreamVerse</Text>
          <Text style={styles.subtitle}>Enter the Metaverse</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholder="Enter username"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter password"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
          
          {(error || validationError) ? (
            <Text style={styles.errorText}>{error || validationError}</Text>
          ) : null}

          <NeonButton
            title="LOGIN"
            onPress={handleSubmit}
            loading={status === 'loading'}
            style={styles.button}
          />
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
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.text.primary,
    marginBottom: 8,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.text.accent,
    marginBottom: 40,
    letterSpacing: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderColor: colors.glass.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text.primary,
  },
  errorText: {
    color: colors.status.error,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
  },
});