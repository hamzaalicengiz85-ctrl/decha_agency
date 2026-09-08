import { createClient } from '@supabase/supabase-js'
import { SUPABASE_ANON_KEY, SUPABASE_KAYNAK, SUPABASE_URL } from './supabaseConfig'

const url = SUPABASE_URL
const anonKey = SUPABASE_ANON_KEY

/**
 * Bağlantı kurulabilir mi? Ortam değişkeni yoksa supabaseConfig.js'deki
 * gömülü varsayılanlar devreye giriyor, bu yüzden normal koşulda hep true.
 * Yine de kontrol duruyor: biri değerleri bilerek boşaltırsa site yedek
 * içerikle açılmaya devam etsin, derleme kırılmasın.
 */
export const isSupabaseConfigured = Boolean(url && anonKey && url.startsWith('http'))

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

if (import.meta.env.DEV) {
  if (!isSupabaseConfigured) {
    console.warn(
      '[Supabase] Bağlantı bilgisi yok. Site yerel demo içerikle çalışıyor, ' +
        'yönetim paneli açılmaz. src/lib/supabaseConfig.js dosyasına bakın.',
    )
  } else if (SUPABASE_KAYNAK === 'gömülü varsayılan') {
    console.info(`[Supabase] ${url} — gömülü varsayılan kullanılıyor (.env yok).`)
  }
}
