/**
 * Panelden düzenlenebilen adreslerin şema denetimi.
 *
 * Sosyal bağlantılar ve menü hedefleri artık veritabanından geliyor. React
 * `href` değerini kaçırır ama şemayı denetlemez: `javascript:` yazan bir
 * satır her ziyaretçide çalışan bir betiğe dönüşür (tarayıcıda doğrulandı).
 * Yazma izni `authenticated` rolüne açık olduğu için bu, panele erişen
 * herkesin siteye kalıcı betik enjekte edebilmesi demek.
 *
 * Denetim çizim anında yapılıyor, kaydederken değil: veritabanına başka bir
 * yoldan (SQL editörü, eski kayıt) girmiş bir değer de zararsız kalsın.
 */

/** Şema testinden önce görünmez karakterleri at: "java\tscript:" de yakalansın. */
function probe(value) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex -- kaçırma denemesi tam da bu karakterlerle yapılıyor
    .replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
    .toLowerCase()
}

const ALLOWED = /^(https?|mailto|tel):/
const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)+(\/|\?|#|$)/

/**
 * Dış bağlantılar (`<a href>`). İzin verilmeyen şema `fallback` döner.
 * Şemasız yazılmış alan adları https'e tamamlanır — panelde
 * "instagram.com/decha" yazmak yaygın bir kısayol.
 */
export function safeUrl(value, fallback = '#') {
  const raw = String(value ?? '').trim()
  if (!raw) return fallback

  const test = probe(raw)
  if (test.startsWith('//')) return `https:${raw}`
  if (test.startsWith('/') || test.startsWith('#') || test.startsWith('?')) return raw
  if (ALLOWED.test(test)) return raw
  if (BARE_DOMAIN.test(test)) return `https://${raw}`
  return fallback
}

/**
 * Site içi yollar (React Router `to`). Yalnızca tek eğik çizgiyle başlayan
 * yollar geçer.
 *
 * Ters eğik çizgi de eğik çizgi sayılır: tarayıcılar "/\evil.com" adresini
 * "//evil.com" gibi ele alıp dış siteye gider (React Router 6'daki açık
 * yönlendirme zafiyetinin sınıfı — GHSA-wrjc-x8rr-h8h6).
 */
export function safePath(value, fallback = '/') {
  const raw = String(value ?? '').trim()
  const test = probe(raw).replace(/\\/g, '/')
  if (!test.startsWith('/') || test.startsWith('//')) return fallback
  return raw
}
