'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertCircle, CheckCircle2, Loader2, Upload, X, Trash2 } from 'lucide-react'

interface Product {
  id: number
  item_code: string
  category: string
  description: string
  size: string
  color: string
  image_url: string
  status: string
  created_at: string
  updated_at: string
}

interface EditModalProps {
  product: Product | null
  onClose: () => void
  onSave: (product: Product) => Promise<void>
}

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

export function EditProductModal({ product, onClose, onSave }: EditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Product | null>(product)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [productImages, setProductImages] = useState<any[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  useEffect(() => {
    setFormData(product)
    setStatus({ type: null, message: '' })
    if (product?.image_url) {
      setImagePreview(product.image_url)
    }
    // Fetch product images
    if (product?.id) {
      fetchProductImages(product.id)
    }
    // Parse colors from comma-separated string
    if (product?.color) {
      const colorLabels = product.color.split(', ').map(c => c.trim())
      const colorIds = COLORS
        .filter(col => colorLabels.includes(col.label))
        .map(col => col.id)
      setSelectedColors(colorIds)
    }
    // Parse categories from comma-separated string
    if (product?.category) {
      const categoryLabels = product.category.split(', ').map(c => c.trim())
      const categoryIds = CATEGORIES
        .filter(cat => categoryLabels.includes(cat.label))
        .map(cat => cat.id)
      setSelectedCategories(categoryIds)
    }
  }, [product])

  const fetchProductImages = async (productId: number) => {
    try {
      const response = await fetch(`/api/product-images?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProductImages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching product images:', error)
    }
  }

  if (!formData) return null

  const handleChange = (field: keyof Product, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageData = event.target?.result as string
          setNewImagePreviews(prev => [...prev, imageData])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDeleteImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/product-images?imageId=${imageId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProductImages(prev => prev.filter(img => img.id !== imageId))
      }
    } catch (error) {
      console.error('Error deleting image:', error)
    }
  }

  const handleColorToggle = (colorId: string) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(colorId)
        ? prev.filter(c => c !== colorId)
        : [...prev, colorId]
      
      // Update form data with Arabic color labels
      const colorLabels = newColors.map(id => {
        const colorObj = COLORS.find(c => c.id === id)
        return colorObj?.label || ''
      }).filter(Boolean)
      
      setFormData(prev => prev ? { ...prev, color: colorLabels.join(', ') } : null)
      return newColors
    })
  }

  const handleRemoveImage = () => {
    setImagePreview('')
    setFormData(prev => prev ? { ...prev, image_url: '' } : null)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
      
      // Update form data with Arabic category labels
      const categoryLabels = newCategories.map(id => {
        const categoryObj = CATEGORIES.find(cat => cat.id === id)
        return categoryObj?.label || ''
      }).filter(Boolean)
      
      setFormData(prev => prev ? { ...prev, category: categoryLabels.join(', ') } : null)
      return newCategories
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsLoading(true)
    try {
      await onSave(formData)
      
      // Save new images if any
      if (newImagePreviews.length > 0) {
        for (let i = 0; i < newImagePreviews.length; i++) {
          await fetch('/api/product-images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              product_id: formData.id,
              image_url: newImagePreviews[i],
              display_order: productImages.length + i,
            }),
          })
        }
        setNewImagePreviews([])
        fetchProductImages(formData.id)
      }
      
      setStatus({ type: 'success', message: 'تم تحديث المنتج بنجاح' })
      setTimeout(() => onClose(), 1500)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'حدث خطأ أثناء التحديث',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>تعديل المنتج</CardTitle>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent>
          {status.type && (
            <div
              className="mb-4 rounded-lg p-4 flex items-center gap-3 border-2"
              style={{
                backgroundColor: status.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                color: status.type === 'success' ? '#22C55E' : '#DC2626',
                borderColor: status.type === 'success' ? '#22C55E' : '#DC2626',
              }}
            >
              {status.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
              )}
              <span className="text-sm font-semibold">{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Product Code */}
            <div className="space-y-2">
              <Label>كود المنتج</Label>
              <Input
                value={formData.item_code}
                onChange={e => handleChange('item_code', e.target.value)}
                disabled
                className="bg-gray-50"
              />
            </div>

            {/* Categories - Checkbox Selection */}
            <div className="space-y-3">
              <Label>التصنيفات *</Label>
              <div className="grid grid-cols-2 gap-3 p-3 border border-gray-300 rounded-md bg-gray-50">
                {CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`category-${cat.id}`}
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryToggle(cat.id)}
                    />
                    <label
                      htmlFor={`category-${cat.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {cat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="الوصف"
                className="min-h-[80px]"
              />
            </div>

            {/* Sizes */}
            <div className="space-y-2">
              <Label>المقاسات</Label>
              <Input
                value={formData.size}
                onChange={e => handleChange('size', e.target.value)}
                placeholder="مثال: S, M, L, XL"
              />
            </div>

            {/* Colors - Checkbox Selection */}
            <div className="space-y-3">
              <Label>الألوان *</Label>
              <div className="grid grid-cols-2 gap-3 p-3 border border-gray-300 rounded-md bg-gray-50">
                {COLORS.map(color => (
                  <div key={color.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`color-${color.id}`}
                      checked={selectedColors.includes(color.id)}
                      onChange={() => handleColorToggle(color.id)}
                    />
                    <label
                      htmlFor={`color-${color.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {color.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Images Upload - Multiple Images */}
            <div className="space-y-3">
              <Label>صور المنتج (متعددة)</Label>
              
              {/* Existing Images */}
              {productImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">الصور الحالية ({productImages.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {productImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group rounded-lg overflow-hidden border-2 border-gray-300"
                      >
                        <img
                          src={image.image_url}
                          alt="Product"
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Upload New Images */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('multiImageInput')?.click()}
                  className="w-full py-6 text-center hover:bg-gray-100 transition"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">انقر لإضافة صور جديدة</p>
                </button>
                <input
                  id="multiImageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              {/* New Image Previews */}
              {newImagePreviews.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">صور جديدة ({newImagePreviews.length})</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {newImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden border-2 border-blue-400"
                      >
                        <img
                          src={preview}
                          alt={`صورة جديدة ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Trash2 className="h-6 w-6 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>الحالة</Label>
              <select
                value={formData.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  'حفظ التعديلات'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
