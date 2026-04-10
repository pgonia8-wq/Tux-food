import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd, colors.gradientAccent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🐧</Text>
            <Text style={styles.logoText}>Tux Food</Text>
          </View>
          <Text style={styles.heroTitle}>Tu comida favorita{'\n'}a un toque de distancia</Text>
          <View style={styles.locationBadge}>
            <MapPin size={14} color="rgba(255,255,255,0.9)" />
            <Text style={styles.locationText}>Tuxtepec, Oaxaca</Text>
          </View>
        </View>
        <View style={styles.heroDecor}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </LinearGradient>

      <View style={styles.bottom}>
        <View style={styles.features}>
          {[
            { emoji: '🍽️', text: 'Los mejores restaurantes' },
            { emoji: '🚀', text: 'Entrega rápida y segura' },
            { emoji: '💳', text: 'Paga con Mercado Pago o efectivo' },
          ].map((f, i) => (
            <View key={i} style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button title="Iniciar sesión" onPress={() => router.push('/(auth)/login')} fullWidth size="lg" />
          <Button
            title="Crear cuenta"
            onPress={() => router.push('/(auth)/register')}
            variant="outline"
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    height: height * 0.48,
    justifyContent: 'flex-end',
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: SPACING['2xl'],
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroContent: { zIndex: 2 },
  heroDecor: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  circle1: { width: 200, height: 200, top: -40, right: -60 },
  circle2: { width: 150, height: 150, top: 80, left: -50 },
  circle3: { width: 100, height: 100, bottom: 40, right: 30 },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    gap: SPACING.md,
  },
  logoEmoji: { fontSize: 36 },
  logoText: {
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.heavy,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroTitle: {
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
    lineHeight: 34,
    marginBottom: SPACING.lg,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  locationText: { color: 'rgba(255,255,255,0.9)', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },
  bottom: { flex: 1, paddingHorizontal: SPACING['2xl'], paddingTop: SPACING['2xl'] },
  features: { gap: SPACING.md, marginBottom: SPACING['2xl'] },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  featureEmoji: { fontSize: 22 },
  featureText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  actions: { gap: SPACING.md },
});
