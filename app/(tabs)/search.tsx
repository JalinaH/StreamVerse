import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { AppHeader } from '../../src/components/AppHeader';

const genres = ['Action', 'Comedy', 'Pop', 'True Crime', 'Sci-Fi', 'Hip-Hop', 'Documentary', 'Rock'];

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBox}>
          <Feather name="search" size={20} color="#6b7280" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search movies, music, or podcasts..."
          />
        </View>
        <Text style={styles.note}>Search functionality is for demonstration.</Text>

        <Text style={styles.subTitle}>Browse by Genre</Text>
        <View style={styles.genreContainer}>
          {genres.map(genre => (
            <Pressable key={genre} style={styles.genreButton}>
              <Text style={styles.genreText}>{genre}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 12,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genreButton: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  genreText: {
    fontSize: 14,
    fontWeight: '500',
  },
});