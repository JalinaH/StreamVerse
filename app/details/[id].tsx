import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { DataState, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';

export default function DetailsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Find the item from the Redux store using its ID
  const item = useSelector<RootState, Item | undefined>((state) => {
    if (!id) return undefined;
    const { movies, music, podcasts } = state.data as DataState;
    return [...movies, ...music, ...podcasts].find((entry) => entry.id === id);
  });
  
  const favourites = useSelector(
    (state: RootState) => (state.favourites as FavouritesState).items,
  );
  const isFavourite = favourites.some((fav: Item) => fav.id === id);

  const handleFavouriteToggle = () => {
    if (!item) return;
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Item not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-down" size={28} color="white" />
          </Pressable>
          <Pressable onPress={handleFavouriteToggle} style={styles.favouriteButton}>
            <Feather 
              name="heart" 
              size={24} 
              color={isFavourite ? '#ef4444' : '#ffffff'} 
              fill={isFavourite ? '#ef4444' : 'none'}
            />
          </Pressable>
        </View>
        <View style={styles.content}>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    width: '100%',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 50, // Adjust for status bar
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
  favouriteButton: {
    position: 'absolute',
    top: 50, // Adjust for status bar
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  content: {
    padding: 20,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 8,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
});