import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { useTheme } from '../../src/contexts/ThemeContext';
import { DataState, fetchData, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';

export default function PodcastListScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors } = useTheme();
  const { podcasts, status } = useSelector((state: RootState) => state.data as DataState);
  const favourites = useSelector((state: RootState) => (state.favourites as FavouritesState).items);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  const handlePress = (item: Item) => {
    router.push({ pathname: '/podcast/[id]', params: { id: item.id } } as never);
  };

  const handleFavouriteToggle = (item: Item) => {
    const isFavourite = favourites.some((fav) => fav.id === item.id);
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.cardWrapper}>
      <ItemCard
        item={item}
        onPress={() => handlePress(item)}
        isFavourite={favourites.some((fav) => fav.id === item.id)}
        onFavouriteToggle={() => handleFavouriteToggle(item)}
      />
    </View>
  );

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        {status === 'loading' && podcasts.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading podcasts...</Text>
          </View>
        ) : (
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            renderItem={renderItem}
            ListHeaderComponent={<Text style={styles.title}>Top Podcasts</Text>}
            ListEmptyComponent={<Text style={styles.emptyText}>No podcasts available.</Text>}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  cardWrapper: {
    flex: 1 / 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#94a3b8',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    marginTop: 32,
  },
});
