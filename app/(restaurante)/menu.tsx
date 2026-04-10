import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { Plus, Edit3, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { MOCK_MENU_ITEMS, MOCK_MENU_CATEGORIES } from '../../lib/mockData';
import { formatCurrency } from '../../lib/utils';
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from '../../constants/theme';

export default function MenuManagementScreen() {
  const { colors } = useTheme();
  const categories = MOCK_MENU_CATEGORIES.filter((c) => c.restaurant_id === 'rest_01');
  const [items, setItems] = useState(MOCK_MENU_ITEMS.filter((m) => m.restaurant_id === 'rest_01'));

  const toggleAvailability = (itemId: string) => {
    setItems((prev) => prev.map((i) => i.id === itemId ? { ...i, is_available: !i.is_available } : i));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerPad}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Mi Menú</Text>
          <Button title="Agregar" onPress={() => {}} size="sm" icon={<Plus size={16} color="#FFF" />} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category_id === cat.id);
          return (
            <View key={cat.id} style={styles.categorySection}>
              <Text style={[styles.categoryTitle, { color: colors.text }]}>{cat.name}</Text>
              {catItems.map((item) => (
                <Card key={item.id} style={styles.menuItemCard}>
                  <View style={styles.menuItemRow}>
                    {item.image_url && <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />}
                    <View style={styles.menuItemInfo}>
                      <Text style={[styles.menuItemName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.menuItemDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.description}
                      </Text>
                      <Text style={[styles.menuItemPrice, { color: colors.roleRestaurante }]}>
                        {formatCurrency(item.price)}
                      </Text>
                    </View>
                    <View style={styles.menuItemActions}>
                      <Switch
                        value={item.is_available}
                        onValueChange={() => toggleAvailability(item.id)}
                        trackColor={{ false: colors.border, true: colors.roleRestaurante + '50' }}
                        thumbColor={item.is_available ? colors.roleRestaurante : colors.textTertiary}
                      />
                      <View style={styles.actionBtns}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.infoLight }]}>
                          <Edit3 size={14} color={colors.info} />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.errorLight }]}>
                          <Trash2 size={14} color={colors.error} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerPad: { paddingTop: 56, paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: FONT_SIZE['3xl'], fontWeight: FONT_WEIGHT.bold },
  categorySection: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.xl },
  categoryTitle: { fontSize: FONT_SIZE.lg, fontWeight: FONT_WEIGHT.bold, marginBottom: SPACING.md },
  menuItemCard: { marginBottom: SPACING.sm },
  menuItemRow: { flexDirection: 'row', alignItems: 'center' },
  menuItemImage: { width: 60, height: 60, borderRadius: RADIUS.md, marginRight: SPACING.md },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.semibold },
  menuItemDesc: { fontSize: FONT_SIZE.sm, marginVertical: 2 },
  menuItemPrice: { fontSize: FONT_SIZE.md, fontWeight: FONT_WEIGHT.bold },
  menuItemActions: { alignItems: 'flex-end', gap: SPACING.sm },
  actionBtns: { flexDirection: 'row', gap: SPACING.xs },
  actionBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});
