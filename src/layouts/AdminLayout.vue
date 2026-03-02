<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      color="grey-darken-4"
      permanent
      :rail="rail"
      elevation="0"
    >
      <v-list-item
        nav
        prepend-avatar="https://ui-avatars.com/api/?name=Admin&background=random"
        :title="user?.email?.split('@')[0] || 'Admin'"
        :subtitle="user?.email || 'Administrator'"
        class="py-4"
      >
        <template #append>
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider />

      <v-list density="compact" nav class="mt-2">
        <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/" />
        <v-list-item prepend-icon="mdi-package-variant-closed" title="Catalog" to="/catalog" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" />
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            prepend-icon="mdi-logout"
            variant="tonal"
            @click="handleLogout"
          >
            <v-icon v-if="rail">mdi-logout</v-icon>
            <span v-else>Logout</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar border flat class="px-2">
      <v-app-bar-nav-icon @click="rail = !rail" />
      <v-app-bar-title class="font-weight-bold text-uppercase">
        Stock<span class="text-primary">Pilot</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-bell-outline" variant="text"></v-btn>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>

    <v-bottom-navigation v-if="$vuetify.display.mobile" color="primary" grow>
      <v-btn to="/">
        <v-icon>mdi-view-dashboard</v-icon>
        Dashboard
      </v-btn>
      <v-btn to="/catalog">
        <v-icon>mdi-package-variant-closed</v-icon>
        Catalog
      </v-btn>
    </v-bottom-navigation>

    <v-snackbar
      v-model="showToast"
      :color="toastColor"
      timeout="3000"
      elevation="24"
    >
      {{ toastText }}
      <template #actions>
        <v-btn variant="text" @click="showToast = false">ปิด</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '@/features/useAuth'

  // ✅ ดึงข้อมูล User และฟังก์ชัน Logout มาใช้งาน
  const { user, handleLogout: authLogout } = useAuth()

  const drawer = ref(true)
  const rail = ref(false)

  // Toast State
  const showToast = ref(false)
  const toastText = ref('')
  const toastColor = ref('success')

  // ✅ ฟังก์ชัน Logout พร้อมแสดง Toast ก่อนออก (Optional)
  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      await authLogout()
    }
  }
</script>

<style scoped>
/* ปรับแต่งความสวยงามเล็กน้อย */
.v-navigation-drawer {
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
