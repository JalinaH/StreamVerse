import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { NeonButton } from '../../src/components/ui/NeonButton';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();

  const item = useSelector((state: RootState) => {
    const { movies } = state.data;
    return movies.find((i) => i.id === id);
  });

  const isFavourite = useSelector((state: RootState) =>
    (state.favourites as FavouritesState).items.some((i) => i.id === id),
  );

  const handleFavouriteToggle = () => {
    if (!item) return;
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  // Fallback if item not found
  const displayItem: Item = item || {
    id: id as string,
    title: 'Unknown Movie',
    description: 'This movie could not be found.',
    image: 'https://via.placeholder.com/400',
    status: 'Unknown',
    type: 'movie',
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: displayItem.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.gradientOverlay}
          />
          
          <Pressable style={[styles.backButton, { backgroundColor: colors.glass.background }]} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={colors.text.primary} />
          </Pressable>

          <Pressable style={[styles.favButton, { backgroundColor: colors.glass.background }]} onPress={handleFavouriteToggle}>
            <Feather 
              name="heart" 
              size={24} 
              color={isFavourite ? colors.status.error : colors.text.primary} 
              style={isFavourite ? styles.favActive : undefined}
            />
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary, textShadowColor: colors.primary }]}>{displayItem.title}</Text>
          
          <View style={styles.statusContainer}>
            <GlassView style={styles.statusBadge}>
              <Text style={[styles.statusText, { color: colors.secondary }]}>{displayItem.status}</Text>
            </GlassView>
          </View>

          <GlassView style={styles.descriptionCard}>
            <Text style={[styles.sectionTitle, { color: colors.text.accent }]}>Overview</Text>
            <Text style={[styles.description, { color: colors.text.secondary }]}>{displayItem.description}</Text>
          </GlassView>

          <View style={styles.actions}>
            <NeonButton 
              title="Watch Now" 
              onPress={() => {}} 
              style={styles.actionButton}
            />
            <NeonButton 
              title="Share" 
              variant="secondary"
              onPress={() => {}} 
              style={styles.actionButton}
            />
          </View>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 400,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  favButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  favActive: {
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  content: {
    padding: 20,
    marginTop: -40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  descriptionCard: {
    padding: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: 16,
  },
  actionButton: {
    width: '100%',
  },
});
