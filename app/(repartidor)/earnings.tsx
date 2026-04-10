import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DollarSign, TrendingUp, Bike, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';
import { formatCurrency } from '../../lib/utils';

export default function EarningsScreen() {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<'hoy' | 'semana' | 'mes'>('hoy');

  const data = {
    hoy: { earnings: 485, deliveries: 8, hours: 5.5, tips: 120 },
    semana: { earnings: 3250, deliveries: 52, hours: 38, tips: 780 },
    mes: { earnings: 12800, deliveries: 195, hours: 152, tips: 2950 },
  };

  const current = data[period];

  const recentDeliveries = [
    { restaurant: 'La Cocina de María', time: '14:30', amount: 70.80 },
    { restaurant: 'Burger Craft', time: '13:15', amount: 52.20 },
    { restaurant: 'Taquería Don Chava', time: '12:00', amount: 35.40 },
    { restaurant: 'Mariscos El Puerto', time: '11:20', amount: 85.00 },
    { restaurant: 'Pizzería Napoli', time: '10:45', amount: 45.60 },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.roleRepartidor, colors.roleRepartidor + 'DD']} style={styles.header}>
        <Text style={styles.headerLabel}>Ganancias</Text>
        <Text style={styles.earningsAmount}>{formatCurrency(current.earnings)}</Text>
        <View style={styles.periodRow}>
          {(['hoy', 'semana', 'mes'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={[styles.periodChip, period === p && styles.periodChipActive]}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.statsGrid}>
          {[
            { label: 'Entregas', value: current.deliveries.toString(), icon: Bike, color: colors.roleRepartidor },
            { label: 'Horas', value: `${current.hours}h`, icon: Clock, color: colors.info },
            { label: 'Propinas', value: formatCurrency(current.tips), icon: DollarSign, color: colors.success },
            { label: 'Promedio', value: formatCurrency(current.earnings / current.deliveries), icon: TrendingUp, color: colors.warning },
          ].map((s, i) => (
            <Card key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <s.icon size={18} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Entregas recientes</Text>
          <Card>
            {recentDeliveries.map((d, i) => (
              <View key={i} style={[styles.deliveryRow, i < recentDeliveries.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                <View>
                  <Text style={[styles.deliveryRestaurant, { color: colors.text }]}>{d.restaurant}</Text>
                  <Text style={[styles.deliveryTime, { color: colors.textTertiary }]}>{d.time}</Text>
                </View>
                <Text style={[styles.deliveryAmount, { color: colors.roleRepartidor }]}>+{formatCurrency(d.amount)}</Text>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 56, paddingBottom: SPACING['2xl'], paddingHorizontal: SPACING.xl, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, alignItems: 'center' },
  headerLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.sm },
  earningsAmount: { color: '#FFF', fontSize: FONT_SIZE['5xl'], fontWeight: FONT_WEIGHT.heavy, marginVertical: SPACING.sm },
  periodRow: { flexDirection: 'row', gap: SPACING.sm },
  periodChip: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: 'rgba(255,255,255,0.15)' },
  periodChipActive: { backgroundColor: '#FFF' },
  periodText: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  periodTextActive: { color: '#0891B2' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.xl, gap: SPACING.md, marginTop: SPACING.xl },
  statCard: { width: '47%', alignItems: 'center' },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  statLabel: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING['2xl'] },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.md },
  deliveryRestaurant: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.medium },
  deliveryTime: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  deliveryAmount: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
