import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, ChevronLeft, CheckCircle } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (email.trim()) setSent(true);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
        <ChevronLeft size={22} color={colors.text} />
      </TouchableOpacity>

      {sent ? (
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.successLight }]}>
            <CheckCircle size={48} color={colors.success} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Correo enviado</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Revisa tu bandeja de entrada en {email} para restablecer tu contraseña.
          </Text>
          <Button title="Volver al login" onPress={() => router.replace('/(auth)/login')} fullWidth size="lg" style={{ marginTop: SPACING['3xl'] }} />
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>¿Olvidaste tu contraseña?</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Ingresa tu correo y te enviaremos instrucciones para restablecerla.
            </Text>
          </View>
          <Input
            label="Correo electrónico"
            placeholder="tu@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.textTertiary} />}
          />
          <Button title="Enviar instrucciones" onPress={handleSend} fullWidth size="lg" />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING['2xl'], paddingTop: SPACING['5xl'] },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING['2xl'] },
  header: { marginBottom: SPACING['3xl'] },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZE.md, lineHeight: 22 },
  successContainer: { alignItems: 'center', paddingTop: SPACING['4xl'] },
  successIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING['2xl'] },
});
