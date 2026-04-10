import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star, Clock, MapPin } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Badge } from './Badge';
import type { Restaurant } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  compact?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress, compact }) => {
  const { colors } = useTheme();

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.compactCard, { backgroundColor: colors.card, borderColor: colors.borderLight }, SHADOWS.sm]}>
        <Image source={{ uri: restaurant.image_url }} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={[styles.compactName, { color: colors.text }]} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingRow}>
            <Star size={12} color={colors.star} fill={colors.star} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>{restaurant.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.borderLight }, SHADOWS.md]}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        {restaurant.status === 'cerrado' && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Cerrado</Text>
          </View>
        )}
        <View style={styles.deliveryBadge}>
          <Text style={styles.deliveryText}>
            {restaurant.delivery_fee === 0 ? 'Envío gratis' : `Envío ${formatCurrency(restaurant.delivery_fee)}`}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color={colors.star} fill={colors.star} />
            <Text style={[styles.rating, { color: colors.text }]}>{restaurant.rating}</Text>
            <Text style={[styles.reviewCount, { color: colors.textTertiary }]}>({restaurant.review_count})</Text>
          </View>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
          {restaurant.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>{restaurant.estimated_time}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
          <View style={styles.metaItem}>
            <Text style={[styles.metaText, { color: colors.textTertiary }]}>Min. {formatCurrency(restaurant.minimum_order)}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: colors.textTertiary }]} />
          {restaurant.categories.slice(0, 2).map((cat, i) => (
            <Text key={i} style={[styles.metaText, { color: colors.textTertiary }]}>
              {cat}{i < Math.min(restaurant.categories.length, 2) - 1 ? ' · ' : ''}
            </Text>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 180, resizeMode: 'cover' },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedText: { color: '#FFF', fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold },
  deliveryBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  deliveryText: { color: '#FFF', fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },
  info: { padding: SPACING.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xs },
  name: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, flex: 1 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: SPACING.sm },
  rating: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.bold },
  reviewCount: { fontSize: FONT_SIZE.xs },
  description: { fontSize: FONT_SIZE.sm, marginBottom: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FONT_SIZE.xs },
  dot: { width: 3, height: 3, borderRadius: 1.5, marginHorizontal: SPACING.sm },
  compactCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
    width: 160,
    marginRight: SPACING.md,
  },
  compactImage: { width: 160, height: 100, resizeMode: 'cover' },
  compactInfo: { padding: SPACING.sm },
  compactName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold, marginBottom: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: FONT_SIZE.xs },
});
