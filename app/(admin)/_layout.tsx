import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Store, Users, Settings } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

export default function AdminLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.roleAdmin,
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
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <LayoutDashboard size={size} color={color} /> }} />
      <Tabs.Screen name="restaurants" options={{ title: 'Restaurantes', tabBarIcon: ({ color, size }) => <Store size={size} color={color} /> }} />
      <Tabs.Screen name="users" options={{ title: 'Usuarios', tabBarIcon: ({ color, size }) => <Users size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'Config', tabBarIcon: ({ color, size }) => <Settings size={size} color={color} /> }} />
    </Tabs>
  );
}
