import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { BrandLogo } from '../src/components/BrandLogo';
import { GlassView } from '../src/components/ui/GlassView';
import { GradientBackground } from '../src/components/ui/GradientBackground';
import { NeonButton } from '../src/components/ui/NeonButton';
import { useTheme } from '../src/contexts/ThemeContext';
import { AuthState, loginUser, registerUser } from '../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../src/state/store';
import { FormErrors, validateLoginForm, validateRegisterForm } from '../src/utils/validation';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useTheme();
  
  const { status, error, user } = useSelector(
    (state: RootState) => state.auth as AuthState,
  );
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace({ pathname: '/(tabs)' } as never);
    }
  }, [router, user]);

  const activeFields = mode === 'login'
    ? ['identifier', 'password']
    : ['firstName', 'lastName', 'email', 'identifier', 'password'];

  const formErrors = useMemo<FormErrors>(() => {
    if (mode === 'login') {
      return validateLoginForm({ identifier, password });
    }
    return validateRegisterForm({ firstName, lastName, email, identifier, password });
  }, [mode, identifier, password, firstName, lastName, email]);

  const isFormValid = useMemo(() => Object.keys(formErrors).length === 0, [formErrors]);

  const markFieldsTouched = useCallback((fields: string[]) => {
    setTouchedFields((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  }, []);

  const handleInputBlur = useCallback((field: string) => () => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  }, []);

  const shouldShowError = useCallback(
    (field: string) => (hasSubmitted || touchedFields[field]) && Boolean(formErrors[field]),
    [formErrors, hasSubmitted, touchedFields],
  );

  const getErrorMessage = (field: string) => (shouldShowError(field) ? formErrors[field] : '');

  const handleSubmit = () => {
    setHasSubmitted(true);
    markFieldsTouched(activeFields);

    if (!isFormValid) {
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
      })
    );
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setTouchedFields({});
    setHasSubmitted(false);
  };

  useEffect(() => {
    if (status === 'failed' && error) {
      Alert.alert(mode === 'login' ? 'Login Failed' : 'Registration Failed', error);
    }
  }, [status, error, mode]);

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <GlassView style={styles.card}>
              <View style={styles.logoContainer}>
                <BrandLogo size={96} showTitle titleSize={24} />
              </View>
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
                placeholder="First name"
                placeholderTextColor={colors.text.secondary}
                onBlur={handleInputBlur('firstName')}
                returnKeyType="next"
                autoComplete="given-name"
              />
              {getErrorMessage('firstName') ? (
                <Text style={[styles.fieldError, { color: colors.status.error }]}>{getErrorMessage('firstName')}</Text>
              ) : null}

              <Text style={[styles.label, { color: colors.text.secondary }]}>Last Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor={colors.text.secondary}
                onBlur={handleInputBlur('lastName')}
                returnKeyType="next"
                autoComplete="family-name"
              />
              {getErrorMessage('lastName') ? (
                <Text style={[styles.fieldError, { color: colors.status.error }]}>{getErrorMessage('lastName')}</Text>
              ) : null}

              <Text style={[styles.label, { color: colors.text.secondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Email address"
                placeholderTextColor={colors.text.secondary}
                onBlur={handleInputBlur('email')}
                returnKeyType="next"
                autoComplete="email"
              />
              {getErrorMessage('email') ? (
                <Text style={[styles.fieldError, { color: colors.status.error }]}>{getErrorMessage('email')}</Text>
              ) : null}
            </>
          )}

          <Text style={[styles.label, { color: colors.text.secondary }]}>Username {mode === 'login' ? 'or Email' : ''}</Text>
          <TextInput
            style={[styles.input, { color: colors.text.primary, borderColor: colors.glass.border, backgroundColor: 'rgba(255,255,255,0.05)' }]}
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
            placeholder={mode === 'login' ? 'Username or email' : 'Preferred username'}
            placeholderTextColor={colors.text.secondary}
            onBlur={handleInputBlur('identifier')}
            returnKeyType="next"
            autoComplete={mode === 'login' ? 'username' : 'username-new'}
          />
          {getErrorMessage('identifier') ? (
            <Text style={[styles.fieldError, { color: colors.status.error }]}>{getErrorMessage('identifier')}</Text>
          ) : null}

          <Text style={[styles.label, { color: colors.text.secondary }]}>Password</Text>
          {mode === 'register' ? (
            <Text style={[styles.passwordHint, { color: colors.text.secondary }]}>Use at least 8 characters with letters and numbers.</Text>
          ) : null}
          <View style={[styles.passwordRow, { borderColor: colors.glass.border }]}
          >
            <TextInput
              style={[styles.passwordInput, { color: colors.text.primary }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              placeholder="Password"
              placeholderTextColor={colors.text.secondary}
              onBlur={handleInputBlur('password')}
              autoCapitalize="none"
              autoComplete={mode === 'login' ? 'password' : 'password-new'}
              returnKeyType="done"
            />
            <Pressable
              onPress={() => setIsPasswordVisible((prev) => !prev)}
              hitSlop={12}
            >
              <Feather
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={20}
                color={colors.text.secondary}
              />
            </Pressable>
          </View>
          {getErrorMessage('password') ? (
            <Text style={[styles.fieldError, { color: colors.status.error }]}>{getErrorMessage('password')}</Text>
          ) : null}

          
          {error ? (
            <Text style={[styles.errorText, { color: colors.status.error }]}>{error}</Text>
          ) : null}
          
          <NeonButton 
            title={mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'} 
            onPress={handleSubmit} 
            loading={status === 'loading'}
            style={styles.button}
            disabled={!isFormValid}
          />

          <Text style={[styles.switchText, { color: colors.text.secondary }]}
            onPress={toggleMode}
          >
            {mode === 'login' ? 'Need an account? Register here.' : 'Already have an account? Log in.'}
          </Text>
            </GlassView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingVertical: 0,
    marginRight: 12,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 14,
  },
  fieldError: {
    marginTop: -12,
    marginBottom: 16,
    fontSize: 12,
  },
  passwordHint: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.8,
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