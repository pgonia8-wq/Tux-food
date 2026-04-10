import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ChevronLeft, Trash2, MapPin, CreditCard, Banknote, ShoppingBag } from 'lucide-react-native';
import { useTheme } from '../hooks/useTheme';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { QuantityStepper } from '../components/ui/QuantityStepper';
import { EmptyState } from '../components/ui/EmptyState';
import { MOCK_RESTAURANTS } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../constants/theme';
import type { PaymentMethod } from '../types';

export default function CartScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, restaurant_id, restaurant_name, getSubtotal, updateQuantity, removeItem, clearCart } = useCartStore();
  const { createOrder } = useOrdersStore();

  const [address, setAddress] = useState('Col. Centro, Av. Independencia #456');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercado_pago');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurant_id);
  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.delivery_fee || 25;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = () => {
    if (!user || items.length === 0) return;
    setPlacing(true);

    const orderId = createOrder({
      customer_id: user.id,
      restaurant_id: restaurant_id!,
      restaurant_name: restaurant_name || '',
      restaurant_image: restaurant?.image_url || '',
      driver_id: null,
      driver_name: null,
      status: 'confirmado',
      items: items.map((ci, i) => ({
        id: `oi_${Date.now()}_${i}`,
        menu_item_id: ci.menu_item.id,
        name: ci.menu_item.name,
        quantity: ci.quantity,
        notes: ci.notes,
        price_at_time: ci.menu_item.price,
        modifiers: ci.modifiers,
      })),
      total_amount: total,
      delivery_fee: deliveryFee,
      subtotal,
      address,
      lat: 18.0893,
      lng: -96.1230,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'efectivo' ? 'pendiente' : 'pagado',
      notes,
      estimated_time: restaurant?.estimated_time || '30 min',
    });

    clearCart();
    setTimeout(() => {
      setPlacing(false);
      router.replace(`/order/${orderId}` as any);
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.card }]}>
          <ChevronLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Mi Carrito</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => Alert.alert('Vaciar carrito', '¿Estás seguro?', [
            { text: 'Cancelar' },
            { text: 'Vaciar', style: 'destructive', onPress: clearCart },
          ])}>
            <Trash2 size={20} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag size={36} color={colors.primary} />}
          title="Tu carrito está vacío"
          description="Agrega platillos de un restaurante para comenzar tu pedido."
          actionLabel="Explorar restaurantes"
          onAction={() => router.back()}
        />
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          {restaurant && (
            <View style={[styles.restaurantBar, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.restaurantBarText, { color: colors.primary }]}>🍽️ {restaurant.name}</Text>
            </View>
          )}

          <View style={styles.section}>
            {items.map((ci) => (
              <View key={ci.menu_item.id} style={[styles.cartItem, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
                <View style={styles.cartItemInfo}>
                  <Text style={[styles.cartItemName, { color: colors.text }]}>{ci.menu_item.name}</Text>
                  {ci.notes ? <Text style={[styles.cartItemNotes, { color: colors.textTertiary }]}>{ci.notes}</Text> : null}
                  <Text style={[styles.cartItemPrice, { color: colors.primary }]}>
                    {formatCurrency(ci.menu_item.price * ci.quantity)}
                  </Text>
                </View>
                <QuantityStepper
                  quantity={ci.quantity}
                  onChange={(q) => updateQuantity(ci.menu_item.id, q)}
                  size="sm"
                />
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Dirección de entrega</Text>
            <Input
              value={address}
              onChangeText={setAddress}
              leftIcon={<MapPin size={18} color={colors.textTertiary} />}
              placeholder="Tu dirección"
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Método de pago</Text>
            <View style={styles.paymentOptions}>
              {([
                { method: 'mercado_pago' as const, label: 'Mercado Pago', icon: CreditCard, color: '#009EE3' },
                { method: 'efectivo' as const, label: 'Efectivo', icon: Banknote, color: colors.success },
              ]).map((pm) => (
                <TouchableOpacity
                  key={pm.method}
                  onPress={() => setPaymentMethod(pm.method)}
                  style={[
                    styles.paymentOption,
                    {
                      backgroundColor: paymentMethod === pm.method ? pm.color + '15' : colors.card,
                      borderColor: paymentMethod === pm.method ? pm.color : colors.borderLight,
                      borderWidth: paymentMethod === pm.method ? 2 : 1,
                    },
                  ]}
                >
                  <pm.icon size={22} color={pm.color} />
                  <Text style={[styles.paymentLabel, { color: colors.text }]}>{pm.label}</Text>
                  <View style={[styles.radio, { borderColor: paymentMethod === pm.method ? pm.color : colors.border }]}>
                    {paymentMethod === pm.method && <View style={[styles.radioInner, { backgroundColor: pm.color }]} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas</Text>
            <Input
              value={notes}
              onChangeText={setNotes}
              placeholder="Instrucciones especiales (opcional)"
              multiline
              numberOfLines={2}
            />
          </View>

          <Card style={{ marginHorizontal: SPACING.xl }}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(subtotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Envío</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(deliveryFee)}</Text>
            </View>
            <View style={[styles.totalDivider, { borderTopColor: colors.divider }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>{formatCurrency(total)}</Text>
            </View>
          </Card>
        </ScrollView>
      )}

      {items.length > 0 && (
        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Button
            title={placing ? 'Procesando...' : `Pedir · ${formatCurrency(total)}`}
            onPress={handlePlaceOrder}
            loading={placing}
            fullWidth
            size="lg"
          />
        </View>
      )}
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
  headerTitle: { flex: 1, fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, marginLeft: SPACING.md },
  restaurantBar: {
    marginHorizontal: SPACING.xl, marginTop: SPACING.lg, padding: SPACING.md,
    borderRadius: RADIUS.lg, alignItems: 'center',
  },
  restaurantBarText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, marginBottom: SPACING.sm,
  },
  cartItemInfo: { flex: 1, marginRight: SPACING.md },
  cartItemName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  cartItemNotes: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  cartItemPrice: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold, marginTop: SPACING.xs },
  paymentOptions: { gap: SPACING.sm },
  paymentOption: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.lg,
    borderRadius: RADIUS.lg, gap: SPACING.md,
  },
  paymentLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  summaryLabel: { fontSize: FONT_SIZE.md },
  summaryValue: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  totalDivider: { borderTopWidth: 1, marginVertical: SPACING.md },
  totalLabel: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  totalValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.xl, paddingBottom: SPACING['3xl'], borderTopWidth: 1,
  },
});
