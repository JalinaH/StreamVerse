import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/app/store';
import { fetchData } from '../../src/features/data/dataSlice'; // You'll need to create this file
import { useRouter, Link } from 'expo-router';
import { useNavigationState } from '@react-navigation/native';

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
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  // const { movies, music, podcasts, status, error } = useSelector((state: RootState) => state.data);
  const router = useRouter();

  // Redirect to login if not authenticated
  // We check the root router state to see if the user is on the '(tabs)' route
  const rootState = useNavigationState(state => state);
  
  useEffect(() => {
    if (rootState) { // Only check once navigation is ready
      const isUserOnAuthRoutes = rootState.routes.some(r => r.name === 'login');
      if (!user && !isUserOnAuthRoutes) {
        router.push('/login');
      }
    }
  }, [user, rootState, router]);

  // Fetch data
  // useEffect(() => {
  //   if (status === 'idle') {
  //     dispatch(fetchData());
  //   }
  // }, [status, dispatch]);

  // if (status === 'loading') {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <AppHeader />
  //       <ActivityIndicator size="large" style={{ flex: 1 }} />
  //     </SafeAreaView>
  //   );
  // }

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
        <Link href="/details/movie-1" asChild>
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