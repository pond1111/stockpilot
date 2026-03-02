<template>
  <v-container>
    <div class="mb-6">
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

    <v-row v-if="!loading" class="mt-2">
      <v-col cols="12">
        <div class="text-subtitle-1 font-weight-bold mb-3">สรุปตามหมวดหมู่</div>
        <div class="d-flex flex-wrap gap-2">
          <v-card
            v-for="(count, cat) in categoryStats"
            :key="cat"
            border
            flat
            rounded="lg"
            class="pa-3 mr-2 mb-2"
            min-width="140"
          >
            <div class="text-caption text-grey text-uppercase font-weight-bold">{{ cat }}</div>
            <div class="text-h6 font-weight-bold">{{ count }} <span class="text-caption text-grey">รายการ</span></div>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card border flat rounded="xl">
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
                >
                  สต๊อก: {{ product.stock }}
                </v-chip>
              </template>
            </v-list-item>

            <v-list-item v-if="latestProducts.length === 0 && !loading" class="text-center py-4">
              <v-list-item-title class="text-grey">ยังไม่มีสินค้าในระบบ</v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card-actions class="pa-4 pt-0">
            <v-btn block variant="text" color="primary" to="/catalog">
              ไปหน้าจัดการสินค้า (Catalog)
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useProducts } from '@/features/useProducts'
import '@/assets/dashboard.css' // มั่นใจว่ามีไฟล์สไตล์นี้

const { products, loading, fetchProducts } = useProducts()

onMounted(async () => {
  await fetchProducts()
})

const displayStats = computed(() => {
  const allProducts = products.value || []
  const totalItems = allProducts.length
  const totalValue = allProducts.reduce((acc, item) => {
    return acc + (Number(item.price || 0) * Number(item.stock || 0))
  }, 0)
  const lowStockCount = allProducts.filter(item => (Number(item.stock) || 0) < 5).length

  return [
    { title: 'สินค้าทั้งหมด', value: totalItems, icon: 'mdi-package-variant', color: 'primary' },
    { title: 'มูลค่าสต๊อก (บาท)', value: totalValue.toLocaleString(), icon: 'mdi-currency-usd', color: 'success' },
    { title: 'สต๊อกใกล้หมด', value: lowStockCount, icon: 'mdi-alert-circle-outline', color: 'warning' }
  ]
})

// ✅ ฟังก์ชันคำนวณจำนวนสินค้าแยกตามหมวดหมู่
const categoryStats = computed(() => {
  const allProducts = products.value || []
  const stats: Record<string, number> = {}

  allProducts.forEach(item => {
    const cat = item.category || 'ไม่ระบุ'
    stats[cat] = (stats[cat] || 0) + 1
  })

  return stats
})

const latestProducts = computed(() => {
  if (!products.value) return []
  return [...products.value].reverse().slice(0, 5)
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}
.stat-card {
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-4px);
}
</style>
