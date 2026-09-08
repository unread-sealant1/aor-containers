-- Migration: Initial Admin & Order Management System Setup
-- Date: 2026-08-25

BEGIN;

-- 1. Expand Products Table (Containers)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS price NUMERIC(12, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sale_price NUMERIC(12, 2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'ZAR',
ADD COLUMN IF NOT EXISTS pricing_type TEXT DEFAULT 'fixed', -- 'fixed' or 'on_request'
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT 'in_stock', -- 'in_stock', 'low_stock', 'out_of_stock', 'coming_soon', 'discontinued'
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'; -- 'active', 'inactive', 'discontinued'

-- 2. Container Categories
CREATE TABLE IF NOT EXISTS container_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Add category_id to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES container_categories(id);

-- 3. Container Images
CREATE TABLE IF NOT EXISTS container_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id UUID REFERENCES products(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Container Specifications
CREATE TABLE IF NOT EXISTS container_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    container_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spec_key TEXT NOT NULL,
    spec_value TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    company TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'DECLINED', 'CANCELLED', 'COMPLETED'
    payment_status TEXT DEFAULT 'pending',
    payment_reference TEXT,
    payment_amount NUMERIC(12, 2),
    payment_confirmed_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    approved_by UUID,
    declined_reason TEXT,
    declined_at TIMESTAMPTZ,
    declined_by UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Order Items
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    container_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Order Status History
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID,
    note TEXT,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 9. Admin Roles
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY, -- Should match Supabase auth.users.id
    role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'super_admin'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id),
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    description TEXT,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT now()
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    timestamp TIMESTAMPTZ DEFAULT now()
);

COMMIT;
