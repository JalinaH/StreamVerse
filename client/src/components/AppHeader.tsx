import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../contexts/ThemeContext';
import { AuthState } from '../features/auth/authSlice';
import { RootState } from '../state/store';
import { BrandLogo } from './BrandLogo';

export const AppHeader = () => {
  const user = useSelector((state: RootState) => (state.auth as AuthState).user);
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const avatar = user?.avatarUrl ||
    (user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.firstName} ${user.lastName}`)}&background=0f172a&color=ffffff` : undefined);

  return (
    <BlurView intensity={20} tint={isDarkMode ? 'dark' : 'light'} style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.brandSection}>
          <BrandLogo size={36} />
          <View>
            <Text style={[styles.greeting, { color: colors.text.secondary }]}>Welcome back,</Text>
            <Text style={[styles.title, { color: colors.text.primary, textShadowColor: colors.primary }]}>
              {user ? `${user.firstName} ${user.lastName}` : 'StreamVerse'}
            </Text>
          </View>
        </View>
        
        <View style={styles.rightContainer}>
          <Pressable onPress={toggleTheme} style={styles.themeButton}>
            <Feather name={isDarkMode ? 'sun' : 'moon'} size={24} color={colors.text.primary} />
          </Pressable>
          
          {avatar && (
            <View style={[styles.profileContainer, { borderColor: colors.primary }]}>
              <Image 
                source={{ uri: avatar }} 
                style={styles.profileImage} 
              />
            </View>
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  themeButton: {
    padding: 8,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
});