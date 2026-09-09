import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Görsel yükleme (Supabase Storage · "medya" kovası).
 *
 * Ekip fotoğraflarının panelden yüklenebilmesi için. Yalnız adres alanı
 * bırakmak yetmiyordu: site sahibinin elindeki fotoğrafı önce başka bir yere
 * yükleyip adresini kopyalaması gerekiyordu.
 *
 * Kova ayarları supabase/migrations/0005_medya_bucket.sql içinde:
 * okuma herkese açık, yazma yalnız `authenticated`, 3 MB, yalnız görsel.
 * Buradaki denetimler o kuralların kullanıcıya anlaşılır hâli — asıl sınır
 * sunucuda, istemci denetimi yalnız erken ve okunur bir hata için.
 */

export const KOVA = 'medya'
export const EN_BUYUK_BOYUT = 3 * 1024 * 1024
export const IZINLI_TURLER = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']

const UZANTI = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
}

/** Okunur boyut: hata mesajında "3145728 bayt" yazmasın. */
function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/**
 * Dosya adı sunucuda üretilir gibi davranılır: kullanıcının dosya adı
 * (Türkçe karakter, boşluk, aynı adla ikinci yükleme) yola hiç girmez.
 */
function dosyaAdi(file) {
  const uzanti = UZANTI[file.type] ?? 'bin'
  const rastgele =
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  return `${rastgele}.${uzanti}`
}

/**
 * Dosyayı yükler ve herkese açık adresini döner.
 * Dönüş: { url } | { error }
 */
export async function gorselYukle(file, klasor = 'ekip') {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Supabase bağlantısı yapılandırılmamış.' }
  }
  if (!file) return { error: 'Dosya seçilmedi.' }
  if (!IZINLI_TURLER.includes(file.type)) {
    return { error: 'Yalnız görsel yüklenebilir (JPG, PNG, WEBP, AVIF, GIF).' }
  }
  if (file.size > EN_BUYUK_BOYUT) {
    return {
      error: `Dosya çok büyük (${mb(file.size)}). En fazla ${mb(EN_BUYUK_BOYUT)}.`,
    }
  }

  const yol = `${klasor}/${dosyaAdi(file)}`
  const { error } = await supabase.storage.from(KOVA).upload(yol, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  })

  if (error) {
    if (import.meta.env.DEV) console.error('[Medya] yükleme hatası:', error)
    // Oturum düştüyse panel yeniden giriş isteyebilsin.
    if (error.statusCode === '401' || error.status === 401) {
      return { error: 'Oturum süresi doldu.', needsReauth: true }
    }
    return { error: error.message || 'Yükleme başarısız.' }
  }

  const { data } = supabase.storage.from(KOVA).getPublicUrl(yol)
  return { url: data?.publicUrl ?? '', yol }
}
