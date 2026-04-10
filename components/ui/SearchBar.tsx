import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onFilterPress,
  autoFocus,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.borderLight }, SHADOWS.sm]}>
      <Search size={20} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { color: colors.text }]}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
          <X size={18} color={colors.textTertiary} />
        </TouchableOpacity>
      )}
      {onFilterPress && (
        <TouchableOpacity onPress={onFilterPress} style={[styles.filterBtn, { backgroundColor: colors.primaryLight }]}>
          <SlidersHorizontal size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    marginLeft: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  clearBtn: { padding: SPACING.xs },
  filterBtn: {
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
    marginLeft: SPACING.sm,
  },
});
