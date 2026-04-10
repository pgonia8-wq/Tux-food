import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, DollarSign, ShoppingBag, Star, Users } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function StatsScreen() {
  const { colors } = useTheme();

  const stats = [
    { label: 'Pedidos hoy', value: '12', icon: ShoppingBag, color: colors.roleRestaurante, change: '+15%' },
    { label: 'Ingresos hoy', value: '$2,450', icon: DollarSign, color: colors.success, change: '+8%' },
    { label: 'Rating promedio', value: '4.8', icon: Star, color: colors.star, change: '+0.1' },
    { label: 'Clientes únicos', value: '89', icon: Users, color: colors.info, change: '+22%' },
  ];

  const topItems = [
    { name: 'Mole Negro Oaxaqueño', orders: 45, revenue: '$8,325' },
    { name: 'Tlayuda Tradicional', orders: 38, revenue: '$5,510' },
    { name: 'Empanadas de Amarillo', orders: 32, revenue: '$2,080' },
    { name: 'Agua de Chilacayota', orders: 28, revenue: '$980' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Estadísticas</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Resumen del rendimiento</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <Card key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <s.icon size={20} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
              <Text style={[styles.statChange, { color: colors.success }]}>{s.change}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🏆 Platillos más vendidos</Text>
          <Card>
            {topItems.map((item, i) => (
              <View key={i} style={[styles.topItemRow, i < topItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                <View style={[styles.rank, { backgroundColor: i === 0 ? colors.star + '20' : colors.card }]}>
                  <Text style={[styles.rankText, { color: i === 0 ? colors.star : colors.textTertiary }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.topItemName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.topItemMeta, { color: colors.textTertiary }]}>{item.orders} pedidos</Text>
                </View>
                <Text style={[styles.topItemRevenue, { color: colors.roleRestaurante }]}>{item.revenue}</Text>
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
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  subtitle: { fontSize: FONT_SIZE.md, marginTop: SPACING.xs },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.xl, gap: SPACING.md },
  statCard: { width: '47%', alignItems: 'center' },
  statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statValue: { fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold },
  statLabel: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  statChange: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, marginTop: SPACING.xs },
  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING['2xl'] },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  topItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, gap: SPACING.md },
  rank: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold },
  topItemName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  topItemMeta: { fontSize: FONT_SIZE.xs, marginTop: 2 },
  topItemRevenue: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
});
