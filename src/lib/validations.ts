import { z } from 'zod'

export const productFormSchema = z.object({
  productId: z.string({
    required_error: 'يرجى اختيار منتج',
  }),
  productName: z.string().optional(),
  productNumber: z.string().optional(),
  price: z.coerce.number().positive('السعر يجب أن يكون أكبر من 0'),
  quantity: z.coerce.number().int().positive('الكمية يجب أن تكون رقم موجب'),
  manufacturer: z.string().optional(),
  categories: z.array(z.string()).min(1, 'اختر فئة واحدة على الأقل'),
  description: z.string().min(10, 'الوصف يجب أن يكون 10 أحرف على الأقل').max(500, 'الوصف طويل جداً'),
  sizeType: z.enum(['موحد', 'أبجدية', 'رقمية']).optional(),
  sizes: z.array(z.string()).min(1, 'اختر مقاس واحد على الأقل'),
  colors: z.array(z.string()).min(1, 'اختر لون واحد على الأقل'),
  image: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productFormSchema>
