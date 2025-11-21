import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export const GlassView = ({ children, style, intensity = 20 }: GlassViewProps) => {
  const { colors, isDarkMode } = useTheme();

  const shouldUseBlur = Platform.OS !== 'android';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.glass.background,
          borderColor: colors.glass.border,
        },
        style,
      ]}
    >
      {shouldUseBlur ? (
        <BlurView
          intensity={intensity}
          tint={isDarkMode ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDarkMode ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.6)',
            },
          ]}
        />
      )}
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
