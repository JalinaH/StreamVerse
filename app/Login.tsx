import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { GlassView } from '../src/components/ui/GlassView';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { NeonButton } from '../src/components/ui/NeonButton';
import { useTheme } from '../src/contexts/ThemeContext';
import { AuthState, loginUser } from '../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../src/state/store';

export default function LoginScreen() {
  const [username, setUsername] = useState('kminchelle');
  const [password, setPassword] = useState('0lelplR');
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
    if (status === 'failed' && error) {
      Alert.alert('Login Failed', error);
    }
  }, [status, error]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <GlassView style={styles.card}>
          <Text style={[styles.title, { color: colors.text.primary, textShadowColor: colors.primary }]}>
            Welcome to StreamVerse
          </Text>
          
          <Text style={[styles.label, { color: colors.text.secondary }]}>Username</Text>
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
            value={username}
            onChangeText={setUsername}
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
          
          {(error || validationError) ? (
            <Text style={[styles.errorText, { color: colors.status.error }]}>{error || validationError}</Text>
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
});