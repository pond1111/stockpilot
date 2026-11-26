<template>
  <v-container>
    <v-btn class="mb-4" prepend-icon="mdi-arrow-left" variant="text" @click="$router.push('/catalog')">
      ย้อนกลับไปหน้า Catalog
    </v-btn>

    <h1 class="text-h5 font-weight-bold mb-6">เพิ่มสินค้าใหม่</h1>

    <v-row>
      <v-col cols="12" md="8">
        <v-card border class="pa-6" flat rounded="xl">
          <v-form @submit.prevent="handleAdd">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newProduct.name"
                  label="ชื่อสินค้า"
                  required
                  rounded="lg"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="newProduct.price"
                  label="ราคา (บาท)"
                  rounded="lg"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="newProduct.stock"
                  label="จำนวนสต๊อก"
                  rounded="lg"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <!-- // เอาไว้เลืกหมสดหมู่สินค้า -->
                <v-select
                  v-model="newProduct.category"
                  :items="['Electronics', 'Gadgets', 'Tools', 'General','food']"
                  label="หมวดหมู่"
                  rounded="lg"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="newProduct.imageUrl" label="URL รูปภาพสินค้า" rounded="lg" variant="outlined" />
              </v-col>
              <v-col cols="12">
                <v-btn
                  block
                  color="primary"
                  :loading="isSaving"
                  rounded="lg"
                  size="large"
                  type="submit"
                >
                  บันทึกสินค้าใหม่
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card border class="pa-4 text-center" flat rounded="xl">
          <div class="text-overline mb-2">พรีวิวรูปภาพ</div>
          <v-img
            cover
            class="bg-grey-lighten-2"
            height="200"
            rounded="lg"
            :src="newProduct.imageUrl"
          >
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
                <v-icon>mdi-image-outline</v-icon>
              </v-row>
            </template>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useProducts } from '@/features/useProducts'

  const router = useRouter()
  const { addProduct } = useProducts()
  const isSaving = ref(false)

  const newProduct = ref({
    name: '',
    price: 0,
    stock: 0,
    category: 'General',
    imageUrl: 'https://picsum.photos/300/200', // รูป Mockup พื้นฐาน
  })

  async function handleAdd () {
    if (!newProduct.value.name) return
    isSaving.value = true

    // สร้าง Payload ที่ชื่อ "Key" ตรงกับหัวตารางใน Supabase เป๊ะๆ
    const payload = {
      name: newProduct.value.name,
      price: newProduct.value.price,
      stock: newProduct.value.stock,
      category: newProduct.value.category,
      imageUrl: newProduct.value.imageUrl, // 👈 ถ้าใน DB เป็นตัวเล็กหมด ให้แก้ตรงซ้ายมือนี้ครับ!
    }

    const success = await addProduct(payload)

    if (success) {
      router.push('/catalog')
    } else {
      // ถ้าไม่สำเร็จ ให้ก๊อปปี้ข้อความ Error ใน Console มาบอกผมได้เลย
      alert('บันทึกไม่สำเร็จ เช็ค Console')
    }
    isSaving.value = false
  }
</script>
