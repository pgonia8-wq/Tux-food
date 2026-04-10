import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.lg, fontSize: FONT_SIZE.sm },
    md: { paddingVertical: SPACING.md + 2, paddingHorizontal: SPACING.xl, fontSize: FONT_SIZE.md },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING['2xl'], fontSize: FONT_SIZE.lg },
  };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && { width: '100%' }, style]}
      >
        <LinearGradient
          colors={isDisabled ? [colors.textTertiary, colors.textTertiary] : [colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.base,
            { paddingVertical: sizeStyles[size].paddingVertical, paddingHorizontal: sizeStyles[size].paddingHorizontal },
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <>
              {icon && <>{icon}</>}
              <Text style={[styles.text, { fontSize: sizeStyles[size].fontSize }, icon && { marginLeft: SPACING.sm }, textStyle]}>
                {title}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<string, { bg: string; border: string; textColor: string }> = {
    secondary: { bg: colors.primaryLight, border: 'transparent', textColor: colors.primary },
    outline: { bg: 'transparent', border: colors.border, textColor: colors.text },
    ghost: { bg: 'transparent', border: 'transparent', textColor: colors.primary },
    danger: { bg: colors.errorLight, border: 'transparent', textColor: colors.error },
  };

  const vs = variantStyles[variant] || variantStyles.outline;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        {
          backgroundColor: vs.bg,
          borderColor: vs.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          paddingVertical: sizeStyles[size].paddingVertical,
          paddingHorizontal: sizeStyles[size].paddingHorizontal,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vs.textColor} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              { color: vs.textColor, fontSize: sizeStyles[size].fontSize },
              icon && { marginLeft: SPACING.sm },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.lg,
    minHeight: 44,
  },
  text: {
    fontWeight: FONT_WEIGHT.semibold,
    color: '#FFFFFF',
  },
});
