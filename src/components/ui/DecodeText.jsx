import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { classNames } from '../../lib/format'
import { FRAME_MS, GLYPHS, shuffled } from '../../lib/decode'

/**
 * Şifre çözülür (decode) efektiyle kelime değiştiren metin.
 *
 * Her `interval` ms'de bir sıradaki kelimeye geçer; geçişte harfler soldan
 * sağa doğru çözülür, çözülmemiş kısım her karede rastgele karakterlerle
 * yeniden yazılır. Kademeli `setInterval` adımları sitenin geri kalanındaki
 * `steps()` zamanlamasıyla aynı mekanik hissi verir.
 *
 * Turuncu kutu her kelimede kendi genişliğine oturduğu için karışan metnin
 * de aynı genişlikte kalması gerekir. Rastgele bir alfabede karışma metni
 * kelimeden 70 px'e kadar geniş çizilebiliyordu (dar "ı" 15.8 px, geniş "Ü"
 * 39.7 px). Çözüm: her karakterin yerine, o karakterle yakın genişlikte bir
 * glif seçilir ve biriken sapma bir sonraki karakterde telafi edilir, böylece
 * toplam genişlik hedef kelimeden birkaç pikselden fazla ayrılmaz.
 *
 * Erişilebilirlik: animasyonlu katmanlar `aria-hidden`, ekran okuyucular sabit
 * `words[0]` metnini okur — böylece başlığın erişilebilir adı değişmez.
 */

// Testler zamanlamayı buradan okur; sabitler değişince testler kaymaz.
export { FRAME_MS }
export const DECODE_MS = 1100 // bir kelimenin tamamen çözülme süresi
const NEAREST = 5 // aynı genişlik sınıfındaki kaç aday arasından seçilecek

/**
 * Gliflerin gerçek çizim genişliklerini ölçer. Canvas yoksa (jsdom) null döner
 * ve karıştırma yedek yola düşer.
 */
function measureGlyphs(font) {
  const context = document.createElement('canvas').getContext('2d')
  if (!context || !font) return null
  context.font = font
  const table = GLYPHS.split('').map((glyph) => ({ glyph, width: context.measureText(glyph).width }))
  return {
    list: table.sort((a, b) => a.width - b.width),
    of: (char) => context.measureText(char).width,
  }
}

/** Hedef genişliğe en yakın birkaç aday arasından rastgele bir glif seçer. */
function pickGlyph(list, wanted) {
  const nearest = [...list]
    .sort((a, b) => Math.abs(a.width - wanted) - Math.abs(b.width - wanted))
    .slice(0, NEAREST)
  return nearest[Math.floor(Math.random() * nearest.length)]
}

export default function DecodeText({ words, interval = 5000, className }) {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [text, setText] = useState(words[0])
  const [boxWidth, setBoxWidth] = useState(null)
  const sizerRef = useRef(null)
  const textRef = useRef(null)
  const glyphsRef = useRef(null)

  // Dizi her render'da yeniden oluşturulsa bile efektler yeniden kurulmasın
  // diye bağımlılıklarda diziyi değil, uzunluğu ve hedef kelimeyi kullanıyoruz.
  const target = words[index] ?? words[0]
  const count = words.length
  const firstWord = words[0]

  // Hareket azaltma tercihi: efekt tamamen kapanır, ilk kelime sabit kalır.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    setReduced(query.matches)
    const onChange = (event) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Kelime döngüsü
  useEffect(() => {
    if (reduced || count < 2) return
    const id = setInterval(() => setIndex((current) => (current + 1) % count), interval)
    return () => clearInterval(id)
  }, [reduced, count, interval])

  useEffect(() => {
    if (reduced) setIndex(0)
  }, [reduced])

  // Kutu genişliği ve glif ölçüleri. Yazı tipi geç yüklendiğinde ya da pencere
  // yeniden boyutlandığında (başlık boyutu clamp() ile değişir) ResizeObserver
  // ikisini de tazeler.
  useLayoutEffect(() => {
    const node = sizerRef.current
    if (!node) return

    const remeasure = () => {
      setBoxWidth(node.getBoundingClientRect().width)
      if (textRef.current) {
        glyphsRef.current = measureGlyphs(window.getComputedStyle(textRef.current).font)
      }
    }
    remeasure()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(remeasure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

  // Çözülme animasyonu.
  // useLayoutEffect: kutu genişliği de boyama öncesi hesaplandığı için metin
  // ve kutu aynı karede değişir. useEffect ile metin bir kare geriden geliyor,
  // kutu küçülürken eski kelime 54 px dışarı taşıyordu (ölçüldü).
  useLayoutEffect(() => {
    if (reduced) {
      setText(firstWord)
      return
    }

    const scramble = (solved) => {
      const glyphs = glyphsRef.current
      if (!glyphs) return target.slice(0, solved) + shuffled(target.slice(solved))

      let out = target.slice(0, solved)
      let drift = 0 // birikmiş genişlik sapması
      for (let i = solved; i < target.length; i += 1) {
        const wanted = glyphs.of(target[i].toLocaleUpperCase('tr'))
        const picked = pickGlyph(glyphs.list, wanted - drift)
        drift += picked.width - wanted
        out += picked.glyph
      }
      return out
    }

    // İlk tiki beklemeden karıştır: aksi hâlde ilk 55 ms boyunca ekranda hâlâ
    // önceki kelime durur, kutu ise çoktan yeni genişliktedir.
    setText(scramble(0))

    const startedAt = Date.now()
    const id = setInterval(() => {
      const progress = (Date.now() - startedAt) / DECODE_MS
      if (progress >= 1) {
        setText(target)
        clearInterval(id)
        return
      }
      setText(scramble(Math.floor(progress * target.length)))
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [target, reduced, firstWord])

  return (
    <span
      className={classNames('relative inline-block align-baseline', className)}
      style={boxWidth ? { width: `${boxWidth}px` } : undefined}
    >
      {/* Akıştaki katman: satır yüksekliğini ve taban çizgisini belirler,
          genişliği de buradan ölçülür. */}
      <span ref={sizerRef} className="invisible whitespace-pre px-2" aria-hidden="true">
        {target}
      </span>

      {/* Turuncu zemin. Dikeyde em cinsinden taşırılır: İ/Ö/Ü'nün noktaları
          taban çizgisinden 0.91em yukarı, Ş/Ç'nin çengeli 0.23em aşağı
          çıkıyor; satır kutusu bunları kapsamadığı için noktalar dışarıda,
          çengel sınırda kalıyordu. Değerler ölçülerek dengelendi. */}
      <span
        className="absolute inset-x-0 -top-[0.14em] -bottom-[0.15em] block bg-accent"
        aria-hidden="true"
      />

      {/* Metin ayrı katmanda: zeminle birlikte yukarı kaydırılsaydı taban
          çizgisi satırın geri kalanından kopardı. inset-0, akıştaki katmanla
          aynı kutuya oturur, taban çizgisi birebir denk gelir. */}
      <span
        ref={textRef}
        className="absolute inset-0 block text-center text-accent-fg"
        aria-hidden="true"
      >
        {text}
      </span>

      <span className="sr-only">{firstWord}</span>
    </span>
  )
}
