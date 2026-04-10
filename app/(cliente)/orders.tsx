import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Package, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useOrdersStore } from '../../store/ordersStore';
import { MOCK_ORDERS } from '../../lib/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { formatCurrency, formatDateTime, getTimeAgo } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function OrdersScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const storeOrders = useOrdersStore((s) => s.orders);

  const allOrders = [...storeOrders, ...MOCK_ORDERS.filter((mo) => !storeOrders.find((so) => so.id === mo.id))];
  const orders = allOrders
    .filter((o) => o.customer_id === user?.id)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const active = orders.filter((o) => !['entregado', 'cancelado'].includes(o.status));
  const past = orders.filter((o) => ['entregado', 'cancelado'].includes(o.status));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Mis Pedidos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {orders.length === 0 ? (
          <EmptyState
            icon={<Package size={36} color={colors.primary} />}
            title="Sin pedidos aún"
            description="Cuando hagas tu primer pedido, aparecerá aquí."
            actionLabel="Explorar restaurantes"
            onAction={() => router.push('/(cliente)' as any)}
          />
        ) : (
          <>
            {active.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Pedidos activos</Text>
                {active.map((order) => (
                  <Card
                    key={order.id}
                    onPress={() => router.push(`/order/${order.id}` as any)}
                    style={{ marginBottom: SPACING.md }}
                  >
                    <View style={styles.orderHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.orderRestaurant, { color: colors.text }]}>{order.restaurant_name}</Text>
                        <Text style={[styles.orderTime, { color: colors.textTertiary }]}>{getTimeAgo(order.created_at)}</Text>
                      </View>
                      <StatusBadge status={order.status} />
                    </View>
                    <View style={[styles.orderDivider, { backgroundColor: colors.divider }]} />
                    <View style={styles.orderFooter}>
                      <Text style={[styles.orderItems, { color: colors.textSecondary }]}>
                        {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      </Text>
                      <View style={styles.orderTotal}>
                        <Text style={[styles.orderAmount, { color: colors.text }]}>{formatCurrency(order.total_amount)}</Text>
                        <ChevronRight size={16} color={colors.textTertiary} />
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {past.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Historial</Text>
                {past.map((order) => (
                  <Card
                    key={order.id}
                    onPress={() => router.push(`/order/${order.id}` as any)}
                    style={{ marginBottom: SPACING.md }}
                  >
                    <View style={styles.orderHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.orderRestaurant, { color: colors.text }]}>{order.restaurant_name}</Text>
                        <Text style={[styles.orderTime, { color: colors.textTertiary }]}>{formatDateTime(order.created_at)}</Text>
                      </View>
                      <StatusBadge status={order.status} size="sm" />
                    </View>
                    <View style={styles.orderFooter}>
                      <Text style={[styles.orderItems, { color: colors.textSecondary }]}>
                        {order.items.map((i) => i.name).join(', ')}
                      </Text>
                      <Text style={[styles.orderAmount, { color: colors.text }]}>{formatCurrency(order.total_amount)}</Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  section: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderRestaurant: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  orderTime: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  orderDivider: { height: 1, marginVertical: SPACING.md },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderItems: { fontSize: FONT_SIZE.sm, flex: 1 },
  orderTotal: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  orderAmount: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
