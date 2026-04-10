import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, Phone, ChevronLeft, Store, Truck, Shield } from 'lucide-react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';
import type { UserRole } from '../../types';

const ROLES: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { role: 'cliente', label: 'Cliente', icon: <User size={22} />, desc: 'Pide comida a domicilio' },
  { role: 'restaurante', label: 'Restaurante', icon: <Store size={22} />, desc: 'Publica tu menú' },
  { role: 'repartidor', label: 'Repartidor', icon: <Truck size={22} />, desc: 'Entrega pedidos' },
];

export default function RegisterScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { register, isLoading } = useAuthStore();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('cliente');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    const result = await register({
      email: email.trim().toLowerCase(),
      password,
      full_name: fullName.trim(),
      phone: phone.trim(),
      role: selectedRole,
    });
    if (!result.success) {
      setError(result.error || 'Error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity onPress={() => (step === 2 ? setStep(1) : router.back())} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {step === 1 ? '¿Cómo usarás Tux Food?' : 'Crea tu cuenta'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {step === 1 ? 'Selecciona tu tipo de cuenta' : 'Completa tus datos para registrarte'}
          </Text>
        </View>

        {step === 1 ? (
          <>
            <View style={styles.roles}>
              {ROLES.map((r) => {
                const isSelected = selectedRole === r.role;
                const roleColor =
                  r.role === 'cliente' ? colors.roleCliente :
                  r.role === 'restaurante' ? colors.roleRestaurante : colors.roleRepartidor;

                return (
                  <TouchableOpacity
                    key={r.role}
                    onPress={() => setSelectedRole(r.role)}
                    activeOpacity={0.7}
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: isSelected ? roleColor + '15' : colors.card,
                        borderColor: isSelected ? roleColor : colors.borderLight,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}
                  >
                    <View style={[styles.roleIcon, { backgroundColor: roleColor + '20' }]}>
                      {React.cloneElement(r.icon as React.ReactElement, { color: roleColor })}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.roleLabel, { color: colors.text }]}>{r.label}</Text>
                      <Text style={[styles.roleDesc, { color: colors.textSecondary }]}>{r.desc}</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: isSelected ? roleColor : colors.border }]}>
                      {isSelected && <View style={[styles.radioInner, { backgroundColor: roleColor }]} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Button title="Continuar" onPress={() => setStep(2)} fullWidth size="lg" />
          </>
        ) : (
          <>
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: colors.errorLight }]}>
                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Nombre completo"
              placeholder="Tu nombre"
              value={fullName}
              onChangeText={setFullName}
              leftIcon={<User size={20} color={colors.textTertiary} />}
            />
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
              label="Teléfono"
              placeholder="+52 287 123 4567"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon={<Phone size={20} color={colors.textTertiary} />}
            />
            <Input
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<Lock size={20} color={colors.textTertiary} />}
            />

            <Button title="Crear cuenta" onPress={handleRegister} loading={isLoading} fullWidth size="lg" />
          </>
        )}

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={[styles.footerLink, { color: colors.primary }]}>Inicia sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: SPACING['2xl'], paddingTop: SPACING['5xl'] },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING['2xl'] },
  header: { marginBottom: SPACING['3xl'] },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT_SIZE.md },
  roles: { gap: SPACING.md, marginBottom: SPACING['3xl'] },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    gap: SPACING.lg,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.semibold },
  roleDesc: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  errorBox: { padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.lg },
  errorText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: SPACING['2xl'] },
  footerText: { fontSize: FONT_SIZE.md },
  footerLink: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
