import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Profile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateId } from '../lib/utils';

interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; full_name: string; phone: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => void;
}

const DEMO_ACCOUNTS: Record<string, Profile> = {
  'cliente@test.com': {
    id: 'usr_cliente_01',
    role: 'cliente',
    full_name: 'Carlos Mendoza',
    email: 'cliente@test.com',
    phone: '+52 287 123 4567',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  'restaurante@test.com': {
    id: 'usr_rest_01',
    role: 'restaurante',
    full_name: 'María García',
    email: 'restaurante@test.com',
    phone: '+52 287 234 5678',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  'repartidor@test.com': {
    id: 'usr_driver_01',
    role: 'repartidor',
    full_name: 'Juan López',
    email: 'repartidor@test.com',
    phone: '+52 287 345 6789',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
  'admin@test.com': {
    id: 'usr_admin_01',
    role: 'admin',
    full_name: 'Ana Martínez',
    email: 'admin@test.com',
    phone: '+52 287 456 7890',
    avatar_url: null,
    created_at: new Date().toISOString(),
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true });

        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          set({ user: profile, isAuthenticated: true, isLoading: false });
          return { success: true };
        }

        const demoUser = DEMO_ACCOUNTS[email.toLowerCase()];
        if (demoUser) {
          set({ user: demoUser, isAuthenticated: true, isLoading: false });
          return { success: true };
        }

        set({ isLoading: false });
        return { success: false, error: 'Credenciales inválidas' };
      },

      register: async (data) => {
        set({ isLoading: true });

        if (isSupabaseConfigured()) {
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.full_name,
                role: data.role,
                phone: data.phone,
              },
            },
          });
          if (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
          }
          const profile: Profile = {
            id: authData.user!.id,
            role: data.role,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            avatar_url: null,
            created_at: new Date().toISOString(),
          };
          set({ user: profile, isAuthenticated: true, isLoading: false });
          return { success: true };
        }

        const profile: Profile = {
          id: generateId(),
          role: data.role,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          avatar_url: null,
          created_at: new Date().toISOString(),
        };
        set({ user: profile, isAuthenticated: true, isLoading: false });
        return { success: true };
      },

      logout: async () => {
        if (isSupabaseConfigured()) {
          await supabase.auth.signOut();
        }
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'tux-food-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
