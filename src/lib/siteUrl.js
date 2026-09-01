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
