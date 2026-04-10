export type UserRole = 'cliente' | 'restaurante' | 'repartidor' | 'admin';

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'preparando'
  | 'listo'
  | 'en_camino'
  | 'entregado'
  | 'cancelado';

export type PaymentMethod = 'mercado_pago' | 'efectivo' | 'tarjeta';
export type PaymentStatus = 'pendiente' | 'pagado' | 'fallido' | 'reembolsado';
export type DeliveryStatus = 'asignado' | 'en_restaurante' | 'recogido' | 'en_camino' | 'entregado';
export type RestaurantStatus = 'abierto' | 'cerrado' | 'pausado';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  rating: number;
  review_count: number;
  is_approved: boolean;
  image_url: string;
  logo_url: string | null;
  opening_hours: Record<string, { open: string; close: string }>;
  delivery_fee: number;
  minimum_order: number;
  estimated_time: string;
  status: RestaurantStatus;
  categories: string[];
  created_at: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  ingredients: string[];
  modifiers?: MenuModifier[];
}

export interface MenuModifier {
  id: string;
  name: string;
  options: { label: string; price: number }[];
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  notes: string;
  modifiers: Record<string, string>;
  restaurant_id: string;
  restaurant_name: string;
}

export interface Order {
  id: string;
  customer_id: string;
  restaurant_id: string;
  restaurant_name: string;
  restaurant_image: string;
  driver_id: string | null;
  driver_name: string | null;
  status: OrderStatus;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  subtotal: number;
  address: string;
  lat: number;
  lng: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes: string;
  estimated_time: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  menu_item_id: string;
  name: string;
  quantity: number;
  notes: string;
  price_at_time: number;
  modifiers: Record<string, string>;
}

export interface Delivery {
  id: string;
  order_id: string;
  order: Order;
  driver_id: string;
  status: DeliveryStatus;
  current_lat: number;
  current_lng: number;
  pickup_address: string;
  delivery_address: string;
  estimated_time: string;
  distance: string;
  earnings: number;
  started_at: string | null;
  completed_at: string | null;
}

export interface Review {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name: string;
  restaurant_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  mercado_pago_id: string | null;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  created_at: string;
}

export interface GlobalCategory {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  address: string;
  lat: number;
  lng: number;
  is_default: boolean;
}

export interface Stats {
  total_orders: number;
  total_revenue: number;
  avg_rating: number;
  total_delivered: number;
  pending_orders: number;
  active_restaurants: number;
  active_drivers: number;
  total_users: number;
}
