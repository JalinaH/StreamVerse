import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/app/store';
import { AppHeader } from '../../src/components/AppHeader';
import { ItemCard } from '../../src/components/ItemCard';
import { Item } from '../../src/features/data/dataSlice';
import { FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';

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
      <SafeAreaView style={styles.container}>
        <AppHeader />
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No Favourites Yet</Text>
          <Text style={styles.emptySubText}>Tap the heart on any item to save it here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  listContainer: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  cardWrapper: {
    flex: 1 / 2,
    alignItems: 'center',
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#4b5563',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
});