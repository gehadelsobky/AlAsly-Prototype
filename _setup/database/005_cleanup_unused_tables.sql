-- ============================================================================
-- FILE: 005_cleanup_unused_tables.sql
-- PURPOSE: Remove unused tables that are not referenced in the application
-- ============================================================================

-- Drop unused tables in correct order (respecting foreign key constraints)

-- Drop product_embeddings (depends on products)
DROP TABLE IF EXISTS product_embeddings CASCADE;

-- Drop product-related junction tables (depend on products and other tables)
DROP TABLE IF EXISTS product_colors CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS product_sizes CASCADE;

-- Drop sync_log (independent, safe to drop)
DROP TABLE IF EXISTS sync_log CASCADE;

-- Drop color and category master tables (no longer needed)
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- ============================================================================
-- Note: The following tables are still in use and were NOT dropped:
-- - users: Used for authentication
-- - click_products: Used for product data from Click ERP
-- - products: Main product table used throughout the app
-- - product_images: Used for storing product images
-- - custom_product_attributes: Used for custom product attributes
-- - products_v2: Used in products-list API
-- ============================================================================
