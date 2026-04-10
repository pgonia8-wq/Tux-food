import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, ShoppingCart, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { SearchBar } from '../../components/ui/SearchBar';
import { RestaurantCard } from '../../components/ui/RestaurantCard';
import { Avatar } from '../../components/ui/Avatar';
import { MOCK_RESTAURANTS } from '../../lib/mockData';
import { FOOD_CATEGORIES } from '../../lib/constants';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import type { Restaurant } from '../../types';

export default function ClienteHomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { user } = useAuthStore();
  const cartCount = useCartStore((s) => s.getItemCount());

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const approvedRestaurants = MOCK_RESTAURANTS.filter((r) => r.is_approved);

  const filtered = approvedRestaurants.filter((r) => {
    const matchesSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || r.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const openRestaurants = filtered.filter((r) => r.status === 'abierto');
  const closedRestaurants = filtered.filter((r) => r.status !== 'abierto');
  const topRated = [...approvedRestaurants].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const goToRestaurant = (id: string) => router.push(`/restaurant/${id}` as any);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.topBar}>
          <View style={styles.locationRow}>
            <MapPin size={18} color="rgba(255,255,255,0.9)" />
            <View style={{ marginLeft: SPACING.sm }}>
              <Text style={styles.deliverTo}>Entregar en</Text>
              <Text style={styles.address}>Centro, Tuxtepec</Text>
            </View>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cart' as any)} style={styles.iconBtn}>
              <ShoppingCart size={22} color="#FFF" />
              {cartCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.greeting}>Hola, {user?.full_name?.split(' ')[0]} 👋</Text>
        <Text style={styles.heroQuestion}>¿Qué se te antoja hoy?</Text>
      </LinearGradient>

      <View style={styles.searchWrap}>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Buscar restaurante o platillo..." />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          <TouchableOpacity
            onPress={() => setSelectedCategory(null)}
            style={[styles.categoryChip, !selectedCategory && { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.categoryChipText, !selectedCategory && { color: '#FFF' }]}>Todos</Text>
          </TouchableOpacity>
          {FOOD_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              style={[
                styles.categoryChip,
                { backgroundColor: selectedCategory === cat.name ? colors.primary : colors.card, borderColor: colors.borderLight },
                selectedCategory !== cat.name && { borderWidth: 1 },
              ]}
            >
              <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryChipText,
                  { color: selectedCategory === cat.name ? '#FFF' : colors.text },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {!search && !selectedCategory && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>🔥 Populares</Text>
            </View>
            <FlatList
              data={topRated}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: SPACING.xl }}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <RestaurantCard restaurant={item} onPress={() => goToRestaurant(item.id)} compact />
              )}
            />
          </>
        )}

        <View style={[styles.sectionHeader, { marginTop: SPACING['2xl'] }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {selectedCategory ? `📂 ${selectedCategory}` : '🍽️ Restaurantes'}
          </Text>
          <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>{openRestaurants.length} abiertos</Text>
        </View>

        <View style={styles.restaurantList}>
          {openRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onPress={() => goToRestaurant(r.id)} />
          ))}
          {closedRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onPress={() => goToRestaurant(r.id)} />
          ))}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No se encontraron resultados</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    paddingTop: 56,
    paddingBottom: SPACING['2xl'],
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  deliverTo: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.xs },
  address: { color: '#FFF', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  topRight: { flexDirection: 'row', gap: SPACING.md },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  cartBadge: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', width: 20, height: 20,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { color: '#FFF', fontSize: 11, fontWeight: FONT_WEIGHT.bold },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: FONT_SIZE.md, marginBottom: SPACING.xs },
  heroQuestion: { color: '#FFF', fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold },
  searchWrap: { marginTop: -22, paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },
  categoryScroll: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, gap: SPACING.sm },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.full, gap: SPACING.xs,
  },
  categoryEmoji: { fontSize: 16 },
  categoryChipText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.xl, marginBottom: SPACING.md, marginTop: SPACING.sm,
  },
  sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  sectionCount: { fontSize: FONT_SIZE.sm },
  restaurantList: { paddingHorizontal: SPACING.xl },
  emptyState: { alignItems: 'center', paddingVertical: SPACING['5xl'] },
  emptyEmoji: { fontSize: 48, marginBottom: SPACING.md },
  emptyText: { fontSize: FONT_SIZE.md },
});
