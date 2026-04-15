-- ============================================================================
-- FILE: 003_seed.sql
-- PURPOSE: Al Asly bootstrap data - users, products, categories, colors
-- ============================================================================

BEGIN;

-- ============================================================================
-- USERS: 1 admin + 6 sellers + 1 reseller
-- Password for all: Test1234! (bcrypt)
-- ============================================================================
INSERT INTO users (id, email, password_hash, full_name, role, whatsapp_number, is_active)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, 'admin@alasly.com', 
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Admin User', 'admin', NULL, TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, 'ahmed@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Ahmed Ali', 'seller', '+201001234567', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, 'fatima@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Fatima Mohamed', 'seller', '+201001234568', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440004'::uuid, 'karim@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Karim Hassan', 'seller', '+201001234569', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440005'::uuid, 'aisha@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Aisha Nour', 'seller', '+201001234570', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440006'::uuid, 'hassan@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Hassan Ali', 'seller', '+201001234571', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440007'::uuid, 'layla@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Layla Ibrahim', 'seller', '+201001234572', TRUE),
  
  ('550e8400-e29b-41d4-a716-446655440008'::uuid, 'reseller@alasly.com',
   '$2b$12$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7Ib/kl5z0P8qFW', 'Reseller Account', 'reseller', NULL, TRUE);

-- ============================================================================
-- CATEGORIES: 12 categories with hierarchy
-- ============================================================================
INSERT INTO categories (id, name, name_ar, slug, parent_id, display_order, is_active)
VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, 'Mens Clothing', 'ملابس رجالية', 'mens-clothing', NULL, 1, TRUE),
  ('650e8400-e29b-41d4-a716-446655440002'::uuid, 'Womens Clothing', 'ملابس نسائية', 'womens-clothing', NULL, 2, TRUE),
  ('650e8400-e29b-41d4-a716-446655440003'::uuid, 'Childrens Wear', 'ملابس اطفال', 'childrens-wear', NULL, 3, TRUE),
  ('650e8400-e29b-41d4-a716-446655440004'::uuid, 'Sportswear', 'الرياضة', 'sportswear', NULL, 4, TRUE),
  ('650e8400-e29b-41d4-a716-446655440005'::uuid, 'Underwear', 'الملابس الداخلية', 'underwear', NULL, 5, TRUE),
  ('650e8400-e29b-41d4-a716-446655440006'::uuid, 'Outerwear', 'الملابس الخارجية', 'outerwear', NULL, 6, TRUE),
  ('650e8400-e29b-41d4-a716-446655440007'::uuid, 'Accessories', 'الاكسسوارات', 'accessories', NULL, 7, TRUE),
  ('650e8400-e29b-41d4-a716-446655440008'::uuid, 'Shoes', 'احذية', 'shoes', NULL, 8, TRUE),
  ('650e8400-e29b-41d4-a716-446655440009'::uuid, 'Home Textiles', 'منسوجات منزلية', 'home-textiles', NULL, 9, TRUE),
  ('650e8400-e29b-41d4-a716-446655440010'::uuid, 'School Uniforms', 'الزي المدرسي', 'school-uniforms', '650e8400-e29b-41d4-a716-446655440003'::uuid, 10, TRUE),
  ('650e8400-e29b-41d4-a716-446655440011'::uuid, 'Work Uniforms', 'الملابس الموحدة للعمل', 'work-uniforms', '650e8400-e29b-41d4-a716-446655440006'::uuid, 11, TRUE),
  ('650e8400-e29b-41d4-a716-446655440012'::uuid, 'Seasonal', 'الفصلية', 'seasonal', NULL, 12, TRUE);

-- ============================================================================
-- COLORS: 20 colors with hex codes
-- ============================================================================
INSERT INTO colors (id, name, name_ar, hex_code, display_order, is_active)
VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, 'White', 'أبيض', '#FFFFFF', 1, TRUE),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, 'Black', 'أسود', '#000000', 2, TRUE),
  ('750e8400-e29b-41d4-a716-446655440003'::uuid, 'Navy Blue', 'أزرق غامق', '#001F3F', 3, TRUE),
  ('750e8400-e29b-41d4-a716-446655440004'::uuid, 'Red', 'أحمر', '#FF4136', 4, TRUE),
  ('750e8400-e29b-41d4-a716-446655440005'::uuid, 'Royal Blue', 'أزرق ملكي', '#4169E1', 5, TRUE),
  ('750e8400-e29b-41d4-a716-446655440006'::uuid, 'Green', 'أخضر', '#2ECC40', 6, TRUE),
  ('750e8400-e29b-41d4-a716-446655440007'::uuid, 'Yellow', 'أصفر', '#FFDC00', 7, TRUE),
  ('750e8400-e29b-41d4-a716-446655440008'::uuid, 'Orange', 'برتقالي', '#FF851B', 8, TRUE),
  ('750e8400-e29b-41d4-a716-446655440009'::uuid, 'Pink', 'وردي', '#FF69B4', 9, TRUE),
  ('750e8400-e29b-41d4-a716-446655440010'::uuid, 'Purple', 'بنفسجي', '#B10DC9', 10, TRUE),
  ('750e8400-e29b-41d4-a716-446655440011'::uuid, 'Brown', 'بني', '#8B4513', 11, TRUE),
  ('750e8400-e29b-41d4-a716-446655440012'::uuid, 'Beige', 'بيج', '#F5F5DC', 12, TRUE),
  ('750e8400-e29b-41d4-a716-446655440013'::uuid, 'Grey', 'رمادي', '#808080', 13, TRUE),
  ('750e8400-e29b-41d4-a716-446655440014'::uuid, 'Sky Blue', 'أزرق سماوي', '#87CEEB', 14, TRUE),
  ('750e8400-e29b-41d4-a716-446655440015'::uuid, 'Maroon', 'كستنائي', '#800000', 15, TRUE),
  ('750e8400-e29b-41d4-a716-446655440016'::uuid, 'Gold', 'ذهبي', '#FFD700', 16, TRUE),
  ('750e8400-e29b-41d4-a716-446655440017'::uuid, 'Silver', 'فضي', '#C0C0C0', 17, TRUE),
  ('750e8400-e29b-41d4-a716-446655440018'::uuid, 'Turquoise', 'فيروزي', '#40E0D0', 18, TRUE),
  ('750e8400-e29b-41d4-a716-446655440019'::uuid, 'Olive', 'زيتي', '#808000', 19, TRUE),
  ('750e8400-e29b-41d4-a716-446655440020'::uuid, 'Coral', 'مرجاني', '#FF7F50', 20, TRUE);

-- ============================================================================
-- CLICK_PRODUCTS: 20 Egyptian textile products (read-only from Click ERP)
-- ============================================================================
INSERT INTO click_products (id, click_id, name, name_ar, price, stock_quantity, factory, unit, barcode)
VALUES
  ('850e8400-e29b-41d4-a716-446655440001'::uuid, 'CLICK-001', 'White Cotton Shirt', 'قميص قطن أبيض', 85.00, 500, 'Delta Textiles', 'piece', 'BAR001'),
  ('850e8400-e29b-41d4-a716-446655440002'::uuid, 'CLICK-002', 'Navy Dress Pants', 'بنطال أسود', 125.00, 300, 'Cairo Cotton Co', 'piece', 'BAR002'),
  ('850e8400-e29b-41d4-a716-446655440003'::uuid, 'CLICK-003', 'Red Polo Shirt', 'قميص بولو أحمر', 95.00, 250, 'Misr Spinning', 'piece', 'BAR003'),
  ('850e8400-e29b-41d4-a716-446655440004'::uuid, 'CLICK-004', 'Black T-Shirt', 'تي شيرت أسود', 45.00, 1000, 'Alex Garments', 'piece', 'BAR004'),
  ('850e8400-e29b-41d4-a716-446655440005'::uuid, 'CLICK-005', 'Blue Jeans', 'جينز أزرق', 150.00, 200, 'Nile Fabrics', 'piece', 'BAR005'),
  ('850e8400-e29b-41d4-a716-446655440006'::uuid, 'CLICK-006', 'White Undershirt', 'تحتة بيضاء', 35.00, 800, 'Delta Textiles', 'piece', 'BAR006'),
  ('850e8400-e29b-41d4-a716-446655440007'::uuid, 'CLICK-007', 'Green Jacket', 'جاكت أخضر', 250.00, 100, 'Cairo Cotton Co', 'piece', 'BAR007'),
  ('850e8400-e29b-41d4-a716-446655440008'::uuid, 'CLICK-008', 'Pink Dress', 'فستان وردي', 200.00, 150, 'Misr Spinning', 'piece', 'BAR008'),
  ('850e8400-e29b-41d4-a716-446655440009'::uuid, 'CLICK-009', 'Purple Scarf', 'حجاب بنفسجي', 55.00, 600, 'Alex Garments', 'piece', 'BAR009'),
  ('850e8400-e29b-41d4-a716-446655440010'::uuid, 'CLICK-010', 'Brown Shoes', 'حذاء بني', 180.00, 120, 'Nile Fabrics', 'pair', 'BAR010'),
  ('850e8400-e29b-41d4-a716-446655440011'::uuid, 'CLICK-011', 'Gold Bracelet', 'سوار ذهبي', 75.00, 400, 'Delta Textiles', 'piece', 'BAR011'),
  ('850e8400-e29b-41d4-a716-446655440012'::uuid, 'CLICK-012', 'Silver Ring', 'خاتم فضي', 90.00, 350, 'Cairo Cotton Co', 'piece', 'BAR012'),
  ('850e8400-e29b-41d4-a716-446655440013'::uuid, 'CLICK-013', 'Beige Sweater', 'كنزة بيج', 160.00, 180, 'Misr Spinning', 'piece', 'BAR013'),
  ('850e8400-e29b-41d4-a716-446655440014'::uuid, 'CLICK-014', 'Grey Socks', 'جوارب رمادية', 25.00, 2000, 'Alex Garments', 'pair', 'BAR014'),
  ('850e8400-e29b-41d4-a716-446655440015'::uuid, 'CLICK-015', 'Turquoise Hijab', 'حجاب فيروزي', 50.00, 800, 'Nile Fabrics', 'piece', 'BAR015'),
  ('850e8400-e29b-41d4-a716-446655440016'::uuid, 'CLICK-016', 'Olive Coat', 'معطف زيتي', 300.00, 80, 'Delta Textiles', 'piece', 'BAR016'),
  ('850e8400-e29b-41d4-a716-446655440017'::uuid, 'CLICK-017', 'Coral Blouse', 'بلوزة مرجانية', 120.00, 220, 'Cairo Cotton Co', 'piece', 'BAR017'),
  ('850e8400-e29b-41d4-a716-446655440018'::uuid, 'CLICK-018', 'Maroon Trousers', 'سروال كستنائي', 140.00, 160, 'Misr Spinning', 'piece', 'BAR018'),
  ('850e8400-e29b-41d4-a716-446655440019'::uuid, 'CLICK-019', 'Sky Blue Shirt', 'قميص أزرق سماوي', 100.00, 400, 'Alex Garments', 'piece', 'BAR019'),
  ('850e8400-e29b-41d4-a716-446655440020'::uuid, 'CLICK-020', 'White Sheet', 'ملاءة بيضاء', 200.00, 300, 'Nile Fabrics', 'piece', 'BAR020');

-- ============================================================================
-- PRODUCTS: 10 enriched products
-- ============================================================================
INSERT INTO products (id, click_id, details, details_ar, is_active, created_by, updated_by)
VALUES
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'CLICK-001', 
   'Premium white cotton shirt with comfortable fit', 'قميص قطن أبيض فاخر بملاءمة مريحة',
   TRUE, '550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'CLICK-002',
   'Navy dress pants perfect for office wear', 'بنطال ملفت نظر للارتداء المكتبي',
   TRUE, '550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, 'CLICK-003',
   'Stylish red polo shirt for casual outings', 'قميص بولو احمر انيق للخروج',
   TRUE, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'CLICK-004',
   'Classic black t-shirt for everyday wear', 'تي شيرت أسود كلاسيكي للاستخدام اليومي',
   TRUE, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'CLICK-005',
   'Comfortable blue jeans with stretchable fabric', 'جينز أزرق مريح بنسيج مرن',
   TRUE, '550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440006'::uuid, 'CLICK-006',
   'Soft white undershirt for men', 'تحتة بيضاء ناعمة للرجال',
   FALSE, '550e8400-e29b-41d4-a716-446655440007'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, 'CLICK-007',
   'Warm green jacket for winter season', 'جاكت أخضر دافئ لفصل الشتاء',
   TRUE, '550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440002'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, 'CLICK-008',
   'Beautiful pink dress for women', 'فستان وردي جميل للنساء',
   TRUE, '550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440003'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440009'::uuid, 'CLICK-009',
   'Elegant purple hijab for formal occasions', 'حجاب بنفسجي أنيق للمناسبات الرسمية',
   TRUE, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid),
  
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'CLICK-010',
   'Comfortable brown shoes for all seasons', 'حذاء بني مريح لجميع الفصول',
   FALSE, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid);

-- ============================================================================
-- PRODUCT_SIZES: 46 rows covering all 3 size type systems
-- ============================================================================
INSERT INTO product_sizes (product_id, size_type, size_value)
VALUES
  -- Shirt sizes (alphabetical)
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'أبجدية', 'S'),
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'أبجدية', 'M'),
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'أبجدية', 'L'),
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'أبجدية', 'XL'),
  
  -- Pants sizes (numeric)
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'رقمية', '28'),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'رقمية', '30'),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'رقمية', '32'),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'رقمية', '34'),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'رقمية', '36'),
  
  -- Polo shirt (alphabetical)
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, 'أبجدية', 'S'),
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, 'أبجدية', 'M'),
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, 'أبجدية', 'L'),
  
  -- T-shirt (alphabetical)
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'أبجدية', 'S'),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'أبجدية', 'M'),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'أبجدية', 'L'),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'أبجدية', 'XL'),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'أبجدية', '2XL'),
  
  -- Jeans (numeric)
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'رقمية', '28'),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'رقمية', '30'),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'رقمية', '32'),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'رقمية', '34'),
  
  -- Undershirt (standard - free size)
  ('950e8400-e29b-41d4-a716-446655440006'::uuid, 'موحد', 'Free Size'),
  
  -- Jacket (alphabetical)
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, 'أبجدية', 'M'),
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, 'أبجدية', 'L'),
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, 'أبجدية', 'XL'),
  
  -- Dress (alphabetical)
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, 'أبجدية', 'S'),
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, 'أبجدية', 'M'),
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, 'أبجدية', 'L'),
  
  -- Hijab (standard - one size)
  ('950e8400-e29b-41d4-a716-446655440009'::uuid, 'موحد', 'One Size'),
  
  -- Shoes (numeric)
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '36'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '37'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '38'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '39'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '40'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '41'),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'رقمية', '42');

-- ============================================================================
-- PRODUCT_COLORS: 30 color assignments
-- ============================================================================
INSERT INTO product_colors (product_id, color_id)
VALUES
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, '750e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, '750e8400-e29b-41d4-a716-446655440002'::uuid),
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, '750e8400-e29b-41d4-a716-446655440004'::uuid),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, '750e8400-e29b-41d4-a716-446655440002'::uuid),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, '750e8400-e29b-41d4-a716-446655440005'::uuid),
  ('950e8400-e29b-41d4-a716-446655440006'::uuid, '750e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, '750e8400-e29b-41d4-a716-446655440006'::uuid),
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, '750e8400-e29b-41d4-a716-446655440009'::uuid),
  ('950e8400-e29b-41d4-a716-446655440009'::uuid, '750e8400-e29b-41d4-a716-446655440010'::uuid),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, '750e8400-e29b-41d4-a716-446655440011'::uuid);

-- ============================================================================
-- PRODUCT_CATEGORIES: 12 category assignments
-- ============================================================================
INSERT INTO product_categories (product_id, category_id)
VALUES
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('950e8400-e29b-41d4-a716-446655440006'::uuid, '650e8400-e29b-41d4-a716-446655440005'::uuid),
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, '650e8400-e29b-41d4-a716-446655440006'::uuid),
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid),
  ('950e8400-e29b-41d4-a716-446655440009'::uuid, '650e8400-e29b-41d4-a716-446655440007'::uuid),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, '650e8400-e29b-41d4-a716-446655440008'::uuid);

-- ============================================================================
-- PRODUCT_IMAGES: 10 image assignments (one per product)
-- ============================================================================
INSERT INTO product_images (product_id, image_url, is_primary)
VALUES
  ('950e8400-e29b-41d4-a716-446655440001'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/white-shirt.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440002'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/navy-pants.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440003'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/red-polo.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440004'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/black-tshirt.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440005'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/blue-jeans.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440006'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/white-undershirt.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440007'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/green-jacket.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440008'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/pink-dress.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440009'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/purple-hijab.jpg', TRUE),
  ('950e8400-e29b-41d4-a716-446655440010'::uuid, 'https://res.cloudinary.com/alasly/image/upload/v1/products/brown-shoes.jpg', TRUE);

-- ============================================================================
-- SYNC_LOG: 2 example sync records
-- ============================================================================
INSERT INTO sync_log (id, operation_type, status, records_processed, error_message, sync_started_at, sync_completed_at)
VALUES
  ('a50e8400-e29b-41d4-a716-446655440001'::uuid, 'sync_click_products', 'success', 20, NULL, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '5 minutes'),
  ('a50e8400-e29b-41d4-a716-446655440002'::uuid, 'sync_click_products', 'failed', 0, 'Connection timeout to Click ERP database', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour' + INTERVAL '50 minutes');

COMMIT;
