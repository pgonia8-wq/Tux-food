import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, ClipboardList, UtensilsCrossed, BarChart3, User } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

export default function RestauranteLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.roleRestaurante,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Pedidos', tabBarIcon: ({ color, size }) => <ClipboardList size={size} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: 'Menú', tabBarIcon: ({ color, size }) => <UtensilsCrossed size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Estadísticas', tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}
