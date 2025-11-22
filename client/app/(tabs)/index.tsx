import { useRouter } from 'expo-router';
import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { NeonButton } from '../../src/components/ui/NeonButton';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { useTheme } from '../../src/contexts/ThemeContext';
import { AuthState } from '../../src/features/auth/authSlice';
import { DataState, fetchData, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';

export default function HomeScreen() {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const { movies, music, podcasts, status, error } = useSelector((state: RootState) => state.data as DataState);
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
    }
  };

  const handleViewAll = (path: string) => {
    router.push(path as never);
  };

  const hasContent = useMemo(() => (movies.length + music.length + podcasts.length) > 0, [movies.length, music.length, podcasts.length]);
  const isRefreshing = status === 'loading' && hasContent;

  if (!user) {
    return null;
  }

  if (status === 'loading' && !hasContent) {
    return (
      <GradientBackground>
        <SafeAreaView style={[styles.container, styles.center]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  if (status === 'failed' && !hasContent) {
    return (
      <GradientBackground>
        <SafeAreaView style={[styles.container, styles.center]}>
          <Text style={[styles.errorTitle, { color: colors.text.primary }]}>Something went wrong</Text>
          <Text style={[styles.errorSubtitle, { color: colors.text.secondary }]}>
            {error ?? 'Unable to fetch the latest catalogue.'}
          </Text>
          <NeonButton title="Retry" onPress={() => dispatch(fetchData({ force: true }))} style={styles.retryButton} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => dispatch(fetchData({ force: true }))}
      tintColor={colors.primary}
      colors={[colors.primary]}
    />
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        {status === 'failed' && hasContent ? (
          <View style={styles.inlineError}>
            <Text style={[styles.inlineErrorText, { color: colors.text.secondary }]} numberOfLines={2}>
              {error ?? 'Refreshing catalogue failed.'}
            </Text>
            <Pressable onPress={() => dispatch(fetchData({ force: true }))}>
              <Text style={[styles.inlineErrorLink, { color: colors.primary }]}>Try again</Text>
            </Pressable>
          </View>
        ) : null}
        <ScrollView contentContainerStyle={styles.content} refreshControl={refreshControl}>
          
          {/* Movies Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Trending Movies</Text>
              <Pressable onPress={() => handleViewAll('/movie')}>
                <Text style={[styles.viewAll, { color: colors.secondary }]}>See All</Text>
              </Pressable>
            </View>
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
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Popular Music</Text>
              <Pressable onPress={() => handleViewAll('/music')}>
                <Text style={[styles.viewAll, { color: colors.secondary }]}>See All</Text>
              </Pressable>
            </View>
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
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.primary, textShadowColor: colors.primary }]}>Top Podcasts</Text>
              <Pressable onPress={() => handleViewAll('/podcast')}>
                <Text style={[styles.viewAll, { color: colors.secondary }]}>See All</Text>
              </Pressable>
            </View>
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
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 260,
  },
  retryButton: {
    width: 200,
  },
  section: {
    marginTop: 24,
  },
  inlineError: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  inlineErrorText: {
    fontSize: 13,
    marginBottom: 4,
  },
  inlineErrorLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
});