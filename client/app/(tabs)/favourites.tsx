import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { Item } from '../../src/features/data/dataSlice';
import { FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

export default function FavouritesScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const favourites = useSelector(
    (state: RootState) => (state.favourites as FavouritesState).items,
  );

  const handleFavouriteToggle = (item: Item) => {
    dispatch(removeFavourite({ id: item.id }));
  };

  const handlePress = (item: Item) => {
    router.push({
      pathname: '/details/[id]',
      params: { id: item.id },
    } as never);
  };

  if (favourites.length === 0) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.container} edges={['top']}>
          <AppHeader />
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No Favourites Yet</Text>
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
        <FlatList
          data={favourites}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={<Text style={styles.title}>My Favourites</Text>}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ItemCard
                item={item}
                onPress={() => handlePress(item)}
                isFavourite={true} // It's always a favourite on this screen
                onFavouriteToggle={() => handleFavouriteToggle(item)}
              />
            </View>
          )}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 8,
    paddingBottom: 100,
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
});