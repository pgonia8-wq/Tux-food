import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, MapPin, CreditCard, Bell, CircleHelp, LogOut, ChevronRight, Moon, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { icon: User, label: 'Datos personales', color: colors.primary },
    { icon: MapPin, label: 'Direcciones guardadas', color: colors.info },
    { icon: CreditCard, label: 'Métodos de pago', color: colors.success },
    { icon: Bell, label: 'Notificaciones', color: colors.warning },
    { icon: Shield, label: 'Privacidad', color: colors.roleRestaurante },
    { icon: CircleHelp, label: 'Ayuda y soporte', color: colors.textSecondary },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.profileRow}>
          <Avatar name={user?.full_name || 'U'} size={64} bgColor="rgba(255,255,255,0.25)" />
          <View style={{ flex: 1, marginLeft: SPACING.lg }}>
            <Text style={styles.name}>{user?.full_name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.6}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                  <item.icon size={20} color={item.color} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                <ChevronRight size={18} color={colors.textTertiary} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={[styles.separator, { backgroundColor: colors.divider }]} />}
            </React.Fragment>
          ))}
        </Card>

        <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: colors.errorLight }]}>
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textTertiary }]}>Tux Food v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: SPACING['3xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  name: { color: '#FFF', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm, marginTop: 2 },
  menuCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.xl },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium, marginLeft: SPACING.lg },
  separator: { height: 1, marginLeft: 56 },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    marginHorizontal: SPACING.xl, marginTop: SPACING.xl, padding: SPACING.lg, borderRadius: RADIUS.lg,
  },
  logoutText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  version: { textAlign: 'center', fontSize: FONT_SIZE.xs, marginTop: SPACING.xl },
});
