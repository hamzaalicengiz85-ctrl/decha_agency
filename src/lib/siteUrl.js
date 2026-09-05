/**
 * Sitenin genel adresi. Netlify'da özel alan adı bağlandığında tek yerden
 * değişsin diye ortam değişkeninden okunur; tanımsızsa Netlify'ın verdiği
 * varsayılan adres kullanılır.
 *
 * Sonda eğik çizgi bırakılmaz: adresler `${SITE_URL}${yol}` ile kurulur.
 */
export const DEFAULT_SITE_URL = 'https://decha-agency.netlify.app'

export function normalizeSiteUrl(value) {
  const raw = (value ?? '').trim()
  if (!/^https?:\/\//.test(raw)) return DEFAULT_SITE_URL
  return raw.replace(/\/+$/, '')
}

export const SITE_URL = normalizeSiteUrl(import.meta.env?.VITE_SITE_URL)

/**
 * Sitenin yayınlandığı dizin. GitHub Pages'te "/decha_agency/", kök dizinde
 * yayınlanırsa "/". Vite derleme sırasında doldurur.
 */
export const BASE_PATH = import.meta.env?.BASE_URL ?? '/'

/**
 * Bir site içi yolun tam adresi.
 *
 * `SITE_URL` yalnızca alan adıdır; alt dizin ön ekini buraya eklemek şart.
 * Canonical'da bu fonksiyon KULLANILMAZ — orada `location.pathname` zaten
 * ön eki taşıyor, ikisini birleştirmek yolu iki kez yazardı.
 */
export function absoluteUrl(path = '') {
  return `${SITE_URL}${BASE_PATH}${String(path).replace(/^\//, '')}`.replace(/\/$/, '')
}
