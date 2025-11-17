import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Item } from '../features/data/dataSlice';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onFavouriteToggle: () => void;
  isFavourite: boolean;
}

export const ItemCard = ({ item, onPress, onFavouriteToggle, isFavourite }: ItemCardProps) => {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </Pressable>
      <TouchableOpacity onPress={onFavouriteToggle} style={styles.favouriteButton}>
        <Feather 
          name="heart" 
          size={20} 
          color={isFavourite ? '#ef4444' : '#ffffff'} 
          fill={isFavourite ? '#ef4444' : 'none'}
        />
      </TouchableOpacity>
      <View style={styles.infoBox}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.status} numberOfLines={1}>{item.status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 15,
  },
  infoBox: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  status: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    marginTop: 4,
  },
});