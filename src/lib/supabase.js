import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Ortam değişkenleri tanımlı mı? Tanımlı değilse site yerel demo içerikle
 * çalışmaya devam eder (build ve deploy asla kırılmaz).
 */
export const isSupabaseConfigured = Boolean(
  url && anonKey && url.startsWith('http') && !url.includes('xxxxxxxx'),
)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        // Yönetim paneli oturumu sayfa yenilemede sürsün diye açık. Anonim
        // ziyaretçinin oturumu olmadığı için genel siteye maliyeti yok:
        // açılışta bir localStorage okuması, o kadar.
        persistSession: true,
        autoRefreshToken: true,
        // Varsayılan true; açık kalırsa supabase-js genel sitede URL
        // parçasını ayrıştırıp temizler. Sihirli bağlantı / OAuth
        // yönlendirmesi kullanmıyoruz, kapalı olmalı.
        detectSessionInUrl: false,
        storageKey: 'decha-auth',
      },
      global: { headers: { 'x-application-name': 'decha-agency-web' } },
    })
  : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY tanımlı değil. ' +
      'Site yerel demo içerikle çalışıyor. .env dosyanızı .env.example baz alarak oluşturun.',
  )
}
