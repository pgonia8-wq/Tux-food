import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, RefreshControl } from 'react-native';
import { MapPin, Clock, DollarSign, Package } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useOrdersStore } from '../../store/ordersStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatCurrency } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function AvailableDeliveriesScreen() {
  const { colors } = useTheme();
  const [online, setOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { assignDriver, updateOrderStatus } = useOrdersStore();

  const availableOrders = useOrdersStore((s) =>
    s.orders.filter((o) => o.status === 'listo' && !o.driver_id)
  );

  const mockAvailable = [
    { id: 'avail_1', restaurant: 'La Cocina de María', address: 'Col. Centro, Av. Independencia #456', distance: '1.2 km', total: 590, items: 3, est: '15 min' },
    { id: 'avail_2', restaurant: 'Burger Craft', address: 'Blvd. Juárez #567', distance: '2.5 km', total: 435, items: 2, est: '20 min' },
    { id: 'avail_3', restaurant: 'Taquería Don Chava', address: 'Col. Obrera, Calle 10 #789', distance: '0.8 km', total: 295, items: 4, est: '10 min' },
  ];

  const handleAccept = (orderId: string) => {
    assignDriver(orderId, 'usr_driver_01', 'Juan López');
    updateOrderStatus(orderId, 'en_camino');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.roleRepartidor, colors.roleRepartidor + 'DD']} style={styles.header}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.greeting}>Entregas disponibles</Text>
            <Text style={styles.headerTitle}>
              {online ? '🟢 En línea' : '🔴 Desconectado'}
            </Text>
          </View>
          <Switch
            value={online}
            onValueChange={setOnline}
            trackColor={{ false: 'rgba(255,255,255,0.3)', true: 'rgba(255,255,255,0.5)' }}
            thumbColor={online ? '#22C55E' : '#EF4444'}
          />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }} />}
      >
        {!online ? (
          <EmptyState
            icon={<Package size={36} color={colors.roleRepartidor} />}
            title="Estás desconectado"
            description="Activa tu estado en línea para ver entregas disponibles."
          />
        ) : mockAvailable.length === 0 ? (
          <EmptyState
            icon={<Package size={36} color={colors.roleRepartidor} />}
            title="Sin entregas disponibles"
            description="Las nuevas entregas aparecerán aquí."
          />
        ) : (
          mockAvailable.map((delivery) => (
            <Card key={delivery.id} style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <Text style={[styles.deliveryRestaurant, { color: colors.text }]}>{delivery.restaurant}</Text>
                <Badge label={delivery.distance} color={colors.roleRepartidor} size="sm" />
              </View>
              <View style={styles.deliveryMeta}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color={colors.textTertiary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>{delivery.address}</Text>
                </View>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.textTertiary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{delivery.est}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Package size={14} color={colors.textTertiary} />
                    <Text style={[styles.metaText, { color: colors.textSecondary }]}>{delivery.items} artículos</Text>
                  </View>
                </View>
              </View>
              <View style={styles.deliveryFooter}>
                <View>
                  <Text style={[styles.earningLabel, { color: colors.textTertiary }]}>Ganarás</Text>
                  <Text style={[styles.earningValue, { color: colors.roleRepartidor }]}>
                    {formatCurrency(delivery.total * 0.12)}
                  </Text>
                </View>
                <Button
                  title="Aceptar entrega"
                  onPress={() => handleAccept(delivery.id)}
                  size="sm"
                  style={{ backgroundColor: colors.roleRepartidor }}
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
  header: { paddingTop: 56, paddingBottom: SPACING['2xl'], paddingHorizontal: SPACING.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.sm },
  headerTitle: { color: '#FFF', fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold },
  deliveryCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.md },
  deliveryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  deliveryRestaurant: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  deliveryMeta: { gap: SPACING.sm, marginBottom: SPACING.lg },
  metaRow: { flexDirection: 'row', gap: SPACING.xl },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  metaText: { fontSize: FONT_SIZE.sm },
  deliveryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningLabel: { fontSize: FONT_SIZE.xs },
  earningValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
});
