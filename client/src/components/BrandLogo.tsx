import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const logo = require('../../assets/logo.png');

interface BrandLogoProps {
  size?: number;
  showTitle?: boolean;
  titleSize?: number;
}

export const BrandLogo = ({ size = 72, showTitle = false, titleSize = 20 }: BrandLogoProps) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={logo} style={[styles.image, { width: size, height: size }]} resizeMode="contain" />
      {showTitle ? (
        <Text style={[styles.title, { fontSize: titleSize, color: colors.text.primary }]}>
          StreamVerse
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    marginBottom: 8,
  },
  title: {
    fontWeight: '700',
    letterSpacing: 1,
  },
});
