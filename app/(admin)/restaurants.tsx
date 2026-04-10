import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { CheckCircle, XCircle, Star, Clock } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_RESTAURANTS } from '../../lib/mockData';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function AdminRestaurantsScreen() {
  const { colors } = useTheme();
  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [tab, setTab] = useState<'approved' | 'pending'>('pending');

  const pending = restaurants.filter((r) => !r.is_approved);
  const approved = restaurants.filter((r) => r.is_approved);

  const handleApprove = (id: string) => {
    setRestaurants((prev) => prev.map((r) => r.id === id ? { ...r, is_approved: true } : r));
  };

  const handleReject = (id: string) => {
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Restaurantes</Text>
      </View>

      <View style={styles.tabRow}>
        {(['pending', 'approved'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && { borderBottomColor: colors.roleAdmin, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.roleAdmin : colors.textTertiary }]}>
              {t === 'pending' ? `Pendientes (${pending.length})` : `Aprobados (${approved.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {(tab === 'pending' ? pending : approved).map((rest) => (
          <Card key={rest.id} style={styles.restCard}>
            <View style={styles.restRow}>
              <Image source={{ uri: rest.image_url }} style={styles.restImage} />
              <View style={styles.restInfo}>
                <Text style={[styles.restName, { color: colors.text }]}>{rest.name}</Text>
                <Text style={[styles.restAddress, { color: colors.textSecondary }]} numberOfLines={1}>{rest.address}</Text>
                <View style={styles.restMeta}>
                  <Star size={12} color={colors.star} fill={colors.star} />
                  <Text style={[styles.restRating, { color: colors.textSecondary }]}>{rest.rating}</Text>
                  <Text style={[styles.restCategories, { color: colors.textTertiary }]}>{rest.categories.join(', ')}</Text>
                </View>
              </View>
            </View>
            {tab === 'pending' && (
              <View style={styles.actionRow}>
                <Button title="Aprobar" onPress={() => handleApprove(rest.id)} size="sm" icon={<CheckCircle size={16} color="#FFF" />} style={{ flex: 1, backgroundColor: colors.success }} />
                <Button title="Rechazar" onPress={() => handleReject(rest.id)} variant="danger" size="sm" icon={<XCircle size={16} color={colors.error} />} style={{ flex: 1 }} />
              </View>
            )}
            {tab === 'approved' && (
              <Badge
                label={rest.status === 'abierto' ? 'Abierto' : 'Cerrado'}
                color={rest.status === 'abierto' ? colors.success : colors.error}
                size="sm"
              />
            )}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  tabRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl },
  tab: { flex: 1, alignItems: 'center', paddingBottom: SPACING.md },
  tabText: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  restCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.md },
  restRow: { flexDirection: 'row', marginBottom: SPACING.md },
  restImage: { width: 64, height: 64, borderRadius: RADIUS.lg, marginRight: SPACING.md },
  restInfo: { flex: 1 },
  restName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  restAddress: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  restMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs },
  restRating: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.bold },
  restCategories: { fontSize: FONT_SIZE.xs },
  actionRow: { flexDirection: 'row', gap: SPACING.sm },
});
