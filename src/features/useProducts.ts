import { ref, computed } from 'vue'
import axios from 'axios' // 🟢 1. เติม Axios เข้ามาเพื่อใช้คุยกับ Golang
// import { supabase } from '../lib/supabase' // 🔴 คอมเมนต์ปิดไว้ชั่วคราว เพราะรอบนี้เราจะคุยกับ Go

// ✅ State ที่ใช้ร่วมกันทั้งแอป (Global State)
const globalProducts = ref<any[]>([])
const isGlobalLoading = ref(false)

export function useProducts() {

  // 1. [Read] ดึงข้อมูลสินค้า (รอบนี้ดึงจาก Golang Backend แทน)
  const fetchProducts = async (search = '', category = '') => {
    isGlobalLoading.value = true
    try {
      // 🔴 [โค้ดเก่า Supabase - คอมเมนต์ปิดไว้ก่อน]
      /*
      let query = supabase.from('products').select('*')
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      if (category && category !== 'ทั้งหมด') {
        query = query.eq('category', category)
      }
      const { data, error } = await query.order('id', { ascending: false })
      if (error) throw error
      globalProducts.value = data || []
      */

      // 🟢 [โค้ดใหม่ Golang - เปิดใช้งานเส้นนี้]
      // ยิงตรงไปหาเซิร์ฟเวอร์ Go พอร์ต 8080 ที่เราเขียนจำลอง มาม่า กับ ปลากระป๋อง ไว้ครับ
      const response = await axios.get('http://localhost:8080/api/products')

      // เอาข้อมูลที่ได้จาก Go มาเก็บลงในตัวแปรหน้าบ้านทันที
      globalProducts.value = response.data || []
      console.log('✅ ดึงข้อมูลจาก Golang สำเร็จ:', globalProducts.value)

    } catch (err: any) {
      console.error('❌ ดึงข้อมูลจาก Golang ไม่สำเร็จ:', err.message)
    } finally {
      isGlobalLoading.value = false
    }
  }

  // 2. [Create] เพิ่มสินค้าใหม่ (ตอนนี้ใช้กับโค้ด Go จำลองชั่วคราว ข้อมูลจะยังไม่เข้าคลังจริง)
  const addProduct = async (payload: any) => {
    try {
      // 💡 ในอนาคตถ้าจะย้ายไป Go 100% ตรงนี้จะเปลี่ยนเป็น:
      // await axios.post('http://localhost:8080/api/products', payload)

      // ตอนนี้แกล้งทำเป็นว่าสำเร็จเพื่อให้หน้าบ้านทำงานต่อได้ไปก่อนครับ
      globalProducts.value.push({ id: Date.now().toString(), ...payload })
      return true
    } catch (err: any) {
      console.error('❌ เพิ่มไม่สำเร็จ:', err.message)
      return false
    }
  }

  // 3. [Read Single] ดึงข้อมูลสินค้าเฉพาะตัว
  const getProductById = async (id: string | number) => {
    try {
      // 💡 ในอนาคตถ้าใช้ Go: const response = await axios.get(`http://localhost:8080/api/products/${id}`)
      // ตอนนี้หาจากตัวแปรในเครื่องเล่นไปก่อน
      const item = globalProducts.value.find(p => p.id === id)
      return item || null
    } catch (err: any) {
      console.error('❌ ดึงข้อมูลเฉพาะตัวไม่สำเร็จ:', err.message)
      return null
    }
  }

  // 4. [Update] แก้ไขข้อมูลสินค้า
  const updateProduct = async (id: string | number, payload: any) => {
    try {
      // 💡 ในอนาคตถ้าใช้ Go: await axios.put(`http://localhost:8080/api/products/${id}`, payload)
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
      // 💡 ในอนาคตถ้าใช้ Go: await axios.delete(`http://localhost:8080/api/products/${id}`)
      globalProducts.value = globalProducts.value.filter(p => p.id !== id)
      return true
    } catch (err: any) {
      console.error('❌ ลบไม่สำเร็จ:', err.message)
      return false
    }
  }

  // --- 📊 สถิติคำนวณ (Computed เหมือนเดิม ไม่ต้องแก้ เพราะอิงจากข้อมูลที่ส่งมา) ---

  const totalProducts = computed(() => globalProducts.value.length)

  const totalStockValue = computed(() => {
    return globalProducts.value.reduce((acc, item) => {
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
