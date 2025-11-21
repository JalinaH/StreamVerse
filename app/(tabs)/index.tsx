import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import type { AuthState } from '../../src/features/auth/authSlice';
import { RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

const AppHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>StreamVerse</Text>
  </View>
);

const ItemCarouselPlaceholder = ({ title }: { title: string }) => (
  <View style={styles.carouselContainer}>
    <Text style={styles.carouselTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
      {[1, 2, 3].map((i) => (
        <GlassView key={i} style={styles.itemCardPlaceholder}>
          <Text style={styles.cardText}>Item {i}</Text>
        </GlassView>
      ))}
    </ScrollView>
  </View>
);

export default function HomeScreen() {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/login' } as never);
    }
  }, [router, user]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ItemCarouselPlaceholder title="Trending Movies" />
          <ItemCarouselPlaceholder title="Popular Music" />
          <ItemCarouselPlaceholder title="Top Podcasts" />
          
          <Link
            href={{
              pathname: '/details/[id]',
              params: { id: 'movie-1' },
            } as never}
            asChild
          >
             <Pressable style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Test Details Page (movie-1)</Text>
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
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  carouselContainer: {
    marginVertical: 16,
  },
  carouselContent: {
    paddingHorizontal: 16,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.accent,
    marginBottom: 12,
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
  itemCardPlaceholder: {
    width: 160,
    height: 200,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  detailsButton: {
    margin: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  detailsButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});