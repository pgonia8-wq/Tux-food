import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  large?: boolean;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({ title, subtitle, rightElement, large }) => {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, large && styles.titleLarge]}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightElement && <View>{rightElement}</View>}
      </View>
    </LinearGradient>
  );
};

const TOP_INSET = Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 24) + 10;

const styles = StyleSheet.create({
  container: {
    paddingTop: TOP_INSET,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
  titleLarge: {
    fontSize: FONT_SIZE['3xl'],
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: SPACING.xs,
  },
});
