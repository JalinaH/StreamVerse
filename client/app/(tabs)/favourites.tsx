import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { Item } from '../../src/features/data/dataSlice';
import { AuthState } from '../../src/features/auth/authSlice';
import { addFavourite, fetchFavourites, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function FavouritesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: favourites, status, error } = useSelector(
    (state: RootState) => state.favourites as FavouritesState,
  );
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);

  useEffect(() => {
    if (user && status === 'idle') {
      dispatch(fetchFavourites());
    }
  }, [dispatch, user, status]);

  const handleFavouriteToggle = (item: Item) => {
    const isFavourite = favourites.some((fav) => fav.id === item.id);
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  const handlePress = (item: Item) => {
    const pathMap: Record<Item['type'], string> = {
      movie: '/movie/[id]',
      music: '/music/[id]',
      podcast: '/podcast/[id]',
    };

    router.push({
      pathname: pathMap[item.type],
      params: { id: item.id },
    } as never);
  };

  const sections = useMemo(
    () => [
      { key: 'movie', title: 'Movies', data: favourites.filter((fav) => fav.type === 'movie') },
      { key: 'music', title: 'Music', data: favourites.filter((fav) => fav.type === 'music') },
      { key: 'podcast', title: 'Podcasts', data: favourites.filter((fav) => fav.type === 'podcast') },
    ].filter((section) => section.data.length > 0),
    [favourites]
  );

  if (!user) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyText}>Sign in to see favourites</Text>
            <Text style={styles.emptySubText}>Log in to sync your saved movies, music, and podcasts.</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (status === 'loading' && favourites.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, styles.loadingText]}>Loading favourites...</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (sections.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No favourites yet</Text>
            <Text style={styles.emptySubText}>Tap the heart on any item to save it here.</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <ScrollView contentContainerStyle={styles.sectionsContainer}>
          <Text style={styles.title}>My Favourites</Text>
          {sections.map((section) => (
            <View key={section.key} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.grid}>
                {section.data.map((item) => (
                  <View style={styles.cardWrapper} key={item.id}>
                    <ItemCard
                      item={item}
                      onPress={() => handlePress(item)}
                      isFavourite
                      onFavouriteToggle={() => handleFavouriteToggle(item)}
                    />
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    paddingHorizontal: 8,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardWrapper: {
    flex: 1 / 2,
    alignItems: 'center',
    padding: 8,
  },
  sectionsContainer: {
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginTop: 8,
  },
  loadingText: {
    marginTop: 16,
  },
  errorText: {
    color: colors.status.error,
    textAlign: 'center',
    marginBottom: 8,
  },
});