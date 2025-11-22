import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Item } from '../features/data/dataSlice';
import { GlassView } from './ui/GlassView';

interface ItemCardProps {
  item: Item;
  onPress: () => void;
  onFavouriteToggle: () => void;
  isFavourite: boolean;
}

export const ItemCard = ({ item, onPress, onFavouriteToggle, isFavourite }: ItemCardProps) => {
  const { colors } = useTheme();
  const [hasImageError, setHasImageError] = useState(!item.image);
  const showFallback = hasImageError || !item.image;

  return (
    <GlassView style={styles.card}>
      <Pressable
        onPress={onPress}
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} details`}
      >
        {showFallback ? (
          <View style={[styles.fallback, { backgroundColor: colors.glass.background }]}
          >
            <Feather name="image" size={24} color={colors.text.secondary} />
            <Text style={[styles.fallbackText, { color: colors.text.secondary }]}>Artwork unavailable</Text>
          </View>
        ) : (
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            onError={() => setHasImageError(true)}
            accessibilityIgnoresInvertColors
          />
        )}
        <Pressable
          onPress={onFavouriteToggle}
          style={styles.favouriteButton}
          accessibilityRole="button"
          accessibilityLabel={isFavourite ? `Remove ${item.title} from favourites` : `Save ${item.title} to favourites`}
        >
          <GlassView style={styles.iconButton}>
            <Feather 
              name="heart" 
              size={16} 
              color={isFavourite ? colors.status.error : colors.text.primary} 
              style={isFavourite ? styles.favActive : undefined}
            />
          </GlassView>
        </Pressable>
        <View style={styles.infoBox}>
          <Text style={[styles.title, { color: colors.text.primary }]} numberOfLines={1}>{item.title}</Text>
          <Text style={[styles.status, { color: colors.secondary }]} numberOfLines={1}>{item.status}</Text>
        </View>
      </Pressable>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  pressable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  fallback: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fallbackText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  favouriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 0,
  },
  favActive: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  infoBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  status: {
    fontSize: 10,
    textTransform: 'uppercase',
    marginTop: 4,
    fontWeight: 'bold',
  },
});