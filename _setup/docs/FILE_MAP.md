# 🗺️ خريطة الملفات والمسارات

## البنية الكاملة

```
Al-Asli Dashboard
│
├── 📄 أملاك المشروع
│   ├── package.json              ← المكتبات والاعتماديات
│   ├── next.config.js            ← إعدادات Next.js
│   ├── tailwind.config.ts        ← إعدادات Tailwind
│   ├── tsconfig.json             ← إعدادات TypeScript
│   ├── postcss.config.js         ← معالج CSS
│   └── .gitignore                ← ملفات مخفية
│
├── 📚 التوثيق
│   ├── README.md                 ← الدليل الشامل
│   ├── QUICKSTART.md             ← البدء السريع
│   ├── BUILDING.md               ← تفاصيل البناء
│   ├── COMPLETION.md             ← ملخص الإنجاز
│   └── FILE_MAP.md               ← هذا الملف
│
└── 📁 src/
    │
    ├── 🎨 globals.css            ← الأنماط العالمية
    │
    ├── 📄 app/
    │   │
    │   ├── 📄 layout.tsx          ← Layout الرئيسي (RTL)
    │   │
    │   ├── 🏠 page.tsx            ← الصفحة الرئيسية
    │   │   └── يعرض: Dashboard component
    │   │   └── يوفر: إحصائيات، جدول، أزرار
    │   │
    │   ├── 📁 add-product/
    │   │   └── 📄 page.tsx        ← صفحة إضافة منتج
    │   │       └── يعرض: AddProductForm component
    │   │       └── يوفر: 8 حقول نموذج
    │   │
    │   ├── 📁 products/
    │   │   └── 📄 page.tsx        ← قائمة المنتجات
    │   │       └── يعرض: جدول المنتجات
    │   │
    │   └── 📁 api/
    │       │
    │       ├── 📁 click-products/
    │       │   └── 📄 route.ts    ← API البحث
    │       │       GET /api/click-products?q=
    │       │       → يبحث في 8000+ منتج
    │       │       → returns JSON مع النتائج
    │       │
    │       └── 📁 products/
    │           └── 📄 route.ts    ← API الحفظ
    │               POST /api/products
    │               → يحفظ منتج جديد
    │               → returns success/error
    │
    ├── 🧩 components/
    │   │
    │   ├── 📄 Dashboard.tsx       ← مكون لوحة التحكم
    │   │   └── يحتوي على:
    │   │       - Header
    │   │       - 3 Stats Cards
    │   │       - Quick Actions
    │   │       - Products Table
    │   │
    │   ├── 📄 AddProductForm.tsx  ← مكون النموذج
    │   │   └── يحتوي على:
    │   │       - Product Search (Combobox)
    │   │       - Auto-fill fields
    │   │       - Categories (Checkboxes)
    │   │       - Description (Textarea)
    │   │       - Sizes (Radio buttons)
    │   │       - Colors (Checkboxes)
    │   │       - Image Upload
    │   │       - Active Toggle
    │   │       - Submit Button
    │   │
    │   └── 📁 ui/
    │       ├── 📄 Button.tsx      ← زر (5 أنماط)
    │       ├── 📄 Input.tsx       ← حقل إدخال
    │       ├── 📄 Label.tsx       ← تسمية
    │       ├── 📄 Textarea.tsx    ← نص طويل
    │       ├── 📄 Card.tsx        ← بطاقة
    │       ├── 📄 Combobox.tsx    ← بحث ذكي
    │       ├── 📄 Checkbox.tsx    ← صندوق اختيار
    │       └── 📄 Switch.tsx      ← مفتاح تبديل
    │
    └── 📁 lib/
        └── 📄 validations.ts      ← Zod Schemas
            ├── productFormSchema
            └── ProductFormData type
```

---

## مسارات الصفحات

```
المسار          الملف                       الوصف
─────────────────────────────────────────────────────────
/               src/app/page.tsx           لوحة التحكم
/add-product    src/app/add-product/      إضافة منتج
/products       src/app/products/page.tsx  قائمة المنتجات
```

---

## مسارات API

```
النوع   المسار                      الملف
─────────────────────────────────────────────────────────
GET     /api/click-products?q=      src/app/api/click-products/route.ts
POST    /api/products               src/app/api/products/route.ts
```

---

## مكونات الواجهة (UI Components)

```
المكون        الملف                         الاستخدام
────────────────────────────────────────────────────────
Button      ui/Button.tsx           أزرار (إضافة، حفظ، إلخ)
Input       ui/Input.tsx            حقول إدخال النص
Label       ui/Label.tsx            تسميات الحقول
Textarea    ui/Textarea.tsx         وصف طويل
Card        ui/Card.tsx             بطاقات الإحصائيات
Combobox    ui/Combobox.tsx         بحث المنتجات
Checkbox    ui/Checkbox.tsx         فئات وألوان متعددة
Switch      ui/Switch.tsx           تبديل الحالة
```

---

## التدفق (Flow)

### لوحة التحكم
```
[GET /] → page.tsx → Dashboard component
         → Stats Cards (مع بيانات وهمية)
         → Quick Actions (أزرار)
         → Recent Products Table (جدول)
```

### إضافة منتج
```
[GET /add-product] → page.tsx → AddProductForm component
                    → Product Search
                        [search query]
                        → [API: /api/click-products?q=...]
                        → [كوموبوكس مع النتائج]
                    → Auto-fill fields
                    → Categories, Sizes, Colors
                    → Image Upload
                    [Submit]
                    → [API: POST /api/products]
                    → Success/Error message
```

### قائمة المنتجات
```
[GET /products] → page.tsx → Products Table
                → عرض 15 منتج بيانات وهمية
                → جدول مع الحالة (نشط/غير نشط)
```

---

## التعاملات الخارجية

```
Frontend (React)
    ↓
Next.js API Routes
    ↓
[في المستقبل]
Database (Postgres)
Cloud Storage (Cloudinary)
Auth Service (NextAuth)
```

---

## حجم الملفات (تقريبي)

```
src/components/
├── Dashboard.tsx              ~150 أسطر
├── AddProductForm.tsx         ~350 أسطر
└── ui/                        ~50 أسطر لكل ملف

src/app/
├── page.tsx                   ~5 أسطر
├── add-product/page.tsx       ~20 أسطر
├── products/page.tsx          ~80 أسطر
└── api/
    ├── click-products/        ~50 أسطر
    └── products/              ~35 أسطر

src/lib/
└── validations.ts             ~30 أسطر

الإجمالي: ~900 أسطر كود
```

---

## المكتبات الرئيسية

```
react              ← أساس الواجهة
react-dom          ← DOM rendering
next               ← Framework
typescript         ← Type safety
tailwindcss        ← Styling
react-hook-form    ← Form management
zod                ← Validation
lucide-react       ← Icons
@hookform/resolvers ← Zod integration
```

---

## الملفات المهمة

### للتطوير
```
✓ src/components/ui/*          → أضف مكونات جديدة هنا
✓ src/app/*/page.tsx           → أضف صفحات جديدة هنا
✓ src/app/api/*/route.ts       → أضف APIs جديدة هنا
✓ src/lib/validations.ts       → أضف Zod schemas هنا
```

### للتوثيق
```
✓ README.md                     → الدليل الكامل
✓ QUICKSTART.md                → بدء سريع
✓ BUILDING.md                  → تفاصيل البناء
✓ COMPLETION.md                → ملخص الإنجاز
```

### للإعدادات
```
✓ package.json                  → المكتبات
✓ tsconfig.json                 → TypeScript
✓ tailwind.config.ts            → Tailwind
✓ next.config.js                → Next.js
```

---

## نصائح التطوير

### إضافة مكون جديد
```bash
# 1. أنشئ ملف في src/components/ui/
src/components/ui/NewComponent.tsx

# 2. استورده واستخدمه
import { NewComponent } from '@/components/ui/NewComponent'
```

### إضافة صفحة جديدة
```bash
# 1. أنشئ مجلد
src/app/new-page/

# 2. أضف page.tsx
src/app/new-page/page.tsx

# 3. سيصبح متاح على /new-page
```

### إضافة API جديد
```bash
# 1. أنشئ مجلد
src/app/api/new-endpoint/

# 2. أضف route.ts
src/app/api/new-endpoint/route.ts

# 3. سيصبح متاح على /api/new-endpoint
```

---

**آخر تحديث:** 2026-04-07  
**الإصدار:** 1.0.0
