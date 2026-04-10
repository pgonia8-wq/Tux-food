import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments, useNavigationContainerRef } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { isAuthenticated, user } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationRef?.isReady) {
      setIsReady(true);
    }
  }, [navigationRef?.isReady]);

  useEffect(() => {
    if (!isReady) return;

    const inAuth = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)');
    } else if (isAuthenticated && user) {
      const roleGroup = `(${user.role})` as const;
      const currentGroup = segments[0];
      if (inAuth || !currentGroup || currentGroup !== roleGroup) {
        router.replace(`/${roleGroup}` as any);
      }
    }
  }, [isAuthenticated, user?.role, isReady, segments[0]]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Slot />
    </>
  );
}
