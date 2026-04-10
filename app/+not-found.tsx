import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { useTheme } from '../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../constants/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.code, { color: colors.primary }]}>404</Text>
      <Text style={[styles.title, { color: colors.text }]}>Página no encontrada</Text>
      <Button title="Ir al inicio" onPress={() => router.replace('/')} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl },
  code: { fontSize: 72, fontWeight: FONT_WEIGHT.heavy, marginBottom: SPACING.sm },
  title: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING['3xl'] },
});
