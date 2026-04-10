import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, Store, Bike, Shield } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

const MOCK_USERS = [
  { id: '1', name: 'Carlos Mendoza', email: 'carlos@test.com', role: 'cliente', status: 'active', joined: '15 Ene 2024' },
  { id: '2', name: 'María García', email: 'maria@test.com', role: 'restaurante', status: 'active', joined: '20 Feb 2024' },
  { id: '3', name: 'Juan López', email: 'juan@test.com', role: 'repartidor', status: 'active', joined: '10 Mar 2024' },
  { id: '4', name: 'Ana Martínez', email: 'ana@test.com', role: 'admin', status: 'active', joined: '01 Ene 2024' },
  { id: '5', name: 'Pedro Ruiz', email: 'pedro@test.com', role: 'cliente', status: 'active', joined: '25 Mar 2024' },
  { id: '6', name: 'Laura Sánchez', email: 'laura@test.com', role: 'restaurante', status: 'pending', joined: '01 Abr 2024' },
  { id: '7', name: 'Roberto Díaz', email: 'roberto@test.com', role: 'repartidor', status: 'active', joined: '15 Feb 2024' },
  { id: '8', name: 'Sofia Torres', email: 'sofia@test.com', role: 'cliente', status: 'inactive', joined: '10 Dic 2023' },
] as const;

const ROLE_CONFIG = {
  cliente: { icon: User, label: 'Cliente' },
  restaurante: { icon: Store, label: 'Restaurante' },
  repartidor: { icon: Bike, label: 'Repartidor' },
  admin: { icon: Shield, label: 'Admin' },
} as const;

export default function AdminUsersScreen() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<string>('all');

  const roleColors: Record<string, string> = {
    cliente: colors.roleCliente,
    restaurante: colors.roleRestaurante,
    repartidor: colors.roleRepartidor,
    admin: colors.roleAdmin,
  };

  const filtered = filter === 'all' ? MOCK_USERS : MOCK_USERS.filter((u) => u.role === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Usuarios</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{MOCK_USERS.length} usuarios registrados</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
        {[
          { key: 'all', label: 'Todos' },
          { key: 'cliente', label: 'Clientes' },
          { key: 'restaurante', label: 'Restaurantes' },
          { key: 'repartidor', label: 'Repartidores' },
          { key: 'admin', label: 'Admins' },
        ].map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterChip, { backgroundColor: filter === f.key ? colors.roleAdmin : colors.card, borderColor: colors.borderLight }, filter !== f.key && { borderWidth: 1 }]}
          >
            <Text style={[styles.filterText, { color: filter === f.key ? '#FFF' : colors.textSecondary }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {filtered.map((user) => {
          const config = ROLE_CONFIG[user.role];
          const roleColor = roleColors[user.role];
          return (
            <Card key={user.id} style={styles.userCard}>
              <View style={styles.userRow}>
                <Avatar name={user.name} size={44} bgColor={roleColor + '20'} />
                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                  <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user.email}</Text>
                  <Text style={[styles.userJoined, { color: colors.textTertiary }]}>Desde {user.joined}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: SPACING.xs }}>
                  <Badge label={config.label} color={roleColor} size="sm" />
                  <Badge
                    label={user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                    color={user.status === 'active' ? colors.success : user.status === 'pending' ? colors.warning : colors.textTertiary}
                    size="sm"
                  />
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.sm },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  subtitle: { fontSize: FONT_SIZE.md, marginTop: SPACING.xs },
  filterRow: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, gap: SPACING.sm },
  filterChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  filterText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  userCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.sm },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userInfo: { flex: 1, marginLeft: SPACING.md },
  userName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  userEmail: { fontSize: FONT_SIZE.sm, marginTop: 1 },
  userJoined: { fontSize: FONT_SIZE.xs, marginTop: 2 },
});
