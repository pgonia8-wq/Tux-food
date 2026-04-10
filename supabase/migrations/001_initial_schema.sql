-- Tux Food - Schema completo para Supabase
-- Ejecuta este archivo en el SQL Editor de Supabase

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('cliente', 'restaurante', 'repartidor', 'admin');
CREATE TYPE order_status AS ENUM ('pendiente', 'confirmado', 'preparando', 'listo', 'en_camino', 'entregado', 'cancelado');
CREATE TYPE payment_method AS ENUM ('mercado_pago', 'efectivo', 'tarjeta');
CREATE TYPE payment_status AS ENUM ('pendiente', 'pagado', 'fallido', 'reembolsado');
CREATE TYPE delivery_status AS ENUM ('asignado', 'en_restaurante', 'recogido', 'en_camino', 'entregado');
CREATE TYPE restaurant_status AS ENUM ('abierto', 'cerrado', 'pausado');

-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role user_role NOT NULL DEFAULT 'cliente',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurants
CREATE TABLE restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  phone TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  logo_url TEXT,
  opening_hours JSONB DEFAULT '{}',
  delivery_fee NUMERIC(10,2) DEFAULT 25,
  minimum_order NUMERIC(10,2) DEFAULT 50,
  estimated_time TEXT DEFAULT '25-35 min',
  status restaurant_status DEFAULT 'cerrado',
  categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Categories
CREATE TABLE global_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories
CREATE TABLE menu_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES menu_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  ingredients TEXT[] DEFAULT '{}',
  modifiers JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  driver_id UUID REFERENCES profiles(id),
  status order_status DEFAULT 'pendiente',
  total_amount NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) DEFAULT 0,
  subtotal NUMERIC(10,2) NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pendiente',
  notes TEXT,
  estimated_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  menu_item_id UUID REFERENCES menu_items(id),
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  price_at_time NUMERIC(10,2) NOT NULL,
  modifiers JSONB DEFAULT '{}'
);

-- Deliveries
CREATE TABLE deliveries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) NOT NULL,
  status delivery_status DEFAULT 'asignado',
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  estimated_time TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  mercado_pago_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  status payment_status DEFAULT 'pendiente',
  method payment_method NOT NULL,
  webhook_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES profiles(id) NOT NULL,
  restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved Addresses
CREATE TABLE saved_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- Row Level Security
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_addresses ENABLE ROW LEVEL SECURITY;

-- Profiles: users see own + basic info of others, admin sees all
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_basic" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Restaurants: everyone reads approved, owners manage their own, admins manage all
CREATE POLICY "restaurants_select_approved" ON restaurants FOR SELECT USING (is_approved = true OR owner_id = auth.uid());
CREATE POLICY "restaurants_insert" ON restaurants FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "restaurants_update_owner" ON restaurants FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "restaurants_admin_all" ON restaurants FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Global Categories: everyone reads, admin manages
CREATE POLICY "categories_select" ON global_categories FOR SELECT USING (true);
CREATE POLICY "categories_admin" ON global_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Menu Categories: everyone reads, restaurant owner manages
CREATE POLICY "menu_categories_select" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "menu_categories_owner" ON menu_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);

-- Menu Items: everyone reads, restaurant owner manages
CREATE POLICY "menu_items_select" ON menu_items FOR SELECT USING (true);
CREATE POLICY "menu_items_owner" ON menu_items FOR ALL USING (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);

-- Orders: customer sees own, restaurant sees theirs, driver sees assigned, admin sees all
CREATE POLICY "orders_customer" ON orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "orders_restaurant" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "orders_driver" ON orders FOR SELECT USING (driver_id = auth.uid());
CREATE POLICY "orders_admin" ON orders FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "orders_insert_customer" ON orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "orders_update_restaurant" ON orders FOR UPDATE
  USING (EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM restaurants WHERE id = restaurant_id AND owner_id = auth.uid()));
CREATE POLICY "orders_update_driver" ON orders FOR UPDATE
  USING (driver_id = auth.uid())
  WITH CHECK (driver_id = auth.uid());

-- Order Items: follow order access (customer, driver, restaurant owner, admin)
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o
    LEFT JOIN restaurants r ON o.restaurant_id = r.id
    WHERE o.id = order_id
    AND (o.customer_id = auth.uid() OR o.driver_id = auth.uid() OR r.owner_id = auth.uid())
  )
);
CREATE POLICY "order_items_admin" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);

-- Deliveries: driver sees own, restaurant owner sees related
CREATE POLICY "deliveries_driver" ON deliveries FOR ALL USING (driver_id = auth.uid());
CREATE POLICY "deliveries_select_restaurant" ON deliveries FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders o JOIN restaurants r ON o.restaurant_id = r.id WHERE o.id = order_id AND r.owner_id = auth.uid())
);

-- Payments: customer and admin see
CREATE POLICY "payments_customer" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND customer_id = auth.uid())
);
CREATE POLICY "payments_admin" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Reviews: everyone reads, customer creates
CREATE POLICY "reviews_select" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (customer_id = auth.uid());

-- Saved Addresses: user manages own
CREATE POLICY "addresses_own" ON saved_addresses FOR ALL USING (user_id = auth.uid());

-- =====================
-- Indexes
-- =====================

CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_approved ON restaurants(is_approved);
CREATE INDEX idx_restaurants_status ON restaurants(status);
CREATE INDEX idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_driver ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_deliveries_driver ON deliveries(driver_id);
CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);

-- =====================
-- Functions
-- =====================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE restaurant_id = NEW.restaurant_id),
      review_count = (SELECT COUNT(*) FROM reviews WHERE restaurant_id = NEW.restaurant_id)
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_rating AFTER INSERT ON reviews FOR EACH ROW EXECUTE FUNCTION update_restaurant_rating();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
