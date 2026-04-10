import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, RADIUS } from '../../constants/theme';
import { getInitials } from '../../lib/utils';

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
  bgColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 44, bgColor }) => {
  const { colors } = useTheme();
  const bg = bgColor || colors.primaryLight;

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.initials, { color: colors.primary, fontSize: size * 0.36 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: FONT_WEIGHT.bold,
  },
});
