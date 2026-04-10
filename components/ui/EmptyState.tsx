import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primaryLight }]}>{icon}</View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.desc, { color: colors.textSecondary }]}>{description}</Text>
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} variant="secondary" size="sm" style={{ marginTop: SPACING.lg }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: SPACING['4xl'] },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  title: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.sm, textAlign: 'center' },
  desc: { fontSize: FONT_SIZE.md, textAlign: 'center', lineHeight: 22 },
});
