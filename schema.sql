-- 1. PRODUCTS & INVENTORY
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  badge TEXT,
  collection_id TEXT,
  image TEXT,
  rating REAL DEFAULT 5.0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  size TEXT NOT NULL,
  price_cents INTEGER NOT NULL, 
  cogs_cents INTEGER NOT NULL,
  stock_level INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fragrance_profiles (
  product_id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  family TEXT NOT NULL CHECK (family IN ('Woody', 'Floral', 'Citrus', 'Amber', 'Fresh', 'Spicy')),
  top_notes TEXT NOT NULL, 
  heart_notes TEXT NOT NULL,
  base_notes TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 2. CRM & CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (tenant_id, email)
);

-- 3. PROMOTIONS
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_shipping')),
  value_cents INTEGER NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at DATETIME,
  is_active INTEGER DEFAULT 1,
  UNIQUE (tenant_id, code)
);

-- 4. ORDERS & FULFILLMENT
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled')),
  total_amount_cents INTEGER NOT NULL,
  discount_amount_cents INTEGER DEFAULT 0,
  promo_id TEXT,
  shipping_address_json TEXT NOT NULL, 
  tracking_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (promo_id) REFERENCES promotions(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  unit_cogs_cents INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- 5. ANALYTICS VIEW
CREATE VIEW IF NOT EXISTS daily_sales_performance AS
WITH order_totals AS (
  SELECT 
    o.id,
    o.tenant_id,
    o.created_at,
    o.total_amount_cents,
    o.discount_amount_cents,
    COALESCE(SUM(oi.unit_cogs_cents * oi.quantity), 0) as total_cogs_cents
  FROM orders o
  JOIN order_items oi ON o.id = o.order_id
  WHERE o.status != 'Canceled'
  GROUP BY o.id, o.tenant_id, o.created_at, o.total_amount_cents, o.discount_amount_cents
)
SELECT 
  tenant_id,
  DATE(created_at) as sale_date,
  COUNT(id) as total_orders,
  SUM(total_amount_cents) as gross_revenue_cents,
  SUM(discount_amount_cents) as total_discounts_cents,
  SUM(total_amount_cents - discount_amount_cents - total_cogs_cents) as net_profit_cents
FROM order_totals
GROUP BY tenant_id, DATE(created_at);
