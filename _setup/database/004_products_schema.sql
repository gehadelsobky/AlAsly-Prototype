-- ============================================================================
-- AL ASLY PRODUCTS SCHEMA - Production-Ready PostgreSQL
-- Senior Backend Engineer Design for B2B Clothing & Textile Trading
-- ============================================================================

-- Core products table
CREATE TABLE IF NOT EXISTS products_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id VARCHAR(100) UNIQUE NOT NULL,
  product_price NUMERIC(12,2) NOT NULL CHECK (product_price > 0),
  product_quantity INTEGER NOT NULL DEFAULT 0 CHECK (product_quantity >= 0),
  product_factory VARCHAR(255) NOT NULL,
  product_details TEXT NOT NULL CHECK (char_length(product_details) >= 10 AND char_length(product_details) <= 500),
  product_status BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_v2_product_id ON products_v2(product_id);
CREATE INDEX idx_products_v2_factory ON products_v2(product_factory);
CREATE INDEX idx_products_v2_status ON products_v2(product_status);

-- Categories lookup table
CREATE TABLE IF NOT EXISTS product_category_enum (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) UNIQUE NOT NULL,
  category_name_ar VARCHAR(100) NOT NULL
);

INSERT INTO product_category_enum (category_name, category_name_ar) VALUES
  ('black-plain', 'أسود سادة'),
  ('thobe-pants-suit', 'تونك بنطلون بدلة'),
  ('mens-thobe', 'جلابية رجالي'),
  ('jeans', 'جينز'),
  ('silk-colors', 'حرير ألوان'),
  ('winter', 'شتوي'),
  ('chiffon', 'شيفون'),
  ('kids-abayas', 'عبايات اطفال'),
  ('velvet', 'قطيفة')
ON CONFLICT (category_name) DO NOTHING;

-- Product-to-Categories (many-to-many)
CREATE TABLE IF NOT EXISTS product_categories_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products_v2(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES product_category_enum(id),
  UNIQUE(product_id, category_id)
);

CREATE INDEX idx_product_categories_v2_product_id ON product_categories_v2(product_id);

-- Size types enum
CREATE TABLE IF NOT EXISTS size_type_enum (
  id SERIAL PRIMARY KEY,
  size_type_name VARCHAR(50) UNIQUE NOT NULL,
  size_type_name_ar VARCHAR(50) NOT NULL
);

INSERT INTO size_type_enum (size_type_name, size_type_name_ar) VALUES
  ('standard', 'موحد'),
  ('alphabetical', 'أبجدية'),
  ('numeric', 'رقمية')
ON CONFLICT (size_type_name) DO NOTHING;

-- Size values
CREATE TABLE IF NOT EXISTS size_value_enum (
  id SERIAL PRIMARY KEY,
  size_type_id INTEGER NOT NULL REFERENCES size_type_enum(id),
  size_value VARCHAR(50) NOT NULL,
  UNIQUE(size_type_id, size_value)
);

INSERT INTO size_value_enum (size_type_id, size_value) VALUES
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'standard'), 'Free Size'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'standard'), 'One Size'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), 'S'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), 'M'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), 'L'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), 'XL'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), '2XL'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), '3XL'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'alphabetical'), '4XL'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '28'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '30'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '32'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '34'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '36'),
  ((SELECT id FROM size_type_enum WHERE size_type_name = 'numeric'), '38')
ON CONFLICT (size_type_id, size_value) DO NOTHING;

-- Product-to-Sizes (many-to-many)
CREATE TABLE IF NOT EXISTS product_sizes_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products_v2(id) ON DELETE CASCADE,
  size_value_id INTEGER NOT NULL REFERENCES size_value_enum(id),
  UNIQUE(product_id, size_value_id)
);

CREATE INDEX idx_product_sizes_v2_product_id ON product_sizes_v2(product_id);

-- Colors enum
CREATE TABLE IF NOT EXISTS color_enum (
  id SERIAL PRIMARY KEY,
  color_name VARCHAR(50) UNIQUE NOT NULL,
  color_name_ar VARCHAR(50) NOT NULL,
  hex_code VARCHAR(7)
);

INSERT INTO color_enum (color_name, color_name_ar, hex_code) VALUES
  ('red', 'أحمر', '#FF0000'),
  ('blue', 'أزرق', '#0000FF'),
  ('black', 'أسود', '#000000'),
  ('white', 'أبيض', '#FFFFFF'),
  ('green', 'أخضر', '#008000'),
  ('yellow', 'أصفر', '#FFFF00'),
  ('gray', 'رمادي', '#808080'),
  ('brown', 'بني', '#A52A2A')
ON CONFLICT (color_name) DO NOTHING;

-- Product-to-Colors (many-to-many)
CREATE TABLE IF NOT EXISTS product_colors_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products_v2(id) ON DELETE CASCADE,
  color_id INTEGER NOT NULL REFERENCES color_enum(id),
  UNIQUE(product_id, color_id)
);

CREATE INDEX idx_product_colors_v2_product_id ON product_colors_v2(product_id);

-- Product images (with Cloudinary support)
CREATE TABLE IF NOT EXISTS product_images_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products_v2(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_key VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, image_url)
);

CREATE INDEX idx_product_images_v2_product_id ON product_images_v2(product_id);
CREATE UNIQUE INDEX idx_product_images_v2_primary ON product_images_v2(product_id) WHERE is_primary = TRUE;

-- Audit trigger for updated_at
CREATE OR REPLACE FUNCTION update_products_v2_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_v2_updated_at
BEFORE UPDATE ON products_v2
FOR EACH ROW
EXECUTE FUNCTION update_products_v2_timestamp();

-- ============================================================================
-- VIEW FOR CONVENIENT QUERYING
-- ============================================================================

CREATE OR REPLACE VIEW product_full_details AS
SELECT
  p.id,
  p.product_id,
  p.product_price,
  p.product_quantity,
  p.product_factory,
  p.product_details,
  p.product_status,
  STRING_AGG(DISTINCT pce.category_name_ar, ', ') AS categories,
  STRING_AGG(DISTINCT sve.size_value, ', ' ORDER BY sve.size_value) AS sizes,
  STRING_AGG(DISTINCT ce.color_name_ar, ', ') AS colors,
  STRING_AGG(DISTINCT pi.image_url, ', ') AS images,
  p.created_at,
  p.updated_at
FROM products_v2 p
LEFT JOIN product_categories_v2 pc ON p.id = pc.product_id
LEFT JOIN product_category_enum pce ON pc.category_id = pce.id
LEFT JOIN product_sizes_v2 ps ON p.id = ps.product_id
LEFT JOIN size_value_enum sve ON ps.size_value_id = sve.id
LEFT JOIN product_colors_v2 pco ON p.id = pco.product_id
LEFT JOIN color_enum ce ON pco.color_id = ce.id
LEFT JOIN product_images_v2 pi ON p.id = pi.product_id
GROUP BY p.id;
