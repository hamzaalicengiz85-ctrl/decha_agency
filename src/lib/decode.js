/**
 * Şifre çözülme (decode) efektinin ortak parçaları.
 * Hem başlıktaki kelime döngüsü (DecodeText) hem de giriş ekranı (Intro)
 * aynı alfabeyi ve aynı kare süresini kullanır.
 */

// Şifreli görünüm için yabancı karakterler: Latin büyük harfler, rakamlar ve
// terminal sembolleri. Başlıklar büyük harf olduğu için alfabe de büyük harf.
export const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇĞİÖŞÜ0123456789#%&*+=<>[]{}/\\'

/** Kare süresi — kademeli, mekanik akış (sitedeki steps() zamanlamasıyla uyumlu). */
export const FRAME_MS = 55

export function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

/** Fisher-Yates karıştırma. */
export function shuffled(chars) {
  const list = [...chars]
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list.join('')
}

/**
 * Soldan sağa çözülen bir kare üretir: `solved` kadar harf yerine oturmuş,
 * kalanı rastgele gliflerle doldurulmuştur.
 */
export function decodeFrame(target, solved) {
  let out = target.slice(0, solved)
  for (let i = solved; i < target.length; i += 1) out += randomGlyph()
  return out
}

/**
 * `prefers-reduced-motion: reduce` açık mı? matchMedia bulunmayan ortamlarda
 * (jsdom) false döner.
 */
export function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}
