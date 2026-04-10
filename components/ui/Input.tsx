import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, leftIcon, rightIcon, secureTextEntry, style, ...props }) => {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : focused ? colors.inputFocusBorder : colors.inputBorder,
            borderWidth: focused ? 2 : 1.5,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          {...props}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            { color: colors.text },
            leftIcon && { paddingLeft: 0 },
            style,
          ]}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? (
              <EyeOff size={20} color={colors.textTertiary} />
            ) : (
              <Eye size={20} color={colors.textTertiary} />
            )}
          </TouchableOpacity>
        )}
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.lg },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    minHeight: 52,
    paddingHorizontal: SPACING.lg,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.md,
  },
  leftIcon: { marginRight: SPACING.md },
  rightIcon: { marginLeft: SPACING.md },
  eyeIcon: { padding: SPACING.xs, marginLeft: SPACING.sm },
  error: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});
