import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { supabase } from '@/lib/supabase' // สังเกตว่าต้อง import supabase มาเช็ค session

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ เพิ่ม Navigation Guard เพื่อความปลอดภัย
router.beforeEach(async (to, from, next) => {
  // ดึงข้อมูล Session ปัจจุบันจาก Supabase
  const { data: { session } } = await supabase.auth.getSession()

  const isLoginPage = to.path.toLowerCase() === '/login'

  if (!session && !isLoginPage) {
    // 1. ถ้าไม่มี Session และไม่ใช่หน้า Login -> ให้ไปหน้า Login
    next('/login')
  } else if (session && isLoginPage) {
    // 2. ถ้ามี Session แล้วแต่จะเข้าหน้า Login -> ให้ไปหน้า Dashboard หรือ Catalog
    next('/')
  } else {
    // 3. กรณีอื่นๆ (เช่น เข้าหน้า Login ตอนยังไม่ Login หรือ เข้าหน้า Admin ตอน Login แล้ว) -> ปล่อยผ่าน
    next()
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
