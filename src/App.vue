<template>
  <v-app>
    <v-overlay class="align-center justify-center" :model-value="isCheckingAuth" permanent>
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>

    <template v-if="!isCheckingAuth">
      <template v-if="$route.path.toLowerCase() === '/login'">
        <router-view />
      </template>

      <template v-else-if="user">
        <AdminLayout />
      </template>

      <template v-else>
        <router-view />
      </template>
    </template>
  </v-app>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useAuth } from '@/features/useAuth'
  import AdminLayout from '@/layouts/AdminLayout.vue'

  const { user, checkUser } = useAuth()
  const isCheckingAuth = ref(true) // เพิ่มตัวแปรเช็คสถานะการโหลดขอบเขตแรก

  onMounted(async () => {
    try {
      await checkUser() // รอตรวจสอบเซสชันเก่าในเครื่องจาก Supabase
    } catch (error) {
      console.error('Auth verification failed:', error)
    } finally {
      isCheckingAuth.value = false // เช็คเสร็จแล้ว ปิดตัวหมุนใหญ่
    }
  })
</script>
