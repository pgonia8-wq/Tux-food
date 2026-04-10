import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, bgColor, size = 'md', icon }) => {
  const bg = bgColor || color + '18';

  return (
    <View style={[styles.badge, { backgroundColor: bg }, size === 'sm' && styles.sm]}>
      {icon && <View style={{ marginRight: SPACING.xs }}>{icon}</View>}
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSm]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  textSm: {
    fontSize: FONT_SIZE.xs,
  },
});
