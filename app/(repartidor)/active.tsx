import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Navigation, MapPin, Phone, Package } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { useOrdersStore } from '../../store/ordersStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';

export default function ActiveDeliveryScreen() {
  const { colors } = useTheme();
  const { updateOrderStatus } = useOrdersStore();
  const activeDeliveries = useOrdersStore((s) =>
    s.orders.filter((o) => o.driver_id === 'usr_driver_01' && o.status === 'en_camino')
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Entrega en curso</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {activeDeliveries.length === 0 ? (
          <EmptyState
            icon={<Navigation size={36} color={colors.roleRepartidor} />}
            title="Sin entregas activas"
            description="Acepta una entrega desde la pestaña de disponibles."
          />
        ) : (
          activeDeliveries.map((order) => (
            <Card key={order.id} style={styles.activeCard} elevated>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.orderId, { color: colors.text }]}>Pedido #{order.id.slice(-6)}</Text>
                  <Text style={[styles.restaurant, { color: colors.roleRepartidor }]}>{order.restaurant_name}</Text>
                </View>
                <StatusBadge status={order.status} />
              </View>

              <View style={[styles.divider, { backgroundColor: colors.divider }]} />

              <View style={styles.addressSection}>
                <View style={styles.addressRow}>
                  <View style={[styles.addressDot, { backgroundColor: colors.roleRepartidor }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addressLabel, { color: colors.textTertiary }]}>Restaurante</Text>
                    <Text style={[styles.addressText, { color: colors.text }]}>{order.restaurant_name}</Text>
                  </View>
                </View>
                <View style={[styles.addressLine, { borderLeftColor: colors.border }]} />
                <View style={styles.addressRow}>
                  <View style={[styles.addressDot, { backgroundColor: colors.success }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.addressLabel, { color: colors.textTertiary }]}>Cliente</Text>
                    <Text style={[styles.addressText, { color: colors.text }]}>{order.address}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.itemsList}>
                {order.items.map((item) => (
                  <Text key={item.id} style={[styles.itemText, { color: colors.textSecondary }]}>
                    {item.quantity}x {item.name}
                  </Text>
                ))}
              </View>

              <View style={styles.footer}>
                <Text style={[styles.totalLabel, { color: colors.text }]}>
                  Total: <Text style={{ color: colors.roleRepartidor }}>{formatCurrency(order.total_amount)}</Text>
                </Text>
                <Button
                  title="Marcar entregado"
                  onPress={() => updateOrderStatus(order.id, 'entregado')}
                  size="md"
                  style={{ backgroundColor: colors.success }}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  activeCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  restaurant: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, marginTop: 2 },
  divider: { height: 1, marginVertical: SPACING.lg },
  addressSection: { marginBottom: SPACING.lg },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md },
  addressDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  addressLine: { borderLeftWidth: 2, height: 20, marginLeft: 5, marginVertical: 2 },
  addressLabel: { fontSize: FONT_SIZE.xs },
  addressText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  itemsList: { marginBottom: SPACING.lg },
  itemText: { fontSize: FONT_SIZE.sm, marginBottom: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
