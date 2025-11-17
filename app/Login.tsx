import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AuthState } from '../src/features/auth/authSlice';
import { loginUser } from '../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../src/state/store';

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
    // If login is successful, close the modal
    if (user) {
      router.back();
    }
  }, [user, router]);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to MediaMeld</Text>
        
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {(error || validationError) && (
          <Text style={styles.errorText}>{error || validationError}</Text>
        )}

        <Pressable
          style={styles.button}
          onPress={handleSubmit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1f2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});