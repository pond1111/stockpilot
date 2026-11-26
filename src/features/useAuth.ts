import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase' // ตรวจสอบว่า path ตรงกับไฟล์ supabase.ts ของคุณ

// ✅ สร้างสถานะ User ไว้นอก Function เพื่อให้ทุกหน้าเห็นข้อมูลชุดเดียวกัน (Global State)
const user = ref<any>(null)

export function useAuth () {
  const router = useRouter()
  const email = ref('')
  const password = ref('')
  const isLoading = ref(false)

  // 1. ✅ ฟังก์ชันตรวจสอบสถานะล่าสุด (เรียกใช้ใน App.vue)
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  // 2. ✅ ฟังก์ชัน Login จริง (เชื่อมต่อ Supabase)
  const handleLogin = async () => {
    if (!email.value || !password.value) {
      alert('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })

      if (error) {
        throw error
      }

      user.value = data.user
      console.log('✅ เข้าสู่ระบบสำเร็จ:', user.value)

      // ล็อกอินเสร็จให้ไปหน้า Catalog ตามที่คุณต้องการ
      router.push('/')
    } catch (error: any) {
      console.error('❌ Login Error:', error.message)
      alert('อีเมลหรือรหัสผ่านไม่ถูกต้อง: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  // 3. ✅ ฟังก์ชัน Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      user.value = null
      router.push('/login')
    } catch (error: any) {
      console.error('Logout Error:', error.message)
    }
  }

  // เพิ่ม handleRegister เข้าไปใน export function useAuth()
  const handleRegister = async () => {
    if (!email.value || !password.value) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    isLoading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })

      if (error) {
        throw error
      }

      alert('สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมล (หากเปิดระบบ Confirm Email ไว้) หรือเข้าสู่ระบบได้เลย')
    // ถ้าสมัครสำเร็จ ปกติ Supabase จะล็อกอินให้เลย หรือจะให้สลับไปหน้า Login ก็ได้
    } catch (error: any) {
      alert('Register Error: ' + error.message)
    } finally {
      isLoading.value = false
    }
  }

  return {
    email,
    password,
    isLoading,
    user, // คืนค่า User เพื่อให้หน้าอื่นเช็คได้
    handleLogin,
    handleLogout, // เพิ่มฟังก์ชัน Logout
    handleRegister, // เพิ่มฟังก์ชัน Register
    checkUser, // เพิ่มฟังก์ชัน Check Status
  }
}
