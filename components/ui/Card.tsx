import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { RADIUS, SPACING, SHADOWS } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  noPadding?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, noPadding, elevated }) => {
  const { colors } = useTheme();

  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.borderLight,
    },
    elevated && SHADOWS.lg,
    !elevated && SHADOWS.sm,
    noPadding && { padding: 0 },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
  },
});
