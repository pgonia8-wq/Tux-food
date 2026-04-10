import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Clock, CheckCircle, ChefHat, Package } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore } from '../../store/ordersStore';
import { MOCK_ORDERS } from '../../lib/mockData';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, getTimeAgo } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';
import type { OrderStatus } from '../../types';

const NEXT_STATUS: Record<string, OrderStatus> = {
  pendiente: 'confirmado',
  confirmado: 'preparando',
  preparando: 'listo',
};

export default function RestauranteOrdersScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const storeOrders = useOrdersStore((s) => s.orders);
  const { updateOrderStatus } = useOrdersStore();
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'active' | 'history'>('active');

  const allOrders = [...storeOrders, ...MOCK_ORDERS.filter((mo) => !storeOrders.find((so) => so.id === mo.id))];
  const restOrders = allOrders.filter((o) => o.restaurant_id === 'rest_01');
  const active = restOrders.filter((o) => !['entregado', 'cancelado'].includes(o.status));
  const history = restOrders.filter((o) => ['entregado', 'cancelado'].includes(o.status));

  const todayOrders = restOrders.filter((o) => {
    const d = new Date(o.created_at);
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth();
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.roleRestaurante, colors.roleRestaurante + 'DD']} style={styles.header}>
        <Text style={styles.greeting}>Panel de Restaurante</Text>
        <Text style={styles.storeName}>La Cocina de María</Text>
        <View style={styles.statsRow}>
          {[
            { label: 'Hoy', value: todayOrders.length, icon: Clock },
            { label: 'Activos', value: active.length, icon: ChefHat },
            { label: 'Ingresos', value: formatCurrency(todayOrders.reduce((s, o) => s + o.total_amount, 0)), icon: CheckCircle },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <s.icon size={16} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.tabRow}>
        {(['active', 'history'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && { borderBottomColor: colors.roleRestaurante, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.roleRestaurante : colors.textTertiary }]}>
              {t === 'active' ? `Activos (${active.length})` : `Historial (${history.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }} />}
      >
        {(tab === 'active' ? active : history).map((order) => (
          <Card key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={[styles.orderId, { color: colors.text }]}>#{order.id.slice(-6)}</Text>
                <Text style={[styles.orderTime, { color: colors.textTertiary }]}>{getTimeAgo(order.created_at)}</Text>
              </View>
              <StatusBadge status={order.status} />
            </View>
            <View style={[styles.orderDivider, { backgroundColor: colors.divider }]} />
            {order.items.map((item) => (
              <Text key={item.id} style={[styles.orderItem, { color: colors.textSecondary }]}>
                {item.quantity}x {item.name}
              </Text>
            ))}
            <View style={styles.orderFooter}>
              <Text style={[styles.orderTotal, { color: colors.text }]}>{formatCurrency(order.total_amount)}</Text>
              {NEXT_STATUS[order.status] && (
                <Button
                  title={order.status === 'pendiente' ? 'Confirmar' : order.status === 'confirmado' ? 'Preparando' : 'Listo'}
                  onPress={() => updateOrderStatus(order.id, NEXT_STATUS[order.status])}
                  size="sm"
                  style={{ backgroundColor: colors.roleRestaurante }}
                />
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: SPACING['2xl'], paddingHorizontal: SPACING.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.sm },
  storeName: { color: '#FFF', fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row', gap: SPACING.md },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center', gap: 4 },
  statValue: { color: '#FFF', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.xs },
  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl, marginTop: SPACING.lg },
  tab: { flex: 1, alignItems: 'center', paddingBottom: SPACING.md },
  tabText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  orderCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.md },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  orderTime: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  orderDivider: { height: 1, marginVertical: SPACING.md },
  orderItem: { fontSize: FONT_SIZE.sm, marginBottom: 2 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md },
  orderTotal: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
});
