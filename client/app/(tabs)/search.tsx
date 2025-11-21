import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../src/components/AppHeader';
import { GlassView } from '../../src/components/ui/GlassView';
import { GradientBackground } from '../../src/components/ui/GradientBackground';
import { colors } from '../../src/theme/colors';

const genres = ['Action', 'Comedy', 'Pop', 'True Crime', 'Sci-Fi', 'Hip-Hop', 'Documentary', 'Rock'];

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container} edges={['top']}>
        <AppHeader />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Search</Text>
          <GlassView style={styles.searchBox}>
            <Feather name="search" size={20} color={colors.text.secondary} style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search movies, music, or podcasts..."
              placeholderTextColor={colors.text.secondary}
            />
          </GlassView>
          <Text style={styles.note}>Search functionality is for demonstration.</Text>

          <Text style={styles.subTitle}>Browse by Genre</Text>
          <View style={styles.genreContainer}>
            {genres.map(genre => (
              <GlassView key={genre} style={styles.genreButton}>
                <Text style={styles.genreText}>{genre}</Text>
              </GlassView>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
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
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
});