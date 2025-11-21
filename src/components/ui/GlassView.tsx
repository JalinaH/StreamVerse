import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

interface GlassViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export function GlassView({ children, style, intensity = 20 }: GlassViewProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.glass.background,
    borderColor: colors.glass.border,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  content: {
    zIndex: 1,
  },
});
