import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { TrendingUp, Clock } from 'lucide-react-native';
import { SearchBar } from '../../components/ui/SearchBar';
import { RestaurantCard } from '../../components/ui/RestaurantCard';
import { useTheme } from '../../hooks/useTheme';
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS } from '../../lib/mockData';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';
import { formatCurrency } from '../../lib/utils';

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'delivery' | 'price'>('rating');

  const approved = MOCK_RESTAURANTS.filter((r) => r.is_approved);

  const matchedRestaurants = search
    ? approved.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const matchedItems = search
    ? MOCK_MENU_ITEMS.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const sorted = [...matchedRestaurants].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'delivery') return a.delivery_fee - b.delivery_fee;
    return a.minimum_order - b.minimum_order;
  });

  const trending = ['Tacos al Pastor', 'Hamburguesas', 'Sushi', 'Mole Negro', 'Pizza', 'Mariscos'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <Text style={[styles.title, { color: colors.text }]}>Buscar</Text>
      </View>
      <View style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg }}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar restaurantes, platillos..." autoFocus />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {!search && (
          <View style={{ paddingHorizontal: SPACING.xl }}>
            <View style={styles.sectionRow}>
              <TrendingUp size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tendencias</Text>
            </View>
            <View style={styles.trendingGrid}>
              {trending.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setSearch(t)}
                  style={[styles.trendingChip, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
                >
                  <Text style={[styles.trendingText, { color: colors.text }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {search && (
          <>
            <View style={styles.sortRow}>
              {(['rating', 'delivery', 'price'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSortBy(s)}
                  style={[styles.sortChip, { backgroundColor: sortBy === s ? colors.primary : colors.card, borderColor: colors.borderLight }, sortBy !== s && { borderWidth: 1 }]}
                >
                  <Text style={[styles.sortText, { color: sortBy === s ? '#FFF' : colors.textSecondary }]}>
                    {s === 'rating' ? '⭐ Rating' : s === 'delivery' ? '🚗 Envío' : '💰 Precio'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {matchedItems.length > 0 && (
              <View style={{ paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl }}>
                <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: SPACING.md }]}>
                  Platillos ({matchedItems.length})
                </Text>
                {matchedItems.slice(0, 5).map((item) => {
                  const rest = MOCK_RESTAURANTS.find((r) => r.id === item.restaurant_id);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => router.push(`/restaurant/${item.restaurant_id}` as any)}
                      style={[styles.menuItemRow, { backgroundColor: colors.card, borderColor: colors.borderLight }]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.menuItemName, { color: colors.text }]}>{item.name}</Text>
                        <Text style={[styles.menuItemRest, { color: colors.textSecondary }]}>{rest?.name}</Text>
                      </View>
                      <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{formatCurrency(item.price)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={{ paddingHorizontal: SPACING.xl }}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: SPACING.md }]}>
                Restaurantes ({sorted.length})
              </Text>
              {sorted.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} onPress={() => router.push(`/restaurant/${r.id}` as any)} />
              ))}
            </View>

            {sorted.length === 0 && matchedItems.length === 0 && (
              <View style={styles.empty}>
                <Text style={{ fontSize: 48 }}>🔍</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Sin resultados para "{search}"
                </Text>
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
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  trendingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  trendingChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, borderRadius: RADIUS.full, borderWidth: 1 },
  trendingText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },
  sortRow: { flexDirection: 'row', paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.xl },
  sortChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  sortText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },
  menuItemRow: {
    flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm, borderWidth: 1,
  },
  menuItemName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  menuItemRest: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  menuItemPrice: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  empty: { alignItems: 'center', paddingVertical: SPACING['5xl'] },
  emptyText: { fontSize: FONT_SIZE.md, marginTop: SPACING.md },
});
