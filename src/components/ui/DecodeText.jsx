import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { classNames } from '../../lib/format'

/**
 * Şifre çözülür (decode) efektiyle kelime değiştiren metin.
 *
 * Her `interval` ms'de bir sıradaki kelimeye geçer; geçişte harfler soldan
 * sağa doğru çözülür, çözülmemiş kısım her karede yeniden karıştırılır.
 * Kademeli `setInterval` adımları sitenin geri kalanındaki `steps()`
 * zamanlamasıyla aynı mekanik hissi verir.
 *
 * Karışan kısım, hedef kelimenin KENDİ harflerinin karıştırılmışıdır. Rastgele
 * bir alfabe kullanıldığında karışma metni kelimeden 70 px'e kadar geniş
 * çizilebiliyordu (ölçüldü: dar "ı" 15.8 px, geniş "Ü" 39.7 px); aynı harf
 * kümesi karıştırıldığında toplam genişlik tanım gereği hiç değişmez, böylece
 * turuncu kutu kelimeye tam oturur ve karışma sırasında hiç oynamaz.
 *
 * Erişilebilirlik: animasyonlu katman `aria-hidden`, ekran okuyucular sabit
 * `words[0]` metnini okur — böylece başlığın erişilebilir adı değişmez.
 */

const FRAME_MS = 55 // kare süresi — kademeli, mekanik akış
const DECODE_MS = 720 // bir kelimenin tamamen çözülme süresi

/** Fisher-Yates: diziyi yerinde karıştırır. */
function shuffled(chars) {
  const list = [...chars]
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list.join('')
}

export default function DecodeText({ words, interval = 5000, className }) {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [text, setText] = useState(words[0])
  const [boxWidth, setBoxWidth] = useState(null)
  const sizerRef = useRef(null)

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

  // Çözülme animasyonu.
  // useLayoutEffect: kutu genişliği de boyama öncesi hesaplandığı için metin
  // ve kutu aynı karede değişir. useEffect ile metin bir kare geriden geliyor,
  // kutu küçülürken eski kelime 54 px dışarı taşıyordu (ölçüldü).
  useLayoutEffect(() => {
    if (reduced) {
      setText(firstWord)
      return
    }

    // İlk tiki beklemeden karıştır: aksi hâlde ilk 55 ms boyunca ekranda hâlâ
    // önceki kelime durur, kutu ise çoktan yeni genişliktedir.
    setText(shuffled(target))

    const startedAt = Date.now()
    const id = setInterval(() => {
      const progress = (Date.now() - startedAt) / DECODE_MS
      if (progress >= 1) {
        setText(target)
        clearInterval(id)
        return
      }
      const solved = Math.floor(progress * target.length)
      setText(target.slice(0, solved) + shuffled(target.slice(solved)))
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [target, reduced, firstWord])

  // Kutu genişliği: hedef kelimenin doğal genişliği; kelimeyle aynı anda
  // değişir. Genişliğe CSS geçişi verilemiyor: karışma metni yeni kelimenin
  // genişliğinde başladığı için kutu animasyonla yetişirken yazı 32 px'e kadar
  // dışarı taşıyordu (ölçüldü). Yazı tipi geç yüklendiğinde ya da pencere
  // yeniden boyutlandığında (başlık boyutu clamp() ile değişir) ResizeObserver
  // yeniden ölçer.
  useLayoutEffect(() => {
    const node = sizerRef.current
    if (!node) return

    const measure = () => setBoxWidth(node.getBoundingClientRect().width)
    measure()

    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [target])

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
          çengel sınırda kalıyordu. Değerler ölçülerek dengelendi: her iki
          uçta da ~6 px boşluk kalıyor. */}
      <span
        className="absolute inset-x-0 -top-[0.14em] -bottom-[0.15em] block bg-accent"
        aria-hidden="true"
      />

      {/* Metin ayrı katmanda: zeminle birlikte yukarı kaydırılsaydı taban
          çizgisi satırın geri kalanından kopardı. inset-0, akıştaki katmanla
          aynı kutuya oturur, taban çizgisi birebir denk gelir. */}
      <span
        className="absolute inset-0 block text-center text-accent-fg"
        aria-hidden="true"
      >
        {text}
      </span>

      <span className="sr-only">{firstWord}</span>
    </span>
  )
}
