/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

import { supabase } from'./lib/supabase';

async function testConnection () {
  const { data, error } = await supabase.from('products').select('*').limit(1)
  if (error) {
    console.error('❌ เชื่อมต่อ Supabase พัง:', error.message)
  } else {
    console.log('✅ เชื่อมต่อ Supabase สำเร็จ! ข้อมูล:', data)
  }
}

testConnection()
