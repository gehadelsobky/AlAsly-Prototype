'use client'

import { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productFormSchema, type ProductFormData } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Switch } from '@/components/ui/Switch'
import { Combobox } from '@/components/ui/Combobox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, CheckCircle2, Loader2, Upload, Save, RotateCcw, Trash2 } from 'lucide-react'

const CATEGORIES = [
  { id: 'black-plain', label: 'أسود سادة' },
  { id: 'thoob-pants', label: 'تونك بنطلون بدلة' },
  { id: 'mens-thobe', label: 'جلابية رجالي' },
  { id: 'jeans', label: 'جينز' },
  { id: 'silk-colors', label: 'حرير ألوان' },
  { id: 'winter', label: 'شتوي' },
  { id: 'chiffon', label: 'شيفون' },
  { id: 'kids-abayas', label: 'عبايات اطفال' },
  { id: 'velvet', label: 'قطيفة' },
]

const COLORS = [
  { id: 'red', label: 'أحمر' },
  { id: 'blue', label: 'أزرق' },
  { id: 'black', label: 'أسود' },
  { id: 'white', label: 'أبيض' },
  { id: 'green', label: 'أخضر' },
  { id: 'yellow', label: 'أصفر' },
  { id: 'gray', label: 'رمادي' },
  { id: 'brown', label: 'بني' },
]

const SIZES = {
  موحد: [
    { id: 'free-size', label: 'Free Size' },
    { id: 'one-size', label: 'One Size' },
  ],
  أبجدية: [
    { id: 's', label: 'S' },
    { id: 'm', label: 'M' },
    { id: 'l', label: 'L' },
    { id: 'xl', label: 'XL' },
    { id: '2xl', label: '2XL' },
    { id: '3xl', label: '3XL' },
    { id: '4xl', label: '4XL' },
  ],
  رقمية: [
    { id: '28', label: '28' },
    { id: '30', label: '30' },
    { id: '32', label: '32' },
    { id: '34', label: '34' },
    { id: '36', label: '36' },
    { id: '38', label: '38' },
  ],
}

export function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<keyof typeof SIZES | ''>('')

  // Load inventory items on mount
  useEffect(() => {
    // Don't pre-load all items - let the Combobox load them on demand
    // This prevents lag when the page loads
  }, [])

  const toggleSize = (sizeId: string) => {
    const currentSizes = watch('sizes')
    const newSizes = currentSizes.includes(sizeId) 
      ? currentSizes.filter(id => id !== sizeId)
      : [...currentSizes, sizeId]
    setValue('sizes', newSizes)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      isActive: true,
      categories: [],
      colors: [],
      sizes: [],
    },
  })

  const categories = watch('categories')
  const colors = watch('colors')
  const sizes = watch('sizes')

  const handleProductSelect = useCallback(
    async (option: any) => {
      setSelectedProduct(option)
      setValue('productId', option.value)
      setValue('productName', option.item_name)
      setValue('price', option.retail_price)
      setValue('quantity', option.item_qty)
      setValue('manufacturer', option.inventory_name)
    },
    [setValue]
  )

  const handleSearchInventoryItems = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/inventory-items?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to search inventory items')
      return await response.json()
    } catch (error) {
      console.error('Search error:', error)
      return []
    }
  }, [])

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files) {
        Array.from(files).forEach((file) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const result = reader.result as string
            setImagePreviews(prev => [...prev, result])
          }
          reader.readAsDataURL(file)
        })
      }
    },
    []
  )

  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const toggleCategory = useCallback(
    (id: string) => {
      const newCategories = categories.includes(id)
        ? categories.filter(c => c !== id)
        : [...categories, id]
      setValue('categories', newCategories)
    },
    [categories, setValue]
  )

  const toggleColor = useCallback(
    (id: string) => {
      const newColors = colors.includes(id)
        ? colors.filter(c => c !== id)
        : [...colors, id]
      setValue('colors', newColors)
    },
    [colors, setValue]
  )

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    // Prepare custom attributes
    const item_code = selectedProduct?.item_name || data.productName || data.productId
    // Get Arabic category labels from the IDs (support multiple)
    const categoryLabels = data.categories.map(categoryId => {
      const categoryObj = CATEGORIES.find(cat => cat.id === categoryId)
      return categoryObj?.label || ''
    }).filter(Boolean)
    const category = categoryLabels.join(', ')
    const description = data.description
    const size = data.sizes.join(', ')
    // Get Arabic color labels from the IDs
    const colorLabels = data.colors.map(colorId => {
      const colorObj = COLORS.find(c => c.id === colorId)
      return colorObj?.label || ''
    }).filter(Boolean)
    const color = colorLabels.join(', ')
    const image_url = imagePreviews[0] || ''
    const status = data.isActive ? 'active' : 'inactive'

    try {
      const response = await fetch('/api/custom-product-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_code,
          category,
          description,
          size,
          color,
          image_url,
          status,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save product attributes')
      }

      // Save additional images if any
      if (imagePreviews.length > 1) {
        const productId = result.data.id
        for (let i = 1; i < imagePreviews.length; i++) {
          await fetch('/api/product-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: productId,
              image_url: imagePreviews[i],
              display_order: i,
            }),
          })
        }
      }

      setSubmitStatus({
        type: 'success',
        message: 'تم حفظ المنتج بنجاح ✓',
      })

      reset()
      setSelectedProduct(null)
      setImagePreview('')
      setImagePreviews([])
      setSelectedSizeCategory('')

      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' })
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء حفظ المنتج',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl" dir="rtl">
      {/* Status Messages */}
      {submitStatus.type && (
        <div
          className="mb-6 rounded-lg p-4 flex items-center gap-3 border-2"
          style={{
            backgroundColor: submitStatus.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            color: submitStatus.type === 'success' ? '#22C55E' : '#DC2626',
            borderColor: submitStatus.type === 'success' ? '#22C55E' : '#DC2626',
          }}
        >
          {submitStatus.type === 'success' ? (
            <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
          )}
          <span className="font-semibold">{submitStatus.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Product Data from Warehouse */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
            <CardTitle style={{ color: '#F4B400' }}>بيانات المنتج من المخزون</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Product Search */}
                <div className="md:col-span-2 space-y-2">
                  <Label className="font-bold" style={{ color: '#1F2937' }}>اسم المنتج *</Label>
                  <Combobox
                    onSelect={handleProductSelect}
                    onSearch={handleSearchInventoryItems}
                    placeholder="ابحث عن اسم المنتج..."
                    value={selectedProduct}
                    options={[]}
                    searchDebounceMs={800}
                  />
                  {errors.productId && (
                    <p className="text-sm flex items-center gap-1" style={{ color: '#DC2626' }}>
                      <AlertCircle className="h-4 w-4" />
                      {errors.productId.message}
                    </p>
                  )}
                </div>

                {/* Auto-filled Fields */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-bold" style={{ color: '#1F2937' }}>السعر</Label>
                  <Input
                    id="price"
                    type="number"
                    {...register('price')}
                    disabled
                    style={{ backgroundColor: '#F5F7FA', color: '#6B7280' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="font-bold" style={{ color: '#1F2937' }}>الكمية</Label>
                  <Input
                    id="quantity"
                    type="number"
                    {...register('quantity')}
                    disabled
                    style={{ backgroundColor: '#F5F7FA', color: '#6B7280' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer" className="font-bold" style={{ color: '#1F2937' }}>المصنع</Label>
                  <Input
                    id="manufacturer"
                    {...register('manufacturer')}
                    disabled
                    style={{ backgroundColor: '#F5F7FA', color: '#6B7280' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Categories */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
            <CardTitle style={{ color: '#F4B400' }}>التصنيفات *</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map(cat => (
                <label
                  key={cat.id}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors"
                  style={{
                    borderColor: categories.includes(cat.id) ? '#F4B400' : '#E5E7EB',
                    backgroundColor: categories.includes(cat.id) ? '#FFF9E6' : '#FFFFFF',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F4B400'
                    e.currentTarget.style.backgroundColor = '#FFF9E6'
                  }}
                  onMouseLeave={(e) => {
                    if (!categories.includes(cat.id)) {
                      e.currentTarget.style.borderColor = '#E5E7EB'
                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                    }
                  }}
                >
                  <Checkbox
                    checked={categories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-5 h-5"
                  />
                  <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{cat.label}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm mt-3 flex items-center gap-1" style={{ color: '#DC2626' }}>
                <AlertCircle className="h-4 w-4" />
                {errors.categories.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Product Details */}
        <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
          <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
            <CardTitle style={{ color: '#F4B400' }}>تفاصيل المنتج *</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold" style={{ color: '#1F2937' }}>وصف المنتج *</Label>
              <Textarea
                id="description"
                placeholder="أدخل وصفاً مفصلاً للمنتج... (10-500 أحرف)"
                {...register('description')}
                className="font-medium min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm flex items-center gap-1" style={{ color: '#DC2626' }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Sizes & Colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sizes */}
          <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
              <CardTitle style={{ color: '#F4B400' }}>المقاسات *</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Size Category Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="sizeCategory" className="font-bold" style={{ color: '#1F2937' }}>نوع المقاس *</Label>
                  <select
                    id="sizeCategory"
                    value={selectedSizeCategory}
                    onChange={(e) => {
                      const newCategory = e.target.value as keyof typeof SIZES
                      setSelectedSizeCategory(newCategory)
                      setValue('sizes', [])
                    }}
                    style={{
                      borderColor: '#E5E7EB',
                      backgroundColor: '#FFFFFF',
                      color: '#1F2937',
                    }}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">اختر نوع المقاس</option>
                    <option value="موحد">مقاس موحد</option>
                    <option value="أبجدية">مقاسات أبجدية</option>
                    <option value="رقمية">مقاسات رقمية</option>
                  </select>
                </div>

                {/* Size Value Checkboxes */}
                {selectedSizeCategory && (
                  <div className="space-y-3">
                    <Label className="font-bold" style={{ color: '#1F2937' }}>قيمة المقاس *</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {SIZES[selectedSizeCategory].map(size => (
                        <label
                          key={size.id}
                          className="flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors"
                          style={{
                            borderColor: sizes.includes(size.id) ? '#F4B400' : '#E5E7EB',
                            backgroundColor: sizes.includes(size.id) ? '#FFF9E6' : '#FFFFFF',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#F4B400'
                          }}
                          onMouseLeave={(e) => {
                            if (!sizes.includes(size.id)) {
                              e.currentTarget.style.borderColor = '#E5E7EB'
                            }
                          }}
                        >
                          <Checkbox
                            checked={sizes.includes(size.id)}
                            onChange={() => toggleSize(size.id)}
                            className="w-5 h-5"
                          />
                          <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{size.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {sizes.length === 0 && selectedSizeCategory && (
                <p className="text-sm mt-3 flex items-center gap-1" style={{ color: '#DC2626' }}>
                  <AlertCircle className="h-4 w-4" />
                  اختر مقاس واحد على الأقل
                </p>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
              <CardTitle style={{ color: '#F4B400' }}>الألوان *</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {COLORS.map(color => (
                  <label
                    key={color.id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      backgroundColor: colors.includes(color.id) ? '#FFF9E6' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F5F7FA'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = colors.includes(color.id) ? '#FFF9E6' : 'transparent'
                    }}
                  >
                    <Checkbox
                      checked={colors.includes(color.id)}
                      onChange={() => toggleColor(color.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{color.label}</span>
                  </label>
                ))}
              </div>
              {errors.colors && (
                <p className="text-sm mt-3 flex items-center gap-1" style={{ color: '#DC2626' }}>
                  <AlertCircle className="h-4 w-4" />
                  {errors.colors.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Card 5: Image & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload - Multiple Images */}
          <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
              <CardTitle style={{ color: '#F4B400' }}>صور المنتج (متعددة)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <label
                className="flex flex-col items-center justify-center border-3 border-dashed rounded-lg p-6 cursor-pointer transition-colors"
                style={{
                  borderColor: '#E5E7EB',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F7FA'
                  e.currentTarget.style.borderColor = '#F4B400'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                }}
              >
                <Upload className="h-10 w-10 mb-2" style={{ color: '#F4B400' }} />
                <span className="text-sm font-bold" style={{ color: '#1F2937' }}>اختر صور</span>
                <span className="text-xs mt-1" style={{ color: '#6B7280' }}>يمكنك تحميل عدة صور</span>
                <input
                  id="productImage"
                  name="productImage"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3" style={{ color: '#1F2937' }}>
                    الصور المختارة ({imagePreviews.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                        style={{ borderColor: '#F4B400', border: '2px solid #F4B400' }}
                      >
                        <img
                          src={preview}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="h-6 w-6 text-white" />
                        </button>
                        {index === 0 && (
                          <div
                            className="absolute top-1 left-1 px-2 py-1 rounded text-xs font-bold text-white"
                            style={{ backgroundColor: '#F4B400' }}
                          >
                            الأولى
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}>
            <CardHeader style={{ backgroundColor: '#F5F7FA', borderBottomColor: '#E5E7EB' }}>
              <CardTitle style={{ color: '#F4B400' }}>حالة المنتج</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: '#F5F7FA',
                    borderColor: '#E5E7EB',
                  }}
                >
                  <div className="text-right">
                    <p className="font-bold" style={{ color: watch('isActive') ? '#22C55E' : '#6B7280' }}>
                      {watch('isActive') ? '✓ نشط' : '✗ غير نشط'}
                    </p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>حالة المنتج الحالية</p>
                  </div>
                  <Switch {...register('isActive')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-6" style={{ borderTopColor: '#E5E7EB', borderTopWidth: '1px' }}>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset()
              setSelectedProduct(null)
              setImagePreview('')
              setSelectedSizeCategory('')
            }}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            style={{ borderColor: '#DC2626', color: '#DC2626' }}
          >
            <Trash2 className="h-4 w-4" />
            مسح
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                حفظ المنتج
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
