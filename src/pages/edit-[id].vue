<template>
  <v-container>
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      @click="$router.push('/catalog')"
      class="mb-4"
    >
      ย้อนกลับไปหน้า Catalog
    </v-btn>

    <h1 class="text-h5 font-weight-bold mb-6">แก้ไขข้อมูลสินค้า</h1>

    <v-row v-if="editForm">
      <v-col cols="12" md="8">
        <v-card border flat rounded="xl" class="pa-6">
          <v-form @submit.prevent="handleSave">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editForm.name" label="ชื่อสินค้า" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="editForm.price" label="ราคา (บาท)" type="number" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="editForm.stock" label="จำนวนสต๊อก" type="number" variant="outlined" rounded="lg" />
              </v-col>
              <v-col cols="12">
                <!-- // เอาไว้เลืกหมสดหมู่สินค้า -->
                <v-select
                  v-model="editForm.category"
                  :items="['Electronics', 'Gadgets', 'Tools', 'General','food']"
                  label="หมวดหมู่"
                  variant="outlined"
                  rounded="lg"
                />
              </v-col>
              <v-col cols="12">
                <v-btn block color="primary" size="large" rounded="lg" type="submit" :loading="isSaving">
                  บันทึกการเปลี่ยนแปลง
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center pa-10">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <p class="mt-4 text-grey">กำลังโหลดข้อมูลสินค้า ID: { $route.params.id }</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useProducts } from '@/features/useProducts'

  const route = useRoute('/edit-[id]')
  const router = useRouter()
  const { getProductById, updateProduct } = useProducts()

  const editForm = ref<any>(null)
  const isSaving = ref(false)

  onMounted(async () => { // ✅ เติม async ตรงนี้
    const id = route.params.id as string

    // ✅ ต้องมี await เพื่อรอข้อมูลจาก Supabase
    const item = await getProductById(id)

    if (item) {
      editForm.value = { ...item }
    } else {
      console.error('ไม่พบสินค้า ID:', id)
      // ถ้าหาไม่เจอจริงๆ อาจจะสั่งให้เด้งกลับหน้า Catalog
      // router.push('/catalog')
    }
  })

  const handleSave = async () => {
    if (!editForm.value) return
    isSaving.value = true

    // ✅ ใช้ updateProduct ที่เราเขียนไว้ใน useProducts.ts
    const success = await updateProduct(editForm.value.id, editForm.value)

    if (success) {
      router.push('/catalog')
    }
    isSaving.value = false
  }
</script>
