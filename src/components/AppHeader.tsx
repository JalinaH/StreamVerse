import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { Feather } from '@expo/vector-icons';
// import { useTheme } from '../contexts/ThemeContext'; // You would uncomment this

export const AppHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  // const { isDarkMode, toggleTheme } = useTheme(); // For dark mode

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>MediaMeld</Text>
      <View style={styles.rightContainer}>
        {/* <TouchableOpacity onPress={toggleTheme} style={styles.iconButton}>
          <Feather name={isDarkMode ? 'sun' : 'moon'} size={22} color="#4b5563" />
        </TouchableOpacity> */}
        
        {user && (
          <View style={styles.profileContainer}>
            <Text style={styles.profileName}>{user.firstName}</Text>
            <Image source={{ uri: user.image }} style={styles.profileImage} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6366f1', // Indigo
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginRight: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});