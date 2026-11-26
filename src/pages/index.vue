<template>
  <v-container>
    <div class="dashboard-header">
      <h1 class="text-h4 font-weight-bold">Dashboard</h1>
      <p class="text-subtitle-1 text-grey">ภาพรวมสถานะสต๊อกสินค้าวันนี้</p>
    </div>

    <v-row v-if="!loading">
      <v-col v-for="stat in displayStats" :key="stat.title" cols="12" sm="4">
        <v-card border flat rounded="xl" class="pa-4 stat-card">
          <div class="d-flex align-center">
            <v-avatar :color="stat.color" variant="tonal" size="56" class="mr-4">
              <v-icon :icon="stat.icon" size="32"></v-icon>
            </v-avatar>
            <div>
              <div class="text-overline mb-n1">{{ stat.title }}</div>
              <div class="text-h4 font-weight-bold">{{ stat.value }}</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!loading" class="mt-4">
      <v-col cols="12">
        <div class="text-subtitle-1 font-weight-bold mb-2 ml-1">แยกตามหมวดหมู่</div>
        <div class="category-container">
          <v-card
            v-for="(count, cat) in categoryStats"
            :key="cat"
            flat
            rounded="lg"
            class="pa-3 category-mini-card"
          >
            <div class="category-label">{{ cat }}</div>
            <div class="category-value">
              {{ count }} <span class="text-caption text-grey font-weight-regular">รายการ</span>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12">
        <v-card border flat rounded="xl" class="recent-card">
          <v-card-title class="font-weight-bold px-6 pt-6">สินค้าเข้าใหม่ล่าสุด</v-card-title>
          <v-list lines="two" class="bg-transparent px-2">
            <v-list-item
              v-for="product in latestProducts"
              :key="product.id"
              :title="product.name"
              :subtitle="`หมวดหมู่: ${product.category} | ราคา: ${product.price} บาท`"
              prepend-icon="mdi-history"
            >
              <template #append>
                <v-chip
                  size="small"
                  :color="product.stock > 5 ? 'success' : 'warning'"
                  variant="flat"
                  class="stock-chip"
                >
                  คงเหลือ: {{ product.stock }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions class="pa-4 pt-0">
            <v-btn block variant="text" color="primary" to="/catalog">ดูทั้งหมด</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProducts } from '@/features/useProducts'
// ✅ Import สไตล์ที่แยกออกมา
import '@/assets/dashboard.css'

const { products, loading, fetchProducts } = useProducts()

onMounted(() => {
  fetchProducts()
})

const displayStats = computed(() => {
  const allProducts = products.value || []
  const totalValue = allProducts.reduce((acc, item) => acc + (Number(item.price || 0) * Number(item.stock || 0)), 0)
  const lowStockCount = allProducts.filter(item => (Number(item.stock) || 0) <= 5).length

  return [
    { title: 'สินค้าทั้งหมด', value: allProducts.length, icon: 'mdi-package-variant', color: 'primary' },
    { title: 'มูลค่าสต๊อก (บาท)', value: totalValue.toLocaleString(), icon: 'mdi-currency-usd', color: 'success' },
    { title: 'สต๊อกใกล้หมด', value: lowStockCount, icon: 'mdi-alert-circle-outline', color: 'warning' }
  ]
})

const categoryStats = computed(() => {
  const stats: Record<string, number> = {}
  products.value?.forEach(item => {
    const cat = item.category || 'อื่นๆ'
    stats[cat] = (stats[cat] || 0) + 1
  })
  return stats
})

const latestProducts = computed(() => {
  return [...(products.value || [])].reverse().slice(0, 5)
})
</script>
