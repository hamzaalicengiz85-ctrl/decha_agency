import { createContext, useContext } from 'react'

/**
 * Site metinleri için üzerine yazma katmanının bağlamı ve okuma yardımcıları.
 * Bileşenler `siteCopy.jsx` içinde; ikisi ayrı dosyada çünkü aynı dosyadan
 * hem bileşen hem hook dışa aktarmak Fast Refresh'i bozuyor.
 *
 * Metinler veritabanına taşınmaz; kodda yazdıkları gibi kalır ve varsayılan
 * olarak kullanılır. Tablolardaki kayıtlar yalnızca ÜZERİNE YAZAR:
 *   - Tablolar boşken site bugünkü hâliyle çalışır, veri göçü gerekmez.
 *   - Supabase kapalıysa veya sorgu düşerse site yine açılır.
 *   - Bir metni düzenlemek tek satırlık bir upsert'tür.
 *
 * Boş değer "varsayılanı kullan" demektir: yanlışlıkla boşaltılan bir başlık
 * kalıcı olarak kaybolmaz, koddaki metne geri döner.
 */

export const CACHE_KEY = 'decha:copy:v1'

export const SiteCopyContext = createContext({ copy: {}, lists: {}, edit: false })

/** Düzenleme modu: önizleme iframe'i ?edit=1 ile açılır. */
export function isEditMode() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('edit') === '1'
}

export function useSiteCopy() {
  return useContext(SiteCopyContext)
}

/**
 * Metin okuma. Prop olarak geçilen yazılar ve meta etiketleri için —
 * bileşene sarılamayan yerlerde.
 */
export function useCopy(key, fallback = '') {
  const { copy } = useContext(SiteCopyContext)
  const value = copy[key]
  return typeof value === 'string' && value.trim() !== '' ? value : fallback
}

/** Dizi okuma (sosyal bağlantılar, istatistikler, SSS…). */
export function useList(key, fallback = []) {
  const { lists } = useContext(SiteCopyContext)
  const value = lists[key]
  return Array.isArray(value) && value.length > 0 ? value : fallback
}

/**
 * Dizi öğelerinin düzenlenebilir alanlarını işaretler.
 * Yalnızca düzenleme modunda öznitelik üretir; genel sitede boş nesne döner
 * ve DOM'a hiçbir şey eklenmez.
 */
export function listAttrs(edit, key, index, field) {
  if (!edit) return {}
  return { 'data-list-key': key, 'data-list-index': index, 'data-list-field': field }
}
