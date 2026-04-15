'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, Loader2, Save, RotateCcw, Trash2, Upload, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

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


interface InventoryItem {
  Inventory_code: string
  Inventory_Name: string
  Retail_Price?: number
  Item_Qty?: number
  Supplier_Name?: string
  Unit_Price?: number
  Cost?: number
}

interface Product {
  id: string | number
  item_code: string
  category: string
  description: string
  size: string
  color: string
  image_url: string
  status: string
}

interface FormData {
  id: string | number
  item_code: string
  price: number
  quantity: number
  manufacturer: string
  categories: string[]
  description: string
  sizes: string[]
  colors: string[]
  images: string[]
  isActive: boolean
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [selectedSizeCategory, setSelectedSizeCategory] = useState<keyof typeof SIZES | ''>('')
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [inventorySearch, setInventorySearch] = useState('')
  const [isLoadingInventory, setIsLoadingInventory] = useState(false)
  const [showInventoryDropdown, setShowInventoryDropdown] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchInventory()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/custom-product-attributes?id=${productId}`)
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        const prod = data.data[0]
        setProduct(prod)

        // Parse categories, colors, sizes from comma-separated strings
        const categories = prod.category
          ? prod.category.split(',').map((c: string) => {
              const cat = CATEGORIES.find(cat => cat.label === c.trim())
              return cat?.id || ''
            }).filter(Boolean)
          : []

        const colors = prod.color
          ? prod.color.split(',').map((c: string) => {
              const col = COLORS.find(col => col.label === c.trim())
              return col?.id || ''
            }).filter(Boolean)
          : []

        const sizes = prod.size ? prod.size.split(',').map(s => s.trim()).filter(Boolean) : []

        // Parse images from JSON array or single image string
        let images: string[] = []
        if (prod.image_url) {
          try {
            // Try to parse as JSON array
            images = JSON.parse(prod.image_url)
            if (!Array.isArray(images)) {
              images = [prod.image_url]
            }
          } catch {
            // If not JSON, treat as single image
            images = [prod.image_url]
          }
        }

        // Fetch inventory data to get price, quantity, and manufacturer
        let price = 0
        let quantity = 0
        let manufacturer = ''
        
        try {
          const inventoryResponse = await fetch('/api/test-db')
          const inventoryData = await inventoryResponse.json()
          if (inventoryData.success && Array.isArray(inventoryData.data)) {
            const inventoryItem = inventoryData.data.find((item: any) => 
              item.Item_Name === prod.item_code || item.Inventory_code === prod.item_code
            )
            if (inventoryItem) {
              price = inventoryItem.Retail_Price || 0
              quantity = inventoryItem.Item_Qty || 0
              manufacturer = inventoryItem.Inventory_Name || ''
            }
          }
        } catch (err) {
          console.error('[ProductEdit] Error fetching inventory for item:', err)
        }

        setFormData({
          id: prod.id,
          item_code: prod.item_code,
          price,
          quantity,
          manufacturer,
          categories,
          description: prod.description,
          sizes,
          colors,
          images,
          isActive: prod.status === 'active',
        })
      } else {
        throw new Error('Product not found')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInventory = async () => {
    try {
      setIsLoadingInventory(true)
      const response = await fetch('/api/test-db')
      const data = await response.json()
      console.log('[ProductEdit] Inventory API response:', data)
      if (data.success && Array.isArray(data.data)) {
        console.log('[ProductEdit] Loaded inventory items:', data.data.length)
        setInventoryItems(data.data)
      } else {
        console.error('[ProductEdit] Invalid response format:', data)
      }
    } catch (err) {
      console.error('[ProductEdit] Error fetching inventory:', err)
    } finally {
      setIsLoadingInventory(false)
    }
  }

  // Debug: Monitor formData changes
  useEffect(() => {
    if (formData) {
      console.log('[ProductEdit] FormData updated:', {
        price: formData.price,
        quantity: formData.quantity,
        manufacturer: formData.manufacturer,
        item_code: formData.item_code,
        fullFormData: formData,
      })
    }
  }, [formData])

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

  const filteredInventory = inventoryItems.filter(item => {
    if (!inventorySearch) return true
    const search = inventorySearch.toLowerCase()
    return (
      item.Inventory_code.toLowerCase().includes(search) ||
      item.Inventory_Name.toLowerCase().includes(search)
    )
  })

  const handleInventorySelect = (item: InventoryItem) => {
    console.log('[ProductEdit] Selected inventory item:', item)
    console.log('[ProductEdit] Price:', item.Retail_Price, 'Qty:', item.Item_Qty, 'Manufacturer:', item.Item_Name)
    
    setFormData(prev => prev ? {
      ...prev,
      item_code: item.Inventory_code,
      price: item.Retail_Price ?? prev.price ?? 0,
      quantity: item.Item_Qty ?? prev.quantity ?? 0,
      manufacturer: item.Item_Name ?? '',
    } : null)
    setInventorySearch('')
    setShowInventoryDropdown(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => prev ? { ...prev, [name]: value } : null)
  }

  const toggleCategory = (id: string) => {
    setFormData(prev => 
      prev ? {
        ...prev,
        categories: prev.categories.includes(id)
          ? prev.categories.filter(c => c !== id)
          : [...prev.categories, id],
      } : null
    )
  }

  const toggleColor = (id: string) => {
    setFormData(prev =>
      prev ? {
        ...prev,
        colors: prev.colors.includes(id)
          ? prev.colors.filter(c => c !== id)
          : [...prev.colors, id],
      } : null
    )
  }

  const toggleSize = (id: string) => {
    setFormData(prev =>
      prev ? {
        ...prev,
        sizes: prev.sizes.includes(id)
          ? prev.sizes.filter(s => s !== id)
          : [...prev.sizes, id],
      } : null
    )
  }

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const result = reader.result as string
          setFormData(prev => prev ? { ...prev, images: [...prev.images, result] } : null)
        }
        reader.readAsDataURL(file)
      })
    }
  }, [])

  const handleRemoveImage = (index: number) => {
    setFormData(prev => prev ? { ...prev, images: prev.images.filter((_, i) => i !== index) } : null)
  }

  const handleSave = async () => {
    if (!formData) return

    // Validate required fields
    if (formData.categories.length === 0) {
      alert('يجب اختيار تصنيف واحد على الأقل')
      return
    }
    if (!formData.description.trim()) {
      alert('يجب إدخال وصف المنتج')
      return
    }
    if (formData.sizes.length === 0) {
      alert('يجب اختيار مقاس واحد على الأقل')
      return
    }
    if (formData.colors.length === 0) {
      alert('يجب اختيار لون واحد على الأقل')
      return
    }

    setIsSaving(true)
    try {
      const categoryLabels = formData.categories
        .map(catId => CATEGORIES.find(c => c.id === catId)?.label || '')
        .filter(Boolean)
        .join(', ')

      const colorLabels = formData.colors
        .map(colorId => COLORS.find(c => c.id === colorId)?.label || '')
        .filter(Boolean)
        .join(', ')

      const payload = {
        id: formData.id,
        item_code: formData.item_code,
        category: categoryLabels,
        description: formData.description,
        size: formData.sizes.join(', '),
        color: colorLabels,
        image_url: formData.images.length > 0 ? JSON.stringify(formData.images) : '',
        status: formData.isActive ? 'active' : 'inactive',
      }

      console.log('[ProductEdit] Submitting payload:', payload)

      const response = await fetch('/api/custom-product-attributes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log('[ProductEdit] API Response:', data)

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ المنتج')
      }

      alert('تم حفظ التغييرات بنجاح')
      // Update the product state with current form data instead of reloading
      setProduct({
        id: formData.id,
        item_code: formData.item_code,
        category: categoryLabels,
        description: formData.description,
        size: formData.sizes.join(', '),
        color: colorLabels,
        image_url: formData.images.length > 0 ? JSON.stringify(formData.images) : '',
        status: formData.isActive ? 'active' : 'inactive',
      })
    } catch (err) {
      console.error('[ProductEdit] Save error:', err)
      alert(`خطأ: ${err instanceof Error ? err.message : 'خطأ غير معروف'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      const response = await fetch(`/api/custom-product-attributes?id=${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (data.success) {
        alert('تم حذف المنتج بنجاح')
        router.push('/products')
      } else {
        throw new Error(data.error || 'Error deleting product')
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleReset = () => {
    fetchProduct()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#F4B400' }} />
      </div>
    )
  }

  if (!product || !formData) {
    return (
      <div className="p-8 text-center" dir="rtl">
        <p style={{ color: '#6B7280' }}>المنتج غير موجود</p>
        <Link href="/products" style={{ color: '#F4B400' }}>
          العودة للمنتجات
        </Link>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link
            href="/products"
            className="font-medium flex items-center gap-1 transition-colors"
            style={{ color: '#F4B400' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#DAA00F')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F4B400')}
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمنتجات
          </Link>
          <span style={{ color: '#E5E7EB' }}>/</span>
          <span style={{ color: '#6B7280' }}>تعديل المنتج</span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>
          تعديل المنتج
        </h1>
        <p style={{ color: '#6B7280' }}>
          قم بتحديث معلومات المنتج والصور
        </p>
      </div>

      <div className="space-y-6">
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
                  value={showInventoryDropdown ? inventorySearch : formData.item_code}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  onFocus={() => setShowInventoryDropdown(true)}
                  placeholder="اختر كود المنتج"
                  style={{ borderColor: '#E5E7EB', color: '#1F2937', backgroundColor: '#F5F7FA', pointerEvents: 'auto' }}
                />
                <ChevronDown
                  className="h-4 w-4"
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: '#6B7280',
                  }}
                />

                {showInventoryDropdown && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      zIndex: 50,
                      maxHeight: '200px',
                      overflowY: 'auto',
                    }}
                  >
                    {isLoadingInventory ? (
                      <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Loader2 className="h-4 w-4 animate-spin" style={{ color: '#F4B400' }} />
                      </div>
                    ) : filteredInventory.length === 0 ? (
                      <div style={{ padding: '12px', textAlign: 'center', color: '#6B7280' }}>
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
                            padding: '10px 12px',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            textAlign: 'right',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F0F0F0',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                        >
                          <div style={{ fontWeight: 'bold', color: '#1F2937', fontSize: '14px' }}>
                            {item.Inventory_code}
                          </div>
                          <div style={{ color: '#6B7280', fontSize: '12px' }}>
                            {item.Inventory_Name}
                          </div>
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
                  checked={formData.categories.includes(cat.id)}
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
                  className="relative rounded-lg overflow-visible"
                  style={{ backgroundColor: '#F0F4F8' }}
                >
                  <img src={image} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      left: '4px',
                      padding: '4px',
                      borderRadius: '4px',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => prev ? { ...prev, isActive: !prev.isActive } : null)}
              style={{
                width: '50px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: formData.isActive ? '#10B981' : '#D1D5DB',
                transition: 'background-color 0.3s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  margin: formData.isActive ? '2px 0 0 24px' : '2px 0 0 2px',
                  transition: 'margin 0.3s',
                }}
              />
            </button>
            <span style={{ color: '#1F2937' }}>
              {formData.isActive ? 'نشط' : 'غير نشط'}
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex gap-3 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              backgroundColor: '#0B1C2C',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
            }}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ التغييرات
          </button>

          <button
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: '#E5E7EB',
              color: '#1F2937',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
            }}
          >
            <RotateCcw className="h-4 w-4" />
            إعادة تعيين
          </button>

          <button
            type="button"
            onClick={handleDelete}
            style={{
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
            }}
          >
            <Trash2 className="h-4 w-4" />
            حذف المنتج
          </button>
        </div>
      </div>
    </div>
  )
}
