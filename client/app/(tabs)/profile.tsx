import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { NeonButton } from '../../src/components/ui/NeonButton';
import type { AuthState } from '../../src/features/auth/authSlice';
import { logout } from '../../src/features/auth/authSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);

  if (!user) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.content}>
            <Text style={{ color: 'white' }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <GlassView style={styles.profileCard}>
            <Image
              source={{
                uri:
                  user.avatarUrl ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=0f172a&color=ffffff`,
              }}
              style={styles.profileImage}
            />
            <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </GlassView>
          
          <NeonButton
            title="LOGOUT"
            onPress={() => dispatch(logout())}
            variant="secondary"
            style={styles.logoutButton}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  profileCard: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.text.accent,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});