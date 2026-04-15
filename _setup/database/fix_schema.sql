-- Make product_details nullable in products_v2 table

ALTER TABLE products_v2
ALTER COLUMN details DROP NOT NULL;
