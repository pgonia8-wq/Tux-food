import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

const DEMO_ACCOUNTS = [
  { label: '👤 Cliente', email: 'cliente@test.com' },
  { label: '🍳 Restaurante', email: 'restaurante@test.com' },
  { label: '🛵 Repartidor', email: 'repartidor@test.com' },
  { label: '⚙️ Admin', email: 'admin@test.com' },
];

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim()) {
      setError('Ingresa tu correo electrónico');
      return;
    }
    const result = await login(email.trim().toLowerCase(), password);
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    const result = await login(demoEmail, 'demo123');
    if (!result.success) {
      setError(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Bienvenido de vuelta</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Inicia sesión para continuar</Text>
        </View>

        {error ? (
          <View style={[styles.errorBox, { backgroundColor: colors.errorLight }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}

        <Input
          label="Correo electrónico"
          placeholder="tu@correo.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={colors.textTertiary} />}
        />

        <Input
          label="Contraseña"
          placeholder="Tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={20} color={colors.textTertiary} />}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotBtn}>
          <Text style={[styles.forgotText, { color: colors.primary }]}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Button title="Iniciar sesión" onPress={handleLogin} loading={isLoading} fullWidth size="lg" />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textTertiary }]}>Demo rápido</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.demoGrid}>
          {DEMO_ACCOUNTS.map((acc) => (
            <TouchableOpacity
              key={acc.email}
              onPress={() => handleDemoLogin(acc.email)}
              style={[styles.demoBtn, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.demoBtnText, { color: colors.text }]}>{acc.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING['2xl'], paddingTop: SPACING['5xl'] },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING['2xl'],
  },
  header: { marginBottom: SPACING['3xl'] },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZE.md },
  errorBox: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  errorText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: SPACING['2xl'], marginTop: -SPACING.sm },
  forgotText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING['2xl'],
  },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: SPACING.lg, fontSize: FONT_SIZE.sm },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING['2xl'],
  },
  demoBtn: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  demoBtnText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: SPACING.lg },
  footerText: { fontSize: FONT_SIZE.md },
  footerLink: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
