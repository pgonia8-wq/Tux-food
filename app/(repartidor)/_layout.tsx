import React from 'react';
import { Tabs } from 'expo-router';
import { Bike, Navigation, History, DollarSign, User } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT } from '../../constants/theme';

export default function RepartidorLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.roleRepartidor,
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
      <Tabs.Screen name="index" options={{ title: 'Disponibles', tabBarIcon: ({ color, size }) => <Bike size={size} color={color} /> }} />
      <Tabs.Screen name="active" options={{ title: 'En curso', tabBarIcon: ({ color, size }) => <Navigation size={size} color={color} /> }} />
      <Tabs.Screen name="earnings" options={{ title: 'Ganancias', tabBarIcon: ({ color, size }) => <DollarSign size={size} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color, size }) => <User size={size} color={color} /> }} />
    </Tabs>
  );
}
