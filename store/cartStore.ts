import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem, MenuItem } from '../types';

interface CartState {
  items: CartItem[];
  restaurant_id: string | null;
  restaurant_name: string | null;

  addItem: (item: MenuItem, restaurant_id: string, restaurant_name: string, notes?: string, modifiers?: Record<string, string>) => void;
  removeItem: (menu_item_id: string) => void;
  updateQuantity: (menu_item_id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurant_id: null,
      restaurant_name: null,

      addItem: (item, restaurant_id, restaurant_name, notes = '', modifiers = {}) => {
        const state = get();

        if (state.restaurant_id && state.restaurant_id !== restaurant_id) {
          set({ items: [], restaurant_id: null, restaurant_name: null });
        }

        const existingIndex = state.items.findIndex(
          (ci) => ci.menu_item.id === item.id && JSON.stringify(ci.modifiers) === JSON.stringify(modifiers)
        );

        if (existingIndex >= 0) {
          const newItems = [...get().items];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + 1,
          };
          set({ items: newItems });
        } else {
          set({
            items: [...get().items, { menu_item: item, quantity: 1, notes, modifiers, restaurant_id, restaurant_name }],
            restaurant_id,
            restaurant_name,
          });
        }
      },

      removeItem: (menu_item_id) => {
        const newItems = get().items.filter((i) => i.menu_item.id !== menu_item_id);
        if (newItems.length === 0) {
          set({ items: [], restaurant_id: null, restaurant_name: null });
        } else {
          set({ items: newItems });
        }
      },

      updateQuantity: (menu_item_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menu_item_id);
          return;
        }
        const newItems = get().items.map((i) =>
          i.menu_item.id === menu_item_id ? { ...i, quantity } : i
        );
        set({ items: newItems });
      },

      clearCart: () => set({ items: [], restaurant_id: null, restaurant_name: null }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.menu_item.price * i.quantity, 0),
    }),
    {
      name: 'tux-food-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
