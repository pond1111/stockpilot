<template>
  <v-app>
    <template v-if="$route.path.toLowerCase() === '/login'">
      <router-view />
    </template>

    <template v-else>
      <AdminLayout v-if="user" />

      <v-overlay v-else :model-value="true" class="align-center justify-center">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-overlay>
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuth } from '@/features/useAuth'

const { user, checkUser } = useAuth()

// เมื่อแอปโหลดขึ้นมา ให้เช็คทันทีว่า User ล็อกอินค้างไว้ไหม
onMounted(async () => {
  await checkUser()
})
</script>
