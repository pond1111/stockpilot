<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card class="pa-6" elevation="12" rounded="xl">
          <v-card-title class="text-h5 font-weight-bold text-center mb-4">
            {{ isRegister ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบจัดการสต๊อก' }}
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="isRegister ? handleRegister() : handleLogin()">
              <v-text-field
                v-model="email"
                hide-details="auto"
                class="mb-4"
                label="Email"
                placeholder="admin@example.com"
                prepend-inner-icon="mdi-email"
                required
                type="email"
                variant="outlined"
              />

              <v-text-field
                v-model="password"
                hide-details="auto"
                class="mb-4"
                label="Password"
                placeholder="••••••••"
                prepend-inner-icon="mdi-lock"
                required
                type="password"
                variant="outlined"
              />

              <v-btn
                block
                class="mt-4 font-weight-bold"
                color="primary"
                :loading="isLoading"
                rounded="lg"
                size="large"
                type="submit"
              >
                {{ isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ' }}
              </v-btn>
            </v-form>

            <v-divider class="my-6" />

            <div class="text-center">
              <span class="text-grey-darken-1">
                {{ isRegister ? 'มีบัญชีอยู่แล้วใช่ไหม?' : 'ยังไม่มีบัญชีใช่ไหม?' }}
              </span>
              <v-btn
                class="ml-1 font-weight-bold"
                color="primary"
                variant="text"
                @click="isRegister = !isRegister"
              >
                {{ isRegister ? 'เข้าสู่ระบบที่นี่' : 'สมัครสมาชิกที่นี่' }}
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useAuth } from '@/features/useAuth'

  // ตัวแปรสำหรับสลับสถานะหน้าจอระหว่าง Login และ Register
  const isRegister = ref(false)

  // ดึงตัวแปรและฟังก์ชันทั้งหมดมาจาก useAuth Composable
  const { email, password, handleLogin, handleRegister, isLoading } = useAuth()
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease-in-out;
}
</style>
