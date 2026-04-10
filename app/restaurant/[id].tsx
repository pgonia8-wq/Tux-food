import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Clock, MapPin, ShoppingCart, Plus, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { useCartStore } from '../../store/cartStore';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { MOCK_RESTAURANTS, MOCK_MENU_ITEMS, MOCK_MENU_CATEGORIES } from '../../lib/mockData';
import { formatCurrency } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import type { MenuItem } from '../../types';

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();
  const { addItem, getItemCount, restaurant_id, getSubtotal } = useCartStore();

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === id);
  const menuItems = MOCK_MENU_ITEMS.filter((m) => m.restaurant_id === id);
  const categories = MOCK_MENU_CATEGORIES.filter((c) => c.restaurant_id === id);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const cartCount = getItemCount();

  if (!restaurant) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[{ color: colors.text, fontSize: FONT_SIZE.lg }]}>Restaurante no encontrado</Text>
        <Button title="Volver" onPress={() => router.back()} variant="secondary" style={{ marginTop: SPACING.xl }} />
      </View>
    );
  }

  const filteredItems = selectedCategory
    ? menuItems.filter((m) => m.category_id === selectedCategory)
    : menuItems;

  const groupedByCategory = categories.map((cat) => ({
    ...cat,
    items: menuItems.filter((m) => m.category_id === cat.id),
  })).filter((g) => g.items.length > 0);

  const handleAddItem = (item: MenuItem) => {
    if (restaurant_id && restaurant_id !== restaurant.id) {
      Alert.alert(
        'Cambiar restaurante',
        'Ya tienes artículos de otro restaurante. ¿Deseas vaciar tu carrito?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Vaciar y agregar',
            style: 'destructive',
            onPress: () => addItem(item, restaurant.id, restaurant.name),
          },
        ]
      );
      return;
    }
    addItem(item, restaurant.id, restaurant.name);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image_url }} style={styles.heroImage} />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.imageOverlayTop} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.imageOverlayBottom} />
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.likeButton}>
            <Heart size={22} color="#FFF" fill={liked ? '#EF4444' : 'transparent'} />
          </TouchableOpacity>
          <View style={styles.imageInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.ratingRow}>
              <Star size={16} color="#FACC15" fill="#FACC15" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewCount}>({restaurant.review_count} reseñas)</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{restaurant.description}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaChip, { backgroundColor: colors.primaryLight }]}>
              <Clock size={14} color={colors.primary} />
              <Text style={[styles.metaChipText, { color: colors.primary }]}>{restaurant.estimated_time}</Text>
            </View>
            <View style={[styles.metaChip, { backgroundColor: colors.successLight }]}>
              <Text style={[styles.metaChipText, { color: colors.success }]}>
                {restaurant.delivery_fee === 0 ? 'Envío gratis' : `Envío ${formatCurrency(restaurant.delivery_fee)}`}
              </Text>
            </View>
            <View style={[styles.metaChip, { backgroundColor: colors.infoLight }]}>
              <Text style={[styles.metaChipText, { color: colors.info }]}>Min. {formatCurrency(restaurant.minimum_order)}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Text style={[styles.menuTitle, { color: colors.text }]}>Menú</Text>

        {categories.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[styles.catChip, !selectedCategory && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.catChipText, { color: !selectedCategory ? '#FFF' : colors.textSecondary }]}>Todo</Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: selectedCategory === cat.id ? colors.primary : colors.card,
                    borderColor: colors.borderLight,
                  },
                  selectedCategory !== cat.id && { borderWidth: 1 },
                ]}
              >
                <Text style={[styles.catChipText, { color: selectedCategory === cat.id ? '#FFF' : colors.textSecondary }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {selectedCategory
          ? filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} colors={colors} onAdd={() => handleAddItem(item)} />
            ))
          : groupedByCategory.map((group) => (
              <View key={group.id} style={styles.categoryGroup}>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{group.name}</Text>
                {group.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} colors={colors} onAdd={() => handleAddItem(item)} />
                ))}
              </View>
            ))}
      </ScrollView>

      {cartCount > 0 && restaurant_id === restaurant.id && (
        <View style={[styles.cartBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Button
            title={`Ver carrito (${cartCount}) · ${formatCurrency(getSubtotal())}`}
            onPress={() => router.push('/cart' as any)}
            fullWidth
            size="lg"
          />
        </View>
      )}
    </View>
  );
}

function MenuItemCard({ item, colors, onAdd }: { item: MenuItem; colors: any; onAdd: () => void }) {
  return (
    <View style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.borderLight }]}>
      <View style={styles.menuItemInfo}>
        <Text style={[styles.menuItemName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.menuItemDesc, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={[styles.menuItemPrice, { color: colors.primary }]}>{formatCurrency(item.price)}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />}
        <TouchableOpacity
          onPress={onAdd}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Plus size={18} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: { position: 'relative', height: 280 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlayTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 100 },
  imageOverlayBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  backButton: {
    position: 'absolute', top: 50, left: SPACING.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  likeButton: {
    position: 'absolute', top: 50, right: SPACING.lg,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center',
  },
  imageInfo: { position: 'absolute', bottom: SPACING.lg, left: SPACING.xl },
  restaurantName: { color: '#FFF', fontSize: FONT_SIZE['2xl'], fontWeight: FONT_WEIGHT.bold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: SPACING.xs },
  ratingText: { color: '#FFF', fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  reviewCount: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.sm },
  infoSection: { padding: SPACING.xl },
  description: { fontSize: FONT_SIZE.md, lineHeight: 22, marginBottom: SPACING.lg },
  metaRow: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  metaChipText: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },
  divider: { height: 8, marginHorizontal: 0 },
  menuTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.sm },
  categoryScroll: { paddingHorizontal: SPACING.xl, gap: SPACING.sm, paddingBottom: SPACING.md },
  catChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  catChipText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  categoryGroup: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.lg },
  categoryTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md, marginTop: SPACING.md },
  menuItem: {
    flexDirection: 'row', padding: SPACING.lg, marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md, borderRadius: RADIUS.xl, borderWidth: 1,
  },
  menuItemInfo: { flex: 1, marginRight: SPACING.md },
  menuItemName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold, marginBottom: 4 },
  menuItemDesc: { fontSize: FONT_SIZE.sm, lineHeight: 18, marginBottom: SPACING.sm },
  menuItemPrice: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  menuItemRight: { alignItems: 'flex-end' },
  menuItemImage: { width: 80, height: 80, borderRadius: RADIUS.lg, marginBottom: SPACING.sm },
  addBtn: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: SPACING.xl, paddingBottom: SPACING['3xl'],
    borderTopWidth: 1,
  },
});
