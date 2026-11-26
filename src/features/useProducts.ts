import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'

// ✅ State ที่ใช้ร่วมกันทั้งแอป (Global State)
const globalProducts = ref<any[]>([])
const isGlobalLoading = ref(false)

export function useProducts() {

  // 1. [Read] ดึงข้อมูลสินค้าพร้อมระบบ Filter
  // เพิ่ม parameter search และ category พร้อมค่า Default
  const fetchProducts = async (search = '', category = '') => {
    isGlobalLoading.value = true
    try {
      // เริ่มต้นสร้าง Query ไปที่ตาราง products
      let query = supabase.from('products').select('*')

      // 🔍 ค้นหาด้วยชื่อ (ถ้ามีคำค้นหา)
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      // 📂 กรองด้วยหมวดหมู่ (ถ้ามีการเลือก และไม่ใช่ 'ทั้งหมด')
      if (category && category !== 'ทั้งหมด') {
        query = query.eq('category', category)
      }

      // เรียงลำดับจากใหม่ไปเก่า (ถ้ามีคอลัมน์ id หรือ created_at)
      const { data, error } = await query.order('id', { ascending: false })

      if (error) throw error

      globalProducts.value = data || []
      console.log('✅ ดึงข้อมูลสำเร็จ:', globalProducts.value)
    } catch (err: any) {
      console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err.message)
    } finally {
      isGlobalLoading.value = false
    }
  }

  // 2. [Create] เพิ่มสินค้าใหม่
  const addProduct = async (payload: any) => {
    try {
      if (!supabase) throw new Error('Supabase not connected')
      const { error } = await supabase.from('products').insert([payload])
      if (error) throw error
      await fetchProducts()
      return true
    } catch (err: any) {
      console.error('❌ เพิ่มไม่สำเร็จ:', err.message)
      return false
    }
  }

  // 3. [Read Single] ดึงข้อมูลสินค้าเฉพาะตัว
  const getProductById = async (id: string | number) => {
    try {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
      if (error) throw error
      return data
    } catch (err: any) {
      console.error('❌ ดึงข้อมูลเฉพาะตัวไม่สำเร็จ:', err.message)
      return null
    }
  }

  // 4. [Update] แก้ไขข้อมูลสินค้า
  const updateProduct = async (id: string | number, payload: any) => {
    try {
      const { error } = await supabase.from('products').update(payload).eq('id', id)
      if (error) throw error
      await fetchProducts()
      return true
    } catch (err: any) {
      console.error('❌ อัปเดตไม่สำเร็จ:', err.message)
      return false
    }
  }

  // 5. [Delete] ลบสินค้า
  const deleteProduct = async (id: string | number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) return false
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      globalProducts.value = globalProducts.value.filter(p => p.id !== id)
      return true
    } catch (err: any) {
      console.error('❌ ลบไม่สำเร็จ:', err.message)
      return false
    }
  }

  // --- 📊 สถิติคำนวณ (Computed) ---

  const totalProducts = computed(() => globalProducts.value.length)

  const totalStockValue = computed(() => {
    return globalProducts.value.reduce((acc, item) => {
      // กันเหนียว: แปลงเป็นตัวเลขก่อนคำนวณ ป้องกันค่า null/undefined
      const price = Number(item.price) || 0
      const stock = Number(item.stock) || 0
      return acc + (price * stock)
    }, 0)
  })

  const lowStockItems = computed(() => {
    return globalProducts.value.filter(item => (Number(item.stock) || 0) < 5)
  })

  return {
    products: globalProducts,
    loading: isGlobalLoading,
    fetchProducts,
    addProduct,
    deleteProduct,
    getProductById,
    updateProduct,
    lowStockItems,
    totalProducts,
    totalStockValue
  }
}
