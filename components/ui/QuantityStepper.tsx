import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({ quantity, onChange, min = 0, max = 99, size = 'md' }) => {
  const { colors } = useTheme();
  const btnSize = size === 'sm' ? 28 : 36;
  const iconSize = size === 'sm' ? 14 : 18;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, quantity - 1))}
        style={[styles.btn, { width: btnSize, height: btnSize, backgroundColor: colors.primaryLight }]}
        disabled={quantity <= min}
      >
        <Minus size={iconSize} color={quantity <= min ? colors.textTertiary : colors.primary} />
      </TouchableOpacity>
      <Text style={[styles.qty, { color: colors.text }, size === 'sm' && styles.qtySm]}>{quantity}</Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, quantity + 1))}
        style={[styles.btn, { width: btnSize, height: btnSize, backgroundColor: colors.primary }]}
        disabled={quantity >= max}
      >
        <Plus size={iconSize} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  btn: { borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, minWidth: 28, textAlign: 'center' },
  qtySm: { fontSize: FONT_SIZE.md, minWidth: 22 },
});
