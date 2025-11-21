import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { useTheme } from '../../src/contexts/ThemeContext';
import { AuthState } from '../../src/features/auth/authSlice';
import { DataState, fetchData, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';

export default function HomeScreen() {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const { movies, music, podcasts, status } = useSelector((state: RootState) => state.data as DataState);
  const favourites = useSelector((state: RootState) => (state.favourites as FavouritesState).items);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    if (!user) {
      router.replace({ pathname: '/login' } as never);
    } else {
      if (status === 'idle') {
        dispatch(fetchData());
      }
    }
  }, [user, router, status, dispatch]);

  const isFavourite = (id: string) => favourites.some((item) => item.id === id);

  const handleFavouriteToggle = (item: Item) => {
    if (isFavourite(item.id)) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  const handleItemPress = (id: string) => {
    if (id.startsWith('movie-')) {
      router.push({ pathname: '/movie/[id]', params: { id } });
    } else if (id.startsWith('music-')) {
      router.push({ pathname: '/music/[id]', params: { id } });
    } else if (id.startsWith('podcast-')) {
      router.push({ pathname: '/podcast/[id]', params: { id } });
    } else {
      // Fallback
      router.push({ pathname: '/details/[id]', params: { id } });
    }
  };

  if (!user) {
    return null;
  }

  if (status === 'loading') {
    return (
      <GradientBackground>
        <SafeAreaView style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* Movies Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Trending Movies</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {movies.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onPress={() => handleItemPress(item.id)}
                  onFavouriteToggle={() => handleFavouriteToggle(item)}
                  isFavourite={isFavourite(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Music Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Popular Music</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {music.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onPress={() => handleItemPress(item.id)}
                  onFavouriteToggle={() => handleFavouriteToggle(item)}
                  isFavourite={isFavourite(item.id)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Podcasts Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Top Podcasts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {podcasts.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onPress={() => handleItemPress(item.id)}
                  onFavouriteToggle={() => handleFavouriteToggle(item)}
                  isFavourite={isFavourite(item.id)}
                />
              ))}
            </ScrollView>
          </View>

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
});