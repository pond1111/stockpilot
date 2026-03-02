import { createClient } from '@supabase/supabase-js'

// ตัวอย่างรูปแบบที่ถูกต้อง
const supabaseUrl = 'https://eawuegpceulvghynzhoe.supabase.co' // ✅ ตรวจสอบให้แน่ใจว่า URL นี้ถูกต้องและตรงกับโปรเจกต์ของคุณ
const supabaseAnonKey = 'sb_publishable_fopqDUnKcDKyTENxk3t9zA_q4BdThI5' // คีย์นี้ต้องเป็น Publishable Key เท่านั้น (ไม่ใช่ Service Role Key)

console.log('🔌 กำลังเชื่อมต่อ Supabase ที่ URL:', supabaseUrl)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
