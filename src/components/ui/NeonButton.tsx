import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
}

export const NeonButton = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  style,
  disabled = false
}: NeonButtonProps) => {
  const { colors } = useTheme();
  const gradientColors = variant === 'primary' ? colors.primaryGradient : colors.secondaryGradient;
  const shadowColor = variant === 'primary' ? colors.primary : colors.secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.container,
        {
          shadowColor: shadowColor,
          opacity: (disabled || loading) ? 0.7 : (pressed ? 0.9 : 1),
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
        style
      ]}
    >
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
