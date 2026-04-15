'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Checkbox } from '@/components/ui/Checkbox'
import { Upload, Loader2, Trash2, ChevronDown } from 'lucide-react'

interface InventoryItem {
  Inventory_code: string
  Item_Name?: string
  Inventory_Name: string
  Retail_Price?: number
  Item_Qty?: number
  Unit_Price?: number
  Cost?: number
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
  { id: 'red', label: 'أحمر', hex: '#FF0000' },
  { id: 'blue', label: 'أزرق', hex: '#0000FF' },
  { id: 'black', label: 'أسود', hex: '#000000' },
  { id: 'white', label: 'أبيض', hex: '#FFFFFF' },
  { id: 'green', label: 'أخضر', hex: '#008000' },
  { id: 'yellow', label: 'أصفر', hex: '#FFFF00' },
  { id: 'purple', label: 'بنفسجي', hex: '#800080' },
  { id: 'orange', label: 'برتقالي', hex: '#FFA500' },
  { id: 'brown', label: 'بني', hex: '#8B4513' },
  { id: 'pink', label: 'زهادي', hex: '#FFC0CB' },
  { id: 'gray', label: 'رمادي', hex: '#808080' },
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

interface FormData {
  itemCode: string
  price: number
  quantity: number
  manufacturer: string
  category: string[]
  description: string
  sizes: string[]
  colors: string[]
  images: string[]
  isActive: boolean
}

export function AddProductFormNew() {
  const [formData, setFormData] = useState<FormData>({
    itemCode: '',
    price: 0,
    quantity: 0,
    manufacturer: '',
    category: [],
    description: '',
    sizes: [],
    colors: [],
    images: [],
    isActive: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<keyof typeof SIZES | ''>('')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [inventorySearch, setInventorySearch] = useState('')
  const [isLoadingInventory, setIsLoadingInventory] = useState(false)
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false)

  // Fetch inventory items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoadingInventory(true)
        const response = await fetch('/api/test-db')
        const data = await response.json()
        console.log('[AddProductForm] Inventory API response:', data)
        if (data.success && Array.isArray(data.data)) {
          console.log('[AddProductForm] Loaded inventory items:', data.data.length)
          setInventoryItems(data.data)
        } else {
          console.error('[AddProductForm] Invalid response format:', data)
        }
      } catch (err) {
        console.error('[AddProductForm] Error fetching inventory:', err)
      } finally {
        setIsLoadingInventory(false)
      }
    }
    fetchInventory()
  }, [])

  // Close dropdown when clicking outside - optimized
  useEffect(() => {
    if (!showInventoryDropdown) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-inventory-dropdown]')) {
        setShowInventoryDropdown(false)
      }
    }

    // Small delay to avoid triggering on the same click that opened it
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInventoryDropdown])

  // Debug: Monitor formData changes
  useEffect(() => {
    console.log('[AddProductForm] FormData updated:', {
      price: formData.price,
      quantity: formData.quantity,
      manufacturer: formData.manufacturer,
      itemCode: formData.itemCode,
      fullFormData: formData,
    })
  }, [formData])

  // Filter inventory items based on search
  const filteredInventory = inventoryItems.filter(item => {
    if (!inventorySearch.trim()) return true
    const search = inventorySearch.toLowerCase().trim()
    const itemName = (item.Item_Name || '').toLowerCase().trim()
    return itemName.includes(search)
  }).sort((a, b) => {
    if (!inventorySearch.trim()) return 0
    const search = inventorySearch.toLowerCase().trim()
    const nameA = (a.Item_Name || '').toLowerCase().trim()
    const nameB = (b.Item_Name || '').toLowerCase().trim()
    
    // Exact match comes first
    if (nameA === search) return -1
    if (nameB === search) return 1
    
    // Starts with search comes second
    if (nameA.startsWith(search) && !nameB.startsWith(search)) return -1
    if (!nameA.startsWith(search) && nameB.startsWith(search)) return 1
    
    // Default: keep original order
    return 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleInventorySelect = (item: InventoryItem) => {
    console.log('[AddProductForm] Selected inventory item:', item)
    console.log('[AddProductForm] Price:', item.Retail_Price, 'Qty:', item.Item_Qty, 'Manufacturer:', item.Inventory_Name)
    
    setFormData(prev => ({
      ...prev,
      itemCode: item.Item_Name,
      price: item.Retail_Price || 0,
      quantity: item.Item_Qty || 0,
      manufacturer: item.Inventory_Name || '',
    }))
    setInventorySearch('')
    setShowInventoryDropdown(false)
  }

  const toggleCategory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(id) ? prev.category.filter(c => c !== id) : [...prev.category, id],
    }))
  }

  const toggleColor = (id: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(id) ? prev.colors.filter(c => c !== id) : [...prev.colors, id],
    }))
  }

  const toggleSize = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(id) ? prev.sizes.filter(s => s !== id) : [...prev.sizes, id],
    }))
  }

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setFormData(prev => ({ ...prev, images: [...prev.images, result] }))
        }
        reader.readAsDataURL(file)
      })
    }
  }, [])

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      if (!formData.itemCode.trim()) {
        throw new Error('كود المنتج مطلوب')
      }
      if (formData.category.length === 0) {
        throw new Error('يجب اختيار تصنيف واحد على الأقل')
      }
      if (!formData.description.trim()) {
        throw new Error('يجب إدخال وصف المنتج')
      }
      if (formData.sizes.length === 0) {
        throw new Error('يجب اختيار مقاس واحد على الأقل')
      }
      if (formData.colors.length === 0) {
        throw new Error('يجب اختيار لون واحد على الأقل')
      }

      const categoryLabels = formData.category
        .map(catId => CATEGORIES.find(c => c.id === catId)?.label || '')
        .filter(Boolean)
        .join(', ')

      const colorLabels = formData.colors
        .map(colorId => COLORS.find(c => c.id === colorId)?.label || '')
        .filter(Boolean)
        .join(', ')

      const payload = {
        item_code: formData.itemCode,
        category: categoryLabels,
        description: formData.description,
        size: formData.sizes.join(', '),
        color: colorLabels,
        image_url: formData.images.length > 0 ? JSON.stringify(formData.images) : '',
        status: formData.isActive ? 'active' : 'inactive',
      }

      console.log('[AddProductForm] Submitting payload:', payload)

      const response = await fetch('/api/custom-product-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('[AddProductForm] API Response:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ المنتج')
      }

      setSubmitStatus({ type: 'success', message: 'تم حفظ المنتج بنجاح' })
      setFormData({
        itemCode: '',
        price: 0,
        quantity: 0,
        manufacturer: '',
        category: [],
        description: '',
        sizes: [],
        colors: [],
        images: [],
        isActive: true,
      })
    } catch (err) {
      console.error('[AddProductForm] Submit error:', err)
      setSubmitStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'حدث خطأ في حفظ المنتج',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} dir="rtl" className="space-y-6">
      {/* Product Info Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          بيانات المنتج من المخزون
        </h3>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          يتم اختيار كود المنتج والسعر والكمية من برنامج المخزون
        </p>

        <div className="grid grid-cols-4 gap-4">
          <div style={{ position: 'relative' }} data-inventory-dropdown>
            <label style={{ color: '#1F2937' }} className="block text-sm font-medium mb-1">
              كود المنتج *
            </label>
            <div style={{ position: 'relative' }}>
              <Input
                value={showInventoryDropdown ? inventorySearch : formData.itemCode}
                onChange={(e) => {
                  setInventorySearch(e.target.value)
                  setShowInventoryDropdown(e.target.value.trim().length > 0)
                }}
                onFocus={() => setShowInventoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowInventoryDropdown(false), 200)}
                placeholder="اختر كود المنتج"
                style={{ borderColor: '#E5E7EB', color: '#1F2937', backgroundColor: '#F5F7FA', pointerEvents: 'auto' }}
              />
              <ChevronDown
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  pointerEvents: 'none',
                }}
                className="h-4 w-4"
              />

              {/* Dropdown List */}
              {showInventoryDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderTopWidth: 0,
                    borderRadius: '0 0 6px 6px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {isLoadingInventory ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF' }}>
                      <Loader2 className="h-4 w-4 animate-spin inline" />
                    </div>
                  ) : filteredInventory.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                      لا توجد نتائج
                    </div>
                  ) : (
                    filteredInventory.slice(0, 50).map((item, index) => (
                      <button
                        key={item.Inventory_code || index}
                        type="button"
                        onClick={() => handleInventorySelect(item)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: 'none',
                          backgroundColor: 'transparent',
                          textAlign: 'right',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: '#1F2937',
                          transition: 'background-color 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div style={{ fontWeight: '600' }}>{item.Item_Name}</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{item.Inventory_code}</div>
                      </button>
                    ))
                  )}
                  {filteredInventory.length > 50 && (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF', fontSize: '12px' }}>
                      عرض 50 من {filteredInventory.length} - ابحث لتضييق النتائج
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ color: '#1F2937' }} className="block text-sm font-medium mb-1">
              السعر *
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', backgroundColor: '#F5F7FA', overflow: 'hidden' }}>
              <span style={{ padding: '8px 12px', color: '#1F2937', fontWeight: '600', backgroundColor: '#E5E7EB', borderLeft: '1px solid #E5E7EB' }}>
                ج.م
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0"
                readOnly
                style={{ flex: 1, border: 'none', padding: '8px 12px', color: '#1F2937', backgroundColor: '#F5F7FA', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#1F2937' }} className="block text-sm font-medium mb-1">
              الكمية *
            </label>
            <Input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="يتم تحديده تلقائياً"
              readOnly
              style={{ borderColor: '#E5E7EB', color: '#1F2937', backgroundColor: '#F5F7FA', pointerEvents: 'auto' }}
            />
          </div>

          <div>
            <label style={{ color: '#1F2937' }} className="block text-sm font-medium mb-1">
              المصنع
            </label>
            <Input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleInputChange}
              placeholder="يتم تحديده تلقائياً"
              readOnly
              style={{ borderColor: '#E5E7EB', color: '#1F2937', backgroundColor: '#F5F7FA', pointerEvents: 'auto' }}
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          التصنيفات *
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-3 rounded border" style={{ borderColor: '#E5E7EB' }}>
              <input
                type="checkbox"
                checked={formData.category.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="w-4 h-4"
              />
              <span style={{ color: '#1F2937' }}>{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          تفاصيل المنتج
        </h3>

        <div>
          <label style={{ color: '#1F2937' }} className="block text-sm font-medium mb-2">
            وصف المنتج
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="ادخل وصف المنتج"
            style={{ borderColor: '#E5E7EB', color: '#1F2937', backgroundColor: '#F5F7FA', minHeight: '100px' }}
          />
        </div>
      </div>

      {/* Colors Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          الألوان *
        </h3>
        <div>
          <label style={{ color: '#6B7280' }} className="block text-sm mb-3">
            تصنيف الألوان
          </label>
          <div className="grid grid-cols-5 gap-3">
            {COLORS.map(color => (
              <label key={color.id} className="flex items-center gap-2 cursor-pointer p-2 rounded border" style={{ borderColor: '#E5E7EB' }}>
                <input
                  type="checkbox"
                  name="color"
                  checked={formData.colors.includes(color.id)}
                  onChange={() => toggleColor(color.id)}
                  className="w-4 h-4"
                />
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '2px solid #E5E7EB',
                    backgroundColor: color.hex,
                  }}
                />
                <span style={{ color: '#1F2937', fontSize: '12px' }}>{color.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sizes Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          المقاسات *
        </h3>

        <div className="mb-4">
          <label style={{ color: '#6B7280' }} className="block text-sm mb-2">
            تصنيف المقاسات
          </label>
          <select
            value={selectedSizeCategory}
            onChange={e => setSelectedSizeCategory(e.target.value as keyof typeof SIZES)}
            style={{
              borderColor: '#E5E7EB',
              color: '#1F2937',
              backgroundColor: '#F5F7FA',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
              width: '100%',
            }}
          >
            <option value="">اختر تصنيف المقاسات</option>
            {Object.keys(SIZES).map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedSizeCategory && (
          <div className="grid grid-cols-4 gap-3">
            {SIZES[selectedSizeCategory].map(size => (
              <label
                key={size.id}
                className="flex items-center gap-2 cursor-pointer p-3 rounded border"
                style={{ borderColor: '#E5E7EB', backgroundColor: formData.sizes.includes(size.id) ? '#F0F4F8' : '#FFFFFF' }}
              >
                <input
                  type="checkbox"
                  checked={formData.sizes.includes(size.id)}
                  onChange={() => toggleSize(size.id)}
                  className="w-4 h-4"
                />
                <span style={{ color: '#1F2937' }}>{size.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          صور المنتج
        </h3>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          رفع صور المنتج يساعد على تحسين عرض المنتج وتطوير المبيعات
        </p>

        {/* Upload Area */}
        <label
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition"
          style={{
            borderColor: '#DBEAFE',
            backgroundColor: '#F0F9FF',
          }}
          onDragOver={e => {
            e.preventDefault()
            e.currentTarget.style.backgroundColor = '#E0F2FE'
          }}
          onDragLeave={e => {
            e.currentTarget.style.backgroundColor = '#F0F9FF'
          }}
        >
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} hidden />
          <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: '#3B82F6' }} />
          <p style={{ color: '#1E40AF' }} className="font-medium">
            رفع صور أو سحب القنوات
          </p>
          <p style={{ color: '#0C4A6E' }} className="text-sm">
            PNG, JPG (الحد الأقصى 5 ميجابايت)
          </p>
        </label>

        {/* Image Preview */}
        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden"
                style={{ backgroundColor: '#F0F4F8' }}
              >
                <img src={image} alt={`Product ${index + 1}`} className="w-full h-32 object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Section */}
      <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
          حالة المنتج
        </h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="w-4 h-4"
          />
          <span style={{ color: '#1F2937' }}>تفعيل المنتج والمنتجات متطلب للعملاء</span>
        </label>
      </div>

      {/* Submit Status */}
      {submitStatus.type && (
        <div
          className="p-4 rounded-lg mb-4"
          style={{
            backgroundColor: submitStatus.type === 'success' ? '#DBEAFE' : '#FEE2E2',
            border: `1px solid ${submitStatus.type === 'success' ? '#0EA5E9' : '#DC2626'}`,
            color: submitStatus.type === 'success' ? '#0C4A6E' : '#991B1B',
          }}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            backgroundColor: '#0B1C2C',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          حفظ المنتج
        </button>

        <button
          type="button"
          onClick={() => {
            setFormData({
              itemCode: '',
              category: [],
              description: '',
              sizes: [],
              colors: [],
              images: [],
              isActive: true,
            })
            setSelectedSizeCategory('')
          }}
          style={{
            backgroundColor: '#E5E7EB',
            color: '#1F2937',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          إلغاء
        </button>

        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            padding: '10px 20px',
            borderRadius: '6px',
            border: '1px solid #E5E7EB',
            fontWeight: '600',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          مسح النموذج
        </button>
      </div>
    </form>
  )
}
