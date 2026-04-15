-- ============================================================================
-- FILE: 002_schema.sql
-- PURPOSE: Al Asly B2B Product Middleware - PostgreSQL Schema
-- TABLES: 11 core tables with relationships, indexes, and triggers
-- ============================================================================

-- ============================================================================
-- TABLE: users
-- COLUMNS: id, email, password_hash, full_name, role, whatsapp_number, etc.
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'seller',
  whatsapp_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- TABLE: categories
-- COLUMNS: Hierarchical category structure with parent_id for subcategories
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ============================================================================
-- TABLE: colors
-- COLUMNS: Master color palette with hex codes for product variations
-- ============================================================================
CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  hex_code VARCHAR(7),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_colors_hex ON colors(hex_code);

-- ============================================================================
-- TABLE: click_products
-- COLUMNS: Read-only mirror from Click ERP, synced 6-12 hourly
-- ============================================================================
CREATE TABLE IF NOT EXISTS click_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  name_ar VARCHAR(500),
  price NUMERIC(12,2),
  stock_quantity INTEGER DEFAULT 0,
  factory VARCHAR(255),
  unit VARCHAR(50),
  barcode VARCHAR(100),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_click_products_click_id ON click_products(click_id);
CREATE INDEX IF NOT EXISTS idx_click_products_name ON click_products USING GIN(name gin_trgm_ops);

-- ============================================================================
-- TABLE: products
-- COLUMNS: Enriched products created by sellers from Click ERP base
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  click_id VARCHAR(50) NOT NULL,
  details TEXT,
  details_ar TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_click_id ON products(click_id);
CREATE INDEX IF NOT EXISTS idx_products_created_by ON products(created_by);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TABLE: product_sizes
-- COLUMNS: 3-tier size system (standard/alphabetical/numeric)
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_type VARCHAR(50) NOT NULL,
  size_value VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, size_type, size_value)
);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product_id ON product_sizes(product_id);

-- ============================================================================
-- TABLE: product_colors
-- COLUMNS: Many-to-many linking products to available colors
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_id UUID NOT NULL REFERENCES colors(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, color_id)
);
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_color_id ON product_colors(color_id);

-- ============================================================================
-- TABLE: product_categories
-- COLUMNS: Many-to-many linking products to categories
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);

-- ============================================================================
-- TABLE: product_images
-- COLUMNS: Product images stored on Cloudinary with is_primary flag
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_images_primary ON product_images(product_id) WHERE is_primary = TRUE;

-- ============================================================================
-- TABLE: product_embeddings
-- COLUMNS: AI semantic search embeddings (Phase 2)
-- Note: Using BYTEA instead of pgvector for local development
-- ============================================================================
CREATE TABLE IF NOT EXISTS product_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  embedding BYTEA,
  embedded_text TEXT,
  model_version VARCHAR(50) DEFAULT 'text-embedding-3-small',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_embeddings_product_id ON product_embeddings(product_id);

CREATE TRIGGER update_product_embeddings_timestamp
BEFORE UPDATE ON product_embeddings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- TABLE: sync_log
-- COLUMNS: Audit trail for Click ERP sync operations
-- ============================================================================
CREATE TABLE IF NOT EXISTS sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type VARCHAR(50),
  status VARCHAR(50),
  records_processed INTEGER,
  error_message TEXT,
  sync_started_at TIMESTAMPTZ,
  sync_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sync_log_created_at ON sync_log(created_at);
CREATE INDEX IF NOT EXISTS idx_sync_log_status ON sync_log(status);
