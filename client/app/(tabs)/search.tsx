import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AppHeader } from '../../src/components/AppHeader';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { ItemCard } from '../../src/components/ItemCard';
import { useTheme } from '../../src/contexts/ThemeContext';
import { DataState, fetchData, Item } from '../../src/features/data/dataSlice';
import { addFavourite, FavouritesState, removeFavourite } from '../../src/features/favourites/favouritesSlice';
import { AppDispatch, RootState } from '../../src/state/store';
import { colors } from '../../src/theme/colors';

const fallbackGenres = ['Action', 'Comedy', 'Pop', 'True Crime', 'Sci-Fi', 'Hip-Hop', 'Documentary', 'Rock'];

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isGenreModalVisible, setGenreModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { catalogue, status } = useSelector((state: RootState) => state.data as DataState);
  const favourites = useSelector((state: RootState) => (state.favourites as FavouritesState).items);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchData());
    }
  }, [dispatch, status]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
    },
    [],
  );

  const handleGenrePress = useCallback((genre: string) => {
    setSelectedGenre((prev) => (prev === genre ? null : genre));
    setGenreModalVisible(false);
  }, []);

  const availableGenres = useMemo(() => {
    if (!catalogue.length) return fallbackGenres;
    const unique = new Set<string>();
    catalogue.forEach((item) => item.genres?.forEach((genre) => unique.add(genre)));
    return unique.size ? Array.from(unique).sort() : fallbackGenres;
  }, [catalogue]);

  const filteredResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return catalogue.filter((item) => {
      const matchesQuery = query
        ? [item.title, item.description, item.status]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query))
        : true;
      const matchesGenre = selectedGenre
        ? Boolean(item.genres?.some((genre) => genre.toLowerCase() === selectedGenre.toLowerCase()))
        : true;
      return matchesQuery && matchesGenre;
    });
  }, [catalogue, searchTerm, selectedGenre]);

  const shouldShowResults = searchTerm.trim().length > 0 || Boolean(selectedGenre);

  const handleCardPress = (item: Item) => {
    const pathMap: Record<Item['type'], string> = {
      movie: '/movie/[id]',
      music: '/music/[id]',
      podcast: '/podcast/[id]',
    };
    router.push({ pathname: pathMap[item.type], params: { id: item.id } } as never);
  };

  const handleFavouriteToggle = (item: Item) => {
    const isFavourite = favourites.some((fav) => fav.id === item.id);
    if (isFavourite) {
      dispatch(removeFavourite({ id: item.id }));
    } else {
      dispatch(addFavourite(item));
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Search</Text>
          <GlassView style={styles.searchBox}>
            <Feather name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={searchTerm}
              onChangeText={handleSearchChange}
              placeholder="Search movies, music, or podcasts..."
              placeholderTextColor={colors.text.secondary}
            />
          </GlassView>
          <Text style={styles.note}>Search or pick a genre to filter across movies, music, and podcasts.</Text>

          <Pressable onPress={() => setGenreModalVisible(true)} style={styles.filterControl}>
            <GlassView style={styles.filterButton}>
              <Feather name="sliders" size={18} color={colors.text.primary} style={styles.filterIcon} />
              <Text style={styles.filterLabel}>{selectedGenre ? `Genre: ${selectedGenre}` : 'Filter by genre'}</Text>
            </GlassView>
          </Pressable>

          {status === 'loading' && catalogue.length === 0 ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color={themeColors.primary} />
              <Text style={styles.note}>Fetching catalogue...</Text>
            </View>
          ) : null}

          {selectedGenre ? <Text style={styles.activeFilter}>Showing {selectedGenre} highlights</Text> : null}

          {shouldShowResults ? (
            filteredResults.length > 0 ? (
              <View style={styles.resultsGrid}>
                {filteredResults.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <ItemCard
                      item={item}
                      onPress={() => handleCardPress(item)}
                      isFavourite={favourites.some((fav) => fav.id === item.id)}
                      onFavouriteToggle={() => handleFavouriteToggle(item)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyCopy}>
                No results match
                {searchTerm.trim().length ? ` “${searchTerm}”` : ''}
                {selectedGenre ? ` in ${selectedGenre}` : ''}.
              </Text>
            )
          ) : (
            <Text style={styles.emptyCopy}>Pick a genre or start typing to explore the catalogue.</Text>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent
        visible={isGenreModalVisible}
        onRequestClose={() => setGenreModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setGenreModalVisible(false)} />
          <GlassView style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Browse by Genre</Text>
              <Pressable onPress={() => setGenreModalVisible(false)} style={styles.modalClose}>
                <Feather name="x" size={20} color={colors.text.secondary} />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.genreContainer} showsVerticalScrollIndicator={false}>
              {availableGenres.map((genre) => {
                const isActive = selectedGenre === genre;
                return (
                  <Pressable
                    key={genre}
                    onPress={() => handleGenrePress(genre)}
                    style={({ pressed }) => [styles.genrePressable, pressed && styles.genrePressed]}
                  >
                    <GlassView style={[styles.genreButton, isActive && styles.genreButtonActive]}>
                      <Text style={[styles.genreText, isActive && styles.genreTextActive]}>{genre}</Text>
                    </GlassView>
                  </Pressable>
                );
              })}
            </ScrollView>
          </GlassView>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  note: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingState: {
    alignItems: 'center',
    marginTop: 32,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.accent,
    marginTop: 32,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genrePressable: {
    borderRadius: 20,
  },
  genrePressed: {
    opacity: 0.85,
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  genreButtonActive: {
    borderColor: colors.primary,
    borderWidth: 1,
    shadowColor: colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  genreTextActive: {
    color: colors.primary,
  },
  activeFilter: {
    marginTop: 16,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  filterControl: {
    marginTop: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterLabel: {
    color: colors.text.primary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: '70%',
    padding: 24,
    borderRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  modalClose: {
    padding: 4,
  },
  emptyCopy: {
    marginTop: 24,
    textAlign: 'center',
    color: colors.text.secondary,
  },
});