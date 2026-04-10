import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Order, OrderStatus } from '../types';
import { generateId } from '../lib/utils';

interface OrdersState {
  orders: Order[];

  createOrder: (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => string;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDriver: (orderId: string, driverId: string, driverName: string) => void;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByRestaurant: (restaurantId: string) => Order[];
  getOrdersByDriver: (driverId: string) => Order[];
  getOrderById: (orderId: string) => Order | undefined;
  getActiveOrders: () => Order[];
  getAllOrders: () => Order[];
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (orderData) => {
        const id = generateId();
        const now = new Date().toISOString();
        const order: Order = {
          ...orderData,
          id,
          created_at: now,
          updated_at: now,
        };
        set({ orders: [order, ...get().orders] });
        return id;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status, updated_at: new Date().toISOString() } : o
          ),
        });
      },

      assignDriver: (orderId, driverId, driverName) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId
              ? { ...o, driver_id: driverId, driver_name: driverName, updated_at: new Date().toISOString() }
              : o
          ),
        });
      },

      getOrdersByCustomer: (customerId) =>
        get().orders.filter((o) => o.customer_id === customerId),

      getOrdersByRestaurant: (restaurantId) =>
        get().orders.filter((o) => o.restaurant_id === restaurantId),

      getOrdersByDriver: (driverId) =>
        get().orders.filter((o) => o.driver_id === driverId),

      getOrderById: (orderId) =>
        get().orders.find((o) => o.id === orderId),

      getActiveOrders: () =>
        get().orders.filter((o) => !['entregado', 'cancelado'].includes(o.status)),

      getAllOrders: () => get().orders,
    }),
    {
      name: 'tux-food-orders',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
