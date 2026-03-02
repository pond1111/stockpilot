import { ref } from 'vue'

export function useHome () {
  const welcomeMessage = ref('Welcome to StockPilot')
  const appVersion = ref('1.0.0')
  const stats = ref([
    { title: 'สินค้าทั้งหมด', value: '150', icon: 'mdi-package-variant', color: 'primary' },
    { title: 'สต๊อกใกล้หมด', value: '12', icon: 'mdi-alert-circle', color: 'error' },
    { title: 'รายการวันนี้', value: '45', icon: 'mdi-cart-outline', color: 'success' },
  ])
  const recentActivities = ref([
    { id: 1, action: 'แก้ไขสต๊อก', item: 'Premium Widget', time: '2 นาทีที่แล้ว' },
    { id: 2, action: 'เพิ่มสินค้าใหม่', item: 'Eco Device', time: '1 ชั่วโมงที่แล้ว' },
    { id: 3, action: 'สินค้าหมด', item: 'Smart Tool', time: '3 ชั่วโมงที่แล้ว' },
  ])

  const trackVisit = () => {
    console.log('User visited home page')
  }

  return { welcomeMessage, appVersion, stats, recentActivities, trackVisit }
}
