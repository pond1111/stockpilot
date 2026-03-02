<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="12" rounded="xl" class="pa-6">
          <v-card-title class="text-h5 font-weight-bold text-center mb-4">
            {{ isRegister ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบจัดการสต๊อก' }}
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="isRegister ? handleRegister() : handleLogin()">
              <v-text-field
                v-model="email"
                label="Email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                type="email"
                placeholder="admin@example.com"
                required
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock"
                variant="outlined"
                type="password"
                placeholder="••••••••"
                required
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <v-btn
                :loading="isLoading"
                color="primary"
                size="large"
                block
                rounded="lg"
                type="submit"
                class="mt-4 font-weight-bold"
              >
                {{ isRegister ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ' }}
              </v-btn>
            </v-form>

            <v-divider class="my-6"></v-divider>

            <div class="text-center">
              <span class="text-grey-darken-1">
                {{ isRegister ? 'มีบัญชีอยู่แล้วใช่ไหม?' : 'ยังไม่มีบัญชีใช่ไหม?' }}
              </span>
              <v-btn
                variant="text"
                color="primary"
                class="ml-1 font-weight-bold"
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
