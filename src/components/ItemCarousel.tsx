import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { Item } from '../features/data/dataSlice';
import { addFavourite, removeFavourite } from '../features/favourites/favouritesSlice';
import { ItemCard } from './ItemCard';
import { useRouter } from 'expo-router';

interface ItemCarouselProps {
  title: string;
  items: Item[];
}

export const ItemCarousel = ({ title, items }: ItemCarouselProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: favourites } = useSelector((state: RootState) => state.favourites);

  const handleFavouriteToggle = (item: Item) => {
    const isFavourite = favourites.some(fav => fav.id === item.id);
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };
  
  const handlePress = (item: Item) => {
    // Navigate to the details page, passing the ID
    router.push(`/details/${item.id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
      >
        {items.map((item) => {
          const isFavourite = favourites.some(fav => fav.id === item.id);
          return (
            <ItemCard
              key={item.id}
              item={item}
              onPress={() => handlePress(item)}
              isFavourite={isFavourite}
              onFavouriteToggle={() => handleFavouriteToggle(item)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  scrollView: {
    paddingLeft: 8,
    paddingRight: 16,
  },
});