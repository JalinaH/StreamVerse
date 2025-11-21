import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { DataState, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

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
    // Fallback for testing if no item found (since we are using placeholders)
    const mockItem = {
        id: 'movie-1',
        title: 'Test Movie',
        description: 'This is a test movie description to show the UI layout.',
        image: 'https://via.placeholder.com/400',
        status: 'Trending'
    };
    
    // Use mock item if real item not found for demo purposes
    // In real app, show error or loading
  }

  // Using a mock item for now if undefined, to ensure UI renders for the test button
  const displayItem = item || {
    id: 'movie-1',
    title: 'Cyberpunk Edgerunners',
    description: 'In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become a mercenary outlaw — an edgerunner.',
    image: 'https://images.unsplash.com/photo-1535498730771-e735b998cd64?q=80&w=600&auto=format&fit=crop',
    status: 'Trending Now'
  };

  return (
    <GradientBackground>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: displayItem.image }} style={styles.image} />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.gradientOverlay}
          />
          
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <GlassView style={styles.iconButton}>
              <Feather name="chevron-down" size={28} color="white" />
            </GlassView>
          </Pressable>
          
          <Pressable onPress={handleFavouriteToggle} style={styles.favouriteButton}>
            <GlassView style={styles.iconButton}>
              <Feather 
                name="heart" 
                size={24} 
                color={isFavourite ? colors.status.error : 'white'} 
                fill={isFavourite ? colors.status.error : 'none'}
              />
            </GlassView>
          </Pressable>
        </View>

        <View style={styles.content}>
          <Text style={styles.status}>{displayItem.status}</Text>
          <Text style={styles.title}>{displayItem.title}</Text>
          
          <GlassView style={styles.descriptionCard}>
            <Text style={styles.description}>{displayItem.description}</Text>
          </GlassView>
          
          <View style={styles.actions}>
             <GlassView style={styles.actionButton}>
                <Feather name="play" size={24} color={colors.primary} />
                <Text style={styles.actionText}>Play Now</Text>
             </GlassView>
             <GlassView style={styles.actionButton}>
                <Feather name="share-2" size={24} color="white" />
                <Text style={styles.actionText}>Share</Text>
             </GlassView>
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
  contentContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 450,
    width: '100%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  favouriteButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 0,
  },
  content: {
    padding: 24,
    marginTop: -60,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: colors.secondary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 24,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  descriptionCard: {
    padding: 20,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});