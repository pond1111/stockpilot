import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Navigation Guard เพื่อความปลอดภัย
router.beforeEach(async (to, from, next) => {
  // 1. ดึงข้อมูล Session ล่าสุดจาก Supabase อัปเดตแบบเรียลไทม์
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  // 2. ปรับการเช็คตัวพิมพ์เล็ก-ใหญ่ และเครื่องหมาย / ท้าย URL ให้แม่นยำขึ้น
  const targetPath = to.path.replace(/\/$/, '').toLowerCase()
  const isLoginPage = targetPath === '/login'

  if (!isLoggedIn && !isLoginPage) {
    // ถ้าไม่ได้ล็อกอิน และไม่ใช่หน้า Login -> บังคับไปหน้า Login
    next({ path: '/login' })
  } else if (isLoggedIn && isLoginPage) {
    // ถ้าล็อกอินแล้ว แต่จะแอบเข้าหน้า Login ซ้ำ -> ดีดไปหน้า Catalog หรือหน้าหลัก
    next({ path: '/' })
  } else {
    // กรณีอื่นๆ -> ปล่อยผ่านปกติ
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
