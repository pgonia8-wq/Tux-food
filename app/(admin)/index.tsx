import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ShoppingBag, DollarSign, Store, Users, Bike, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { MOCK_ORDERS, MOCK_RESTAURANTS } from '../../lib/mockData';
import { formatCurrency, getTimeAgo } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function AdminDashboardScreen() {
  const { colors } = useTheme();

  const stats = [
    { label: 'Pedidos totales', value: MOCK_ORDERS.length.toString(), icon: ShoppingBag, color: colors.roleAdmin, change: '+12%' },
    { label: 'Ingresos', value: formatCurrency(MOCK_ORDERS.reduce((s, o) => s + o.total_amount, 0)), icon: DollarSign, color: colors.success, change: '+8%' },
    { label: 'Restaurantes', value: MOCK_RESTAURANTS.filter((r) => r.is_approved).length.toString(), icon: Store, color: colors.roleRestaurante, change: '+2' },
    { label: 'Repartidores', value: '15', icon: Bike, color: colors.roleRepartidor, change: '+3' },
    { label: 'Usuarios', value: '248', icon: Users, color: colors.info, change: '+22' },
    { label: 'Aprobaciones', value: MOCK_RESTAURANTS.filter((r) => !r.is_approved).length.toString(), icon: AlertCircle, color: colors.warning, change: 'pendiente' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.roleAdmin, colors.roleAdmin + 'CC']} style={styles.header}>
        <Text style={styles.headerLabel}>Admin Panel</Text>
        <Text style={styles.headerTitle}>Tux Food</Text>
        <Text style={styles.headerSubtitle}>Control total del sistema</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <Card key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <s.icon size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
              <Text style={[styles.statChange, { color: s.color }]}>{s.change}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Pedidos recientes</Text>
          {MOCK_ORDERS.slice(0, 5).map((order) => (
            <Card key={order.id} style={styles.orderCard}>
              <View style={styles.orderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.orderId, { color: colors.text }]}>#{order.id.slice(-6)}</Text>
                  <Text style={[styles.orderRestaurant, { color: colors.textSecondary }]}>{order.restaurant_name}</Text>
                  <Text style={[styles.orderTime, { color: colors.textTertiary }]}>{getTimeAgo(order.created_at)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <StatusBadge status={order.status} size="sm" />
                  <Text style={[styles.orderAmount, { color: colors.text }]}>{formatCurrency(order.total_amount)}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: SPACING['2xl'], paddingHorizontal: SPACING.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.xs, textTransform: 'uppercase', letterSpacing: 1 },
  headerTitle: { color: '#FFF', fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.heavy },
  headerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.xl, gap: SPACING.md, marginTop: SPACING.xl },
  statCard: { width: '47%', alignItems: 'center' },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  statLabel: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  statChange: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, marginTop: SPACING.xs },
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING['2xl'] },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  orderCard: { marginBottom: SPACING.sm },
  orderRow: { flexDirection: 'row' },
  orderId: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  orderRestaurant: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  orderTime: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  orderAmount: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, marginTop: SPACING.sm },
});
