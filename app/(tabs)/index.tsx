import { Link, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/app/store';
import type { AuthState } from '../../src/features/auth/authSlice';

// You will need to create the other slices (dataSlice, favouritesSlice)
// and components (ItemCard, AppHeader) in their own .tsx files
// and convert them to use React Native components.

// This is a placeholder for your AppHeader
const AppHeader = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>MediaMeld</Text>
    {/* Dark mode toggle would go here */}
  </View>
);

// A placeholder for your ItemCarousel
const ItemCarouselPlaceholder = ({ title }: { title: string }) => (
  <View style={styles.carouselContainer}>
    <Text style={styles.carouselTitle}>{title}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {/* You would map over your items and render <ItemCard> here */}
      <View style={styles.itemCardPlaceholder}>
        <Text style={{color: 'white'}}>Item 1</Text>
      </View>
      <View style={styles.itemCardPlaceholder}>
        <Text style={{color: 'white'}}>Item 2</Text>
      </View>
      <View style={styles.itemCardPlaceholder}>
        <Text style={{color: 'white'}}>Item 3</Text>
      </View>
    </ScrollView>
  </View>
);


export default function HomeScreen() {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const router = useRouter();

  // Redirect to login when unauthenticated
  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/login' } as never);
    }
  }, [router, user]);



  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView>
        {/*
          This is where you would put your real components.
          I've used placeholders to keep this file simple.
        */}
        <ItemCarouselPlaceholder title="Trending Movies" />
        <ItemCarouselPlaceholder title="Popular Music" />
        <ItemCarouselPlaceholder title="Top Podcasts" />
        
        {/* Example of navigating to a details page */}
        <Link
          href={{
            pathname: '/details/[id]',
            params: { id: 'movie-1' },
          } as never}
          asChild
        >
           <Pressable style={styles.detailsButton}>
            <Text style={{color: 'white'}}>Test Details Page (movie-1)</Text>
           </Pressable>
        </Link>
        
      </ScrollView>
    </SafeAreaView>
  );
}

// This is the React Native version of Tailwind
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Corresponds to gray-100
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366f1',
  },
  carouselContainer: {
    marginVertical: 12,
  },
  carouselTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  itemCardPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    alignItems: 'center',
  }
});