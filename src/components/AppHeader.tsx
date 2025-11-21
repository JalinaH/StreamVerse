import { BlurView } from 'expo-blur';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { colors } from '../theme/colors';

export const AppHeader = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <View style={styles.container}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>StreamVerse</Text>
        <View style={styles.rightContainer}>
          {user && (
            <View style={styles.profileContainer}>
              <Text style={styles.profileName}>{user.firstName}</Text>
              <Image source={{ uri: user.image }} style={styles.profileImage} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: colors.glass.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginRight: 8,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});