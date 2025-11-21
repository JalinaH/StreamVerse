import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export const GlassView = ({ children, style, intensity = 20 }: GlassViewProps) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.glass.background,
        borderColor: colors.glass.border,
      }, 
      style
    ]}>
      <BlurView intensity={intensity} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
  },
});
