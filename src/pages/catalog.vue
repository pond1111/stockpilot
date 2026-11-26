<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue' // เพิ่ม computed เข้ามา
  import { useProducts } from '@/features/useProducts'
  import '@/assets/catalog.css'

  const { products, loading, fetchProducts, deleteProduct } = useProducts()

  // --- ส่วนของ Search & Filter ---
  const searchQuery = ref('')
  const selectedCategory = ref('ทั้งหมด')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  /**
 * ✅ แก้ไขให้หมวดหมู่ตรงตามข้อมูลจริงในฐานข้อมูล
 * ดึงค่า category จาก products มาทำเป็นลิสต์ที่ไม่ซ้ำกัน
 */
  const dynamicCategories = computed(() => {
    // ดึงค่า category ออกมาทั้งหมด (ถ้าไม่มีให้ใส่ 'ไม่ระบุ')
    const cats = products.value.map(item => item.category || 'ไม่ระบุ')
    // ใช้ Set เพื่อเอาตัวที่ซ้ำกันออก และนำกลับมาเป็น Array โดยมี 'ทั้งหมด' อยู่ลำดับแรก
    return ['ทั้งหมด', ...new Set(cats)]
  })

  // ฟังก์ชันจัดการการค้นหา (Debounce 300ms)
  const handleSearch = () => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      // ส่งคำค้นหาและหมวดหมู่ที่เลือกไปที่ useProducts.ts
      fetchProducts(searchQuery.value, selectedCategory.value)
    }, 300)
  }

  onMounted(() => {
    fetchProducts()
  })

  const confirmDelete = async (id: number) => {
    if (confirm('ยืนยันการลบสินค้านี้?')) {
      await deleteProduct(id)
    }
  }

  // ฟังก์ชันสำหรับล้างค่าฟิลเตอร์
  const resetFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = 'ทั้งหมด'
    fetchProducts()
  }
</script>

<template>
  <v-container class="catalog-container">
    <v-row align="center" class="header-section">
      <v-col>
        <h1 class="page-title">รายการสินค้าทั้งหมด</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="add-btn"
          @click="$router.push('/add-product')"
        >
          เพิ่มสินค้าใหม่
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="searchQuery"
          label="ค้นหาชื่อสินค้า..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          clearable
          rounded="lg"
          @update:model-value="handleSearch"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          label="หมวดหมู่"
          :items="dynamicCategories"
          variant="outlined"
          hide-details
          rounded="lg"
          @update:model-value="handleSearch"
        ></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row v-if="!loading && products.length > 0">
      <v-col v-for="item in products" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <v-card class="product-card">
          <v-img :src="item.imageUrl" class="product-image" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-icon color="grey-lighten-1">mdi-image-outline</v-icon>
              </v-row>
            </template>
          </v-img>

          <v-card-text class="pa-4">
            <div class="product-category text-overline">{{ item.category }}</div>
            <div class="product-name text-truncate">{{ item.name }}</div>
            <div class="product-price">{{ item.price.toLocaleString() }} บาท</div>
            <div class="product-stock" :class="item.stock < 5 ? 'text-error font-weight-bold' : ''">
              คงเหลือ: {{ item.stock }} ชิ้น
            </div>
          </v-card-text>

          <v-card-actions class="pa-4 pt-0">
            <v-row dense>
              <v-col cols="6">
                <v-btn variant="tonal" color="info" block rounded="lg" :to="`/edit-${item.id}`">
                  แก้ไข
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn variant="tonal" color="error" block rounded="lg" @click="confirmDelete(item.id)">
                  ลบ
                </v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="status-container">
      <v-col class="text-center">
        <v-progress-circular v-if="loading" indeterminate color="primary" size="64" />
        <div v-else class="empty-state">
          <v-icon size="80" color="grey-lighten-2">mdi-magnify-close</v-icon>
          <p class="text-h6 text-grey-darken-1 mt-4">ไม่พบสินค้าที่ตรงตามเงื่อนไข</p>
          <v-btn variant="text" color="primary" @click="resetFilters">
            ล้างตัวกรองทั้งหมด
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
