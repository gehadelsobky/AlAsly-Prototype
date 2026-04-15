# Database Integration Guide

## Overview
The form now saves data to PostgreSQL database in the following tables:
- **products** - Enriched product data
- **product_sizes** - Selected sizes for each product  
- **product_colors** - Selected colors for each product
- **product_categories** - Selected categories for each product
- **product_images** - Product images

## Setup Instructions

### 1. **Local Development (Without Database)**
The application works perfectly without a database configured. It uses:
- **Mock data** for product search (8000 sample products)
- **In-memory** storage for submitted products (console logs)

No setup needed - just run `npm run dev`

### 2. **Production Setup (With Neon PostgreSQL)**

#### Step 1: Create Neon Account and Database
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project/database
3. Copy your connection string that looks like:
   ```
   postgresql://user:password@ep-xyz.us-east-1.neon.tech/dbname?sslmode=require
   ```

#### Step 2: Run Database Setup Script
1. Install Python (if not already installed): [python.org](https://www.python.org)
2. Update `.env.local` with your DATABASE_URL:
   ```
   DATABASE_URL=postgresql://user:password@ep-xyz.us-east-1.neon.tech/dbname?sslmode=require
   ```
3. Install Python dependencies:
   ```bash
   pip install psycopg2-binary
   ```
4. Run the setup script:
   ```bash
   python setup.py
   ```

This script will:
- Enable 4 PostgreSQL extensions (uuid-ossp, pgcrypto, pg_trgm, vector)
- Create 11 tables with proper indexes and triggers
- Insert seed data (20 sample products, 8 users, 12 categories, 20 colors, etc.)
- Display row counts for verification

#### Step 3: Verify Setup
The `setup.py` script outputs the number of rows in each table. Verify:
- Users: 8
- Categories: 12
- Colors: 20
- Click Products: 20
- Products: 10
- Product Sizes: 46
- Product Colors: 30
- Product Categories: 12
- Product Images: 10

#### Step 4: Update Next.js Environment
Restart the Next.js dev server so it picks up the DATABASE_URL:
```bash
npm run dev
```

## Form Submission Flow

When you click "حفظ المنتج" (Save Product), the form:

1. **Validates** all required fields:
   - كود المنتج (Product Code) - required
   - التصنيفات (Categories) - at least 1
   - تفاصيل المنتج (Product Details) - 10-500 characters
   - المقاسات (Sizes) - at least 1
   - الألوان (Colors) - at least 1

2. **Auto-fills** from database:
   - السعر (Price)
   - الكمية (Quantity)
   - المصنع (Manufacturer)

3. **Inserts** into database:
   - New product record in `products` table
   - Size relationships in `product_sizes` table
   - Color relationships in `product_colors` table
   - Category relationships in `product_categories` table
   - Image in `product_images` table (if uploaded)

4. **Returns** success message showing product was saved

## Database Schema

### products table
```
id (UUID) - Primary key
click_id (UUID) - Foreign key to click_products
details (TEXT) - Product description
details_ar (TEXT) - Arabic product description
is_active (BOOLEAN) - Product status
created_by (UUID) - User who created
updated_by (UUID) - User who updated
created_at (TIMESTAMP) - Creation date
updated_at (TIMESTAMP) - Last update date
```

### product_sizes table
```
id (UUID) - Primary key
product_id (UUID) - Foreign key to products
size_type (VARCHAR) - موحد / أبجدية / رقمية
size_value (VARCHAR) - Free Size / XL / 42 / etc
created_at (TIMESTAMP)
```

### product_colors table
```
id (UUID) - Primary key
product_id (UUID) - Foreign key to products
color_id (UUID) - Foreign key to colors
created_at (TIMESTAMP)
```

### product_categories table
```
id (UUID) - Primary key
product_id (UUID) - Foreign key to products
category_id (UUID) - Foreign key to categories
created_at (TIMESTAMP)
```

### product_images table
```
id (UUID) - Primary key
product_id (UUID) - Foreign key to products
image_url (TEXT) - Cloudinary URL or base64
is_primary (BOOLEAN) - Whether this is the main image
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | No | PostgreSQL connection string |
| NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME | No | Cloudinary cloud name for image uploads |
| CLOUDINARY_API_KEY | No | Cloudinary API key |
| CLOUDINARY_API_SECRET | No | Cloudinary API secret |
| JWT_SECRET | No | Secret for JWT tokens |
| SYNC_INTERVAL_HOURS | No | Frequency to sync Click ERP products (default: 6) |

## API Endpoints

### GET /api/click-products?q=search_term
Searches for products in the database
- **Query**: `q` - search term (name or product number)
- **Response**: Array of products with auto-fill data

### POST /api/products
Saves enriched product to database
- **Body**:
  ```json
  {
    "productId": "uuid",
    "productName": "name",
    "productNumber": "number",
    "price": 100,
    "quantity": 50,
    "manufacturer": "name",
    "categories": ["cat1", "cat2"],
    "description": "details...",
    "sizeType": "أبجدية",
    "sizes": ["S", "M", "L"],
    "colors": ["red", "blue"],
    "image": "base64_or_url",
    "isActive": true
  }
  ```

## Troubleshooting

### "Failed to save product" error
- Check if DATABASE_URL is set in `.env.local`
- Verify database connection is working
- Check browser console for detailed error

### Search returns no results
- Database not configured - uses mock data instead
- Verify DATABASE_URL is correct
- Check if `click_products` table has data

### Product saves but doesn't appear in database
- DATABASE_URL might be empty - it's falling back to mock mode
- Check if user has permission to write to database
- Review terminal for SQL errors

### pg module not found
- Run: `npm install pg @types/pg --save`
- Restart Next.js dev server

## Next Steps

1. **Connect to Neon** - Set DATABASE_URL in `.env.local` and run `python setup.py`
2. **Upload Images** - Configure Cloudinary for image storage
3. **Add Authentication** - Implement user login and track created_by user
4. **API Integration** - Connect to actual Click ERP database for syncing

