import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { User, FileText, Car, MapPin, LogOut, ChevronRight, Settings, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function RepartidorProfileScreen() {
  const { colors } = useTheme();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: User, label: 'Datos personales', color: colors.roleRepartidor },
    { icon: FileText, label: 'Documentos', color: colors.warning },
    { icon: Car, label: 'Vehículo', color: colors.info },
    { icon: Star, label: 'Mi calificación', color: colors.star },
    { icon: Settings, label: 'Configuración', color: colors.textSecondary },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.roleRepartidor, colors.roleRepartidor + 'CC']} style={styles.header}>
        <Avatar name={user?.full_name || 'R'} size={64} bgColor="rgba(255,255,255,0.25)" />
        <Text style={styles.name}>{user?.full_name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.ratingBadge}>
          <Star size={14} color="#FACC15" fill="#FACC15" />
          <Text style={styles.ratingText}>4.9</Text>
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

        <TouchableOpacity
          onPress={() => logout()}
          style={[styles.logoutBtn, { backgroundColor: colors.errorLight }]}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: SPACING['3xl'], alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  name: { color: '#FFF', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginTop: SPACING.md },
  email: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, marginTop: SPACING.md,
  },
  ratingText: { color: '#FFF', fontWeight: FONT_WEIGHT.bold, fontSize: FONT_SIZE.sm },
  menuCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.xl },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium, marginLeft: SPACING.lg },
  separator: { height: 1, marginLeft: 56 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, marginHorizontal: SPACING.xl, marginTop: SPACING.xl, padding: SPACING.lg, borderRadius: RADIUS.lg },
  logoutText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
});
