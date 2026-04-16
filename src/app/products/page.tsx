'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Eye, Trash2, Loader2, List, Grid3x3, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from '@/components/ui/Input'

interface Product {
  id: number
  item_code: string
  category: string
  description: string
  size: string
  color: string
  image_url: string
  status: string
  price?: number
  created_at: string
  updated_at: string
}

interface ProductImage {
  id: number
  product_id: number
  image_url: string
  display_order: number
}

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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [detailsTab, setDetailsTab] = useState<'basic' | 'colors' | 'stats'>('basic')
  const [imageIndexes, setImageIndexes] = useState<{ [key: number]: number }>({})

  // Helper function to get all images from image_url (handles JSON array or single string)
  const getAllImages = (imageUrl: string): string[] => {
    if (!imageUrl) return []
    try {
      const images = JSON.parse(imageUrl)
      if (Array.isArray(images) && images.length > 0) {
        return images
      }
    } catch {
      // Not JSON, return as single image
      return [imageUrl]
    }
    return []
  }

  const handlePreviousImage = (productId: number, imageCount: number) => {
    setImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] > 0 ? prev[productId] - 1 : imageCount - 1
    }))
  }

  const handleNextImage = (productId: number, imageCount: number) => {
    setImageIndexes(prev => ({
      ...prev,
      [productId]: prev[productId] < imageCount - 1 ? prev[productId] + 1 : 0
    }))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/custom-product-attributes')
      const data = await response.json()
      if (data.success) {
        let products = data.data || []
        
        // Fetch inventory data to enrich products with price information
        try {
          const inventoryResponse = await fetch('/api/test-db')
          const inventoryData = await inventoryResponse.json()
          if (inventoryData.success && Array.isArray(inventoryData.data)) {
            // Merge inventory data with products
            products = products.map((product: Product) => {
              const inventoryItem = inventoryData.data.find((item: any) => 
                item.Item_Name === product.item_code || item.Inventory_code === product.item_code
              )
              return {
                ...product,
                price: inventoryItem?.Retail_Price || 0,
              }
            })
          }
        } catch (err) {
          console.error('[Products] Error fetching inventory data:', err)
        }
        
        setProducts(products)
      } else {
        setError('خطأ في جلب المنتجات')
      }
    } catch (err) {
      setError('خطأ في الاتصال بالخادم')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    try {
      setIsDeleting(id)
      const response = await fetch(`/api/custom-product-attributes?id=${id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (data.success) {
        setProducts(products.filter(p => p.id !== id))
      } else {
        alert(data.error || 'خطأ في حذف المنتج')
      }
    } catch (err) {
      alert('خطأ في حذف المنتج')
      console.error(err)
    } finally {
      setIsDeleting(null)
    }
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category.includes(categoryFilter)
    const matchesStatus = !statusFilter || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Get statistics
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    pending: products.filter(p => p.status === 'pending').length,
    expired: products.filter(p => p.status === 'expired').length,
    discontinued: products.filter(p => p.status === 'discontinued').length,
  }

  return (
    <div dir="rtl" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>
          المنتجات
        </h1>
        <p style={{ color: '#6B7280' }}>
          مرحباً بك في نظام إدارة الاسلي
        </p>
      </div>

      {/* Top Actions */}
      <div className="mb-6 flex items-center justify-between p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div className="flex gap-3">
          <Link href="/add-product">
            <Button style={{ backgroundColor: '#0B1C2C', color: '#FFFFFF', border: 'none' }}>
              <Plus className="h-5 w-5 ml-2" />
              إضافة منتج
            </Button>
          </Link>
          <Button style={{ backgroundColor: '#F4B400', color: '#0B1C2C', border: 'none' }}>
            تحديث المخزون
          </Button>
        </div>
        <span style={{ color: '#6B7280' }}>متزامن مع نظام المخزون • منذ 15 دقيقة</span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">اجمالي المنتجات</div>
          <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>{stats.total}</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">نشط</div>
          <div className="text-3xl font-bold" style={{ color: '#10B981' }}>{stats.active}</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">قيد الانتظار</div>
          <div className="text-3xl font-bold" style={{ color: '#F59E0B' }}>{stats.pending}</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">منتهي الصلاحية</div>
          <div className="text-3xl font-bold" style={{ color: '#EF4444' }}>{stats.expired}</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">مشطوب</div>
          <div className="text-3xl font-bold" style={{ color: '#6B7280' }}>{stats.discontinued}</div>
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div style={{ color: '#6B7280' }} className="text-sm mb-1">اجمالي المنتجات</div>
          <div className="text-3xl font-bold" style={{ color: '#1F2937' }}>6</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="البحث بالرمز أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderColor: '#E5E7EB',
              color: '#1F2937',
              backgroundColor: '#F5F7FA',
            }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              borderColor: '#E5E7EB',
              color: '#1F2937',
              backgroundColor: '#F5F7FA',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
            }}
          >
            <option value="">الكل</option>
            <option value="الملابس">الملابس</option>
            <option value="الأحذية">الأحذية</option>
            <option value="الإكسسوارات">الإكسسوارات</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              borderColor: '#E5E7EB',
              color: '#1F2937',
              backgroundColor: '#F5F7FA',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #E5E7EB',
            }}
          >
            <option value="">الكل</option>
            <option value="active">نشط</option>
            <option value="pending">قيد الانتظار</option>
            <option value="expired">منتهي</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: '#6B7280' }} className="text-sm">عرض من 6 إلى 6 منتج</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded"
              style={{ backgroundColor: viewMode === 'list' ? '#F4B400' : '#E5E7EB' }}
            >
              <List className="h-5 w-5" style={{ color: viewMode === 'list' ? '#0B1C2C' : '#6B7280' }} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded"
              style={{ backgroundColor: viewMode === 'grid' ? '#F4B400' : '#E5E7EB' }}
            >
              <Grid3x3 className="h-5 w-5" style={{ color: viewMode === 'grid' ? '#0B1C2C' : '#6B7280' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#F4B400' }} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <p style={{ color: '#6B7280' }} className="mb-4">لا توجد منتجات</p>
          <Link href="/add-product">
            <Button style={{ backgroundColor: '#0B1C2C', color: '#FFFFFF' }}>
              إضافة منتج جديد
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredProducts.map((product) => {
              const images = getAllImages(product.image_url)
              const currentImageIndex = imageIndexes[product.id] || 0
              const currentImage = images[currentImageIndex] || null
              
              return (
                <div
                  key={product.id}
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}
                >
                {/* Product Image */}
                <div
                  style={{
                    backgroundColor: '#F0F4F8',
                    height: '300px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {product.image_url ? (
                    <>
                      <img src={currentImage || ''} alt={product.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => handlePreviousImage(product.id, images.length)}
                            style={{
                              position: 'absolute',
                              left: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0, 0, 0, 0.5)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 5,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)')}
                          >
                            <ChevronLeft className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                          </button>
                          <button
                            onClick={() => handleNextImage(product.id, images.length)}
                            style={{
                              position: 'absolute',
                              right: '8px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'rgba(0, 0, 0, 0.5)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              zIndex: 5,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)')}
                          >
                            <ChevronRight className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                          </button>
                          {/* Image counter */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              backgroundColor: 'rgba(0, 0, 0, 0.6)',
                              color: '#FFFFFF',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {currentImageIndex + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div style={{ color: '#9CA3AF', fontSize: '14px' }}>No Image</div>
                  )}
                  {/* Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor:
                        product.status === 'expired'
                          ? '#FEE2E2'
                          : product.status === 'pending'
                            ? '#FEF3C7'
                            : '#D1FAE5',
                      color:
                        product.status === 'expired'
                          ? '#DC2626'
                          : product.status === 'pending'
                            ? '#B45309'
                            : '#10B981',
                    }}
                  >
                    {product.status === 'expired' ? 'منتهي' : product.status === 'pending' ? 'منتظر' : 'نشط'}
                  </div>
                </div>

                {/* Product Info - New Layout */}
                <div style={{ padding: '20px' }}>
                  {/* Prices Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ color: '#1F2937', fontWeight: '600', fontSize: '18px' }}>#{product.item_code}</div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '24px', fontWeight: '600', color: '#0B1C2C' }}>
                        ج.م {product.price || 0}
                      </div>
                      <div style={{ fontSize: '16px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                        ج.م {Math.round((product.price || 0) * 1.25)}
                      </div>
                    </div>
                  </div>

                  {/* Colors and Sizes */}
                  {(product.color || product.size) && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {product.color && (
                        <>
                          {product.color.split(',').slice(0, 3).map((colorName, idx) => {
                            const colorObj = COLORS.find(c => c.label === colorName.trim())
                            return (
                              <div
                                key={`color-${idx}`}
                                style={{
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  border: '2px solid #E5E7EB',
                                  backgroundColor: colorObj?.hex || '#CBD5E1',
                                }}
                                title={colorName.trim()}
                              />
                            )
                          })}
                        </>
                      )}
                      {product.size && (
                        <>
                          {product.size.split(',').slice(0, 2).map((size, idx) => (
                            <span
                              key={`size-${idx}`}
                              style={{
                                padding: '3px 8px',
                                fontSize: '10px',
                                backgroundColor: '#FCD34D',
                                color: '#1F2937',
                                borderRadius: '4px',
                                fontWeight: '600',
                              }}
                            >
                              {size.trim()}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {/* Bottom: Item Name and Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E5E7EB' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1F2937', margin: 0 }}>
                      {product.category}
                    </h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/products/${product.id}`}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6B7280' }}>
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6B7280' }}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                </div>
              )
            })}
          </div>

          {/* Details Modal */}
          {selectedProduct && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              onClick={() => setSelectedProduct(null)}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '24px',
                  maxWidth: '600px',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  direction: 'rtl',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6B7280',
                  }}
                >
                  ✕
                </button>

                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px', textAlign: 'center' }}>
                  تفاصيل المنتج
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                  <button
                    onClick={() => setDetailsTab('basic')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: detailsTab === 'basic' ? '#0B1C2C' : '#9CA3AF',
                      fontWeight: detailsTab === 'basic' ? '600' : '400',
                      borderBottom: detailsTab === 'basic' ? '2px solid #0B1C2C' : 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    البيانات الأساسية
                  </button>
                  <button
                    onClick={() => setDetailsTab('colors')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: detailsTab === 'colors' ? '#0B1C2C' : '#9CA3AF',
                      fontWeight: detailsTab === 'colors' ? '600' : '400',
                      borderBottom: detailsTab === 'colors' ? '2px solid #0B1C2C' : 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    الألوان والمقاسات
                  </button>
                  <button
                    onClick={() => setDetailsTab('stats')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: detailsTab === 'stats' ? '#0B1C2C' : '#9CA3AF',
                      fontWeight: detailsTab === 'stats' ? '600' : '400',
                      borderBottom: detailsTab === 'stats' ? '2px solid #0B1C2C' : 'none',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    الإحصائيات
                  </button>
                </div>

                {/* Tab Content */}
                {detailsTab === 'basic' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>اسم المنتج</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{selectedProduct.item_code}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>اسم المنتج</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>التصنيف</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>{selectedProduct.category}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>السعر الأصلي</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>ر.م 1,000</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>سعر البيع</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#0B1C2C' }}>ر.م 800</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>الحالة</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#10B981' }}>
                        {selectedProduct.status === 'active' ? 'نشط' : 'غير نشط'}
                      </p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>الوصف</p>
                      <p style={{ fontSize: '13px', color: '#1F2937', lineHeight: '1.5' }}>{selectedProduct.description || 'بدون وصف'}</p>
                    </div>
                  </div>
                )}

                {detailsTab === 'colors' && (
                  <div>
                    {selectedProduct.color && (
                      <div style={{ marginBottom: '16px' }}>
                        <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px', fontWeight: '600' }}>الألوان المتاحة</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedProduct.color.split(',').map((color, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                backgroundColor: '#F3F4F6',
                                borderRadius: '6px',
                              }}
                            >
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: '50%',
                                  border: '1px solid #E5E7EB',
                                  backgroundColor: color === 'أسود' ? '#000000' : color === 'أبيض' ? '#FFFFFF' : '#CBD5E1',
                                }}
                              />
                              <span style={{ fontSize: '12px', color: '#1F2937' }}>{color.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.size && (
                      <div>
                        <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px', fontWeight: '600' }}>المقاسات المتاحة</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {selectedProduct.size.split(',').map((size, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#FCD34D',
                                color: '#1F2937',
                                borderRadius: '6px',
                                fontWeight: '600',
                                fontSize: '12px',
                              }}
                            >
                              {size.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {detailsTab === 'stats' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>إجمالي المبيعات</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#0B1C2C' }}>125</p>
                      <p style={{ fontSize: '11px', color: '#6B7280' }}>قطعة مباعة</p>
                    </div>
                    <div style={{ padding: '16px', backgroundColor: '#F3F4F6', borderRadius: '8px', textAlign: 'center' }}>
                      <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>إجمالي الإيرادات</p>
                      <p style={{ fontSize: '20px', fontWeight: '600', color: '#10B981' }}>100,000</p>
                      <p style={{ fontSize: '11px', color: '#6B7280' }}>ر.م</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
