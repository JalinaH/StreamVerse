import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { Item } from '../features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../features/favourites/favouritesSlice';
import { ItemCard } from './ItemCard';

interface ItemCarouselProps {
  title: string;
  items: Item[];
}

export const ItemCarousel = ({ title, items }: ItemCarouselProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const favourites = useSelector(
    (state: RootState) => (state.favourites as FavouritesState).items,
  );

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
    router.push({
      pathname: '/details/[id]',
      params: { id: item.id },
    } as never);
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