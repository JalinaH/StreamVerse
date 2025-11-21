import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { useTheme } from '../../src/contexts/ThemeContext';
import { AuthState } from '../../src/features/auth/authSlice';
import { RootState } from '../../src/state/store';

export default function HomeScreen() {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/login' } as never);
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Trending Now</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {[1, 2, 3].map((item) => (
                <GlassView key={item} style={styles.placeholderCard}>
                  <View style={[styles.placeholderImage, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                  <Text style={[styles.placeholderText, { color: colors.text.primary }]}>Item {item}</Text>
                  <Text style={[styles.placeholderSubtext, { color: colors.text.secondary }]}>Description</Text>
                </GlassView>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Recommended for You</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {[4, 5, 6].map((item) => (
                <GlassView key={item} style={styles.placeholderCard}>
                  <View style={[styles.placeholderImage, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
                  <Text style={[styles.placeholderText, { color: colors.text.primary }]}>Item {item}</Text>
                  <Text style={[styles.placeholderSubtext, { color: colors.text.secondary }]}>Description</Text>
                </GlassView>
              ))}
            </ScrollView>
          </View>

          <Link href={{ pathname: '/details/[id]', params: { id: '1' } }} asChild>
            <Pressable style={[styles.testButton, { borderColor: colors.primary }]}>
              <Text style={[styles.testButtonText, { color: colors.primary }]}>Test Details Page</Text>
            </Pressable>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  placeholderCard: {
    width: 160,
    height: 200,
    marginRight: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  placeholderSubtext: {
    fontSize: 12,
  },
  testButton: {
    margin: 20,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontWeight: 'bold',
  },
});