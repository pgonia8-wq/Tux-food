import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ChevronLeft, MapPin, Phone, MessageCircle, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useOrdersStore } from '../../store/ordersStore';
import { MOCK_ORDERS } from '../../lib/mockData';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { ORDER_STATUS_CONFIG, FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';
import type { OrderStatus } from '../../types';

const FLOW: OrderStatus[] = ['confirmado', 'preparando', 'listo', 'en_camino', 'entregado'];

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { updateOrderStatus, assignDriver } = useOrdersStore();

  const storeOrder = useOrdersStore((s) => s.getOrderById(id!));
  const mockOrder = MOCK_ORDERS.find((o) => o.id === id);
  const order = storeOrder || mockOrder;

  useEffect(() => {
    if (!order || order.status === 'entregado' || order.status === 'cancelado') return;

    const timer = setInterval(() => {
      const currentOrder = useOrdersStore.getState().getOrderById(id!);
      if (!currentOrder) return;

      const currentIdx = FLOW.indexOf(currentOrder.status);
      if (currentIdx >= 0 && currentIdx < FLOW.length - 1) {
        const nextStatus = FLOW[currentIdx + 1];
        updateOrderStatus(currentOrder.id, nextStatus);
        if (nextStatus === 'en_camino' && !currentOrder.driver_id) {
          assignDriver(currentOrder.id, 'usr_driver_01', 'Juan López');
        }
      } else {
        clearInterval(timer);
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [id]);

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ color: colors.text, fontSize: FONT_SIZE.lg }}>Pedido no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} variant="secondary" style={{ marginTop: SPACING.xl }} />
      </View>
    );
  }

  const currentFlowIdx = FLOW.indexOf(order.status);
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pedido #{order.id.slice(-6)}</Text>
        <StatusBadge status={order.status} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {order.status !== 'entregado' && order.status !== 'cancelado' && (
          <LinearGradient
            colors={[statusConfig?.color || colors.primary, (statusConfig?.color || colors.primary) + 'CC']}
            style={styles.statusHero}
          >
            <Text style={styles.statusEmoji}>
              {order.status === 'confirmado' ? '✅' : order.status === 'preparando' ? '👨‍🍳' : order.status === 'listo' ? '📦' : order.status === 'en_camino' ? '🛵' : '🎉'}
            </Text>
            <Text style={styles.statusTitle}>{statusConfig?.label}</Text>
            <Text style={styles.statusDesc}>
              {order.status === 'confirmado' && 'Tu pedido ha sido confirmado por el restaurante'}
              {order.status === 'preparando' && 'El restaurante está preparando tu comida'}
              {order.status === 'listo' && 'Tu pedido está listo para ser recogido'}
              {order.status === 'en_camino' && 'Tu repartidor va en camino con tu pedido'}
            </Text>
            {order.estimated_time && (
              <View style={styles.etaChip}>
                <Clock size={14} color="#FFF" />
                <Text style={styles.etaText}>{order.estimated_time}</Text>
              </View>
            )}
          </LinearGradient>
        )}

        {order.status !== 'cancelado' && (
          <View style={styles.progressSection}>
            {FLOW.map((step, i) => {
              const isCompleted = currentFlowIdx >= i;
              const isCurrent = currentFlowIdx === i;
              const config = ORDER_STATUS_CONFIG[step];

              return (
                <View key={step} style={styles.progressStep}>
                  <View style={styles.progressDots}>
                    <View style={[
                      styles.progressDot,
                      { backgroundColor: isCompleted ? config.color : colors.border },
                      isCurrent && styles.progressDotActive,
                    ]} />
                    {i < FLOW.length - 1 && (
                      <View style={[styles.progressLine, { backgroundColor: currentFlowIdx > i ? config.color : colors.border }]} />
                    )}
                  </View>
                  <Text style={[styles.progressLabel, { color: isCompleted ? colors.text : colors.textTertiary, fontWeight: isCurrent ? FONT_WEIGHT.bold : FONT_WEIGHT.regular }]}>
                    {config.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {order.driver_name && (
          <Card style={styles.driverCard}>
            <Text style={[styles.driverTitle, { color: colors.textSecondary }]}>Tu repartidor</Text>
            <View style={styles.driverRow}>
              <View style={[styles.driverAvatar, { backgroundColor: colors.roleRepartidor + '20' }]}>
                <Text style={styles.driverAvatarText}>🛵</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.driverName, { color: colors.text }]}>{order.driver_name}</Text>
              </View>
              <TouchableOpacity style={[styles.driverBtn, { backgroundColor: colors.primaryLight }]}>
                <Phone size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.driverBtn, { backgroundColor: colors.primaryLight }]}>
                <MessageCircle size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        <Card style={styles.detailCard}>
          <Text style={[styles.detailTitle, { color: colors.text }]}>Resumen del pedido</Text>
          <Text style={[styles.detailRestaurant, { color: colors.primary }]}>{order.restaurant_name}</Text>
          {order.items.map((item) => (
            <View key={item.id} style={[styles.itemRow, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.itemQty, { color: colors.primary }]}>{item.quantity}x</Text>
              <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.itemPrice, { color: colors.textSecondary }]}>{formatCurrency(item.price_at_time * item.quantity)}</Text>
            </View>
          ))}
          <View style={[styles.totalSection, { borderTopColor: colors.divider }]}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.totalVal, { color: colors.text }]}>{formatCurrency(order.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Envío</Text>
              <Text style={[styles.totalVal, { color: colors.text }]}>{formatCurrency(order.delivery_fee)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.grandTotalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.grandTotalVal, { color: colors.primary }]}>{formatCurrency(order.total_amount)}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.detailCard}>
          <View style={styles.addressRow}>
            <MapPin size={18} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>Dirección de entrega</Text>
              <Text style={[styles.addressText, { color: colors.text }]}>{order.address}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingTop: 56, paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.xl, borderBottomWidth: 1,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginLeft: SPACING.md },
  statusHero: {
    margin: SPACING.xl, padding: SPACING['2xl'], borderRadius: RADIUS['2xl'],
    alignItems: 'center',
  },
  statusEmoji: { fontSize: 48, marginBottom: SPACING.md },
  statusTitle: { color: '#FFF', fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.xs },
  statusDesc: { color: 'rgba(255,255,255,0.85)', fontSize: FONT_SIZE.md, textAlign: 'center' },
  etaChip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full, marginTop: SPACING.lg,
  },
  etaText: { color: '#FFF', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  progressSection: { paddingHorizontal: SPACING['3xl'], paddingVertical: SPACING.xl },
  progressStep: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.xs },
  progressDots: { alignItems: 'center', marginRight: SPACING.lg, width: 20 },
  progressDot: { width: 16, height: 16, borderRadius: 8 },
  progressDotActive: { width: 20, height: 20, borderRadius: 10 },
  progressLine: { width: 3, height: 28 },
  progressLabel: { fontSize: FONT_SIZE.md, paddingTop: 0 },
  driverCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  driverTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, textTransform: 'uppercase', marginBottom: SPACING.md },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  driverAvatarText: { fontSize: 22 },
  driverName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  driverBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  detailCard: { marginHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  detailTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.xs },
  detailRestaurant: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, marginBottom: SPACING.lg },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  itemQty: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold, width: 30 },
  itemName: { flex: 1, fontSize: FONT_SIZE.md },
  itemPrice: { fontSize: FONT_SIZE.sm },
  totalSection: { borderTopWidth: 1, marginTop: SPACING.md, paddingTop: SPACING.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xs },
  totalLabel: { fontSize: FONT_SIZE.sm },
  totalVal: { fontSize: FONT_SIZE.sm },
  grandTotalLabel: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  grandTotalVal: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addressLabel: { fontSize: FONT_SIZE.xs, marginBottom: 2 },
  addressText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
});
