<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue' // เพิ่ม computed เข้ามา
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
  function handleSearch () {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      // ส่งคำค้นหาและหมวดหมู่ที่เลือกไปที่ useProducts.ts
      fetchProducts(searchQuery.value, selectedCategory.value)
    }, 300)
  }

  onMounted(() => {
    fetchProducts()
  })

  async function confirmDelete (id: number) {
    if (confirm('ยืนยันการลบสินค้านี้?')) {
      await deleteProduct(id)
    }
  }

  // ฟังก์ชันสำหรับล้างค่าฟิลเตอร์
  function resetFilters () {
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
          class="add-btn"
          color="primary"
          prepend-icon="mdi-plus"
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
          clearable
          hide-details
          label="ค้นหาชื่อสินค้า..."
          prepend-inner-icon="mdi-magnify"
          rounded="lg"
          variant="outlined"
          @update:model-value="handleSearch"
        />
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          hide-details
          :items="dynamicCategories"
          label="หมวดหมู่"
          rounded="lg"
          variant="outlined"
          @update:model-value="handleSearch"
        />
      </v-col>
    </v-row>

    <v-divider class="my-6" />

    <v-row v-if="!loading && products.length > 0">
      <v-col
        v-for="item in products"
        :key="item.id"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-card class="product-card">
          <v-img class="product-image" cover :src="item.imageUrl">
            <template #placeholder>
              <v-row align="center" class="fill-height ma-0" justify="center">
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
                <v-btn
                  block
                  color="info"
                  rounded="lg"
                  :to="`/edit-${item.id}`"
                  variant="tonal"
                >
                  แก้ไข
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  color="error"
                  rounded="lg"
                  variant="tonal"
                  @click="confirmDelete(item.id)"
                >
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
        <v-progress-circular v-if="loading" color="primary" indeterminate size="64" />
        <div v-else class="empty-state">
          <v-icon color="grey-lighten-2" size="80">mdi-magnify-close</v-icon>
          <p class="text-h6 text-grey-darken-1 mt-4">ไม่พบสินค้าที่ตรงตามเงื่อนไข</p>
          <v-btn color="primary" variant="text" @click="resetFilters">
            ล้างตัวกรองทั้งหมด
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
