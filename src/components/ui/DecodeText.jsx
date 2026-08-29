import { useEffect, useRef, useState } from 'react'
import { classNames } from '../../lib/format'

/**
 * Şifre çözülür (decode) efektiyle kelime değiştiren metin.
 *
 * Her `interval` ms'de bir sıradaki kelimeye geçer; geçişte harfler soldan
 * sağa doğru rastgele karakterlerden çözülür. Kademeli `setInterval` adımları
 * sitenin geri kalanındaki `steps()` zamanlamasıyla aynı mekanik hissi verir.
 *
 * Erişilebilirlik: animasyonlu katman `aria-hidden`, ekran okuyucular sabit
 * `words[0]` metnini okur — böylece başlığın erişilebilir adı değişmez.
 */

const FRAME_MS = 55 // kare süresi — kademeli, mekanik akış
const DECODE_MS = 720 // bir kelimenin tamamen çözülme süresi

// Dar terminal sembolleri. Harfler kelimelerin kendisinden türetilir:
// rastgele bir alfabe kullanılırsa karışma metni gerçek kelimelerden geniş
// çizilip kutuyu zorluyordu.
const SYMBOLS = '*+=<>/'

function buildAlphabet(words) {
  const letters = new Set()
  for (const word of words) {
    for (const char of word.toLocaleUpperCase('tr')) {
      if (char !== ' ') letters.add(char)
    }
  }
  return [...letters, ...SYMBOLS]
}

export default function DecodeText({ words, interval = 5000, className }) {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [text, setText] = useState(words[0])

  // Dizi her render'da yeniden oluşturulsa bile efektler yeniden kurulmasın
  // diye bağımlılıklarda diziyi değil, uzunluğu ve hedef kelimeyi kullanıyoruz.
  const target = words[index] ?? words[0]
  const count = words.length
  const firstWord = words[0]

  // En uzun kelime kadar yer ayrılır; kelime değişince satır zıplamaz.
  const widest = useRef(words.reduce((a, b) => (b.length > a.length ? b : a), '')).current
  const alphabet = useRef(buildAlphabet(words)).current

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

  // Çözülme animasyonu
  useEffect(() => {
    if (reduced) {
      setText(firstWord)
      return
    }

    const startedAt = Date.now()
    const id = setInterval(() => {
      const progress = (Date.now() - startedAt) / DECODE_MS
      if (progress >= 1) {
        setText(target)
        clearInterval(id)
        return
      }
      const solved = Math.floor(progress * target.length)
      let next = ''
      for (let i = 0; i < target.length; i += 1) {
        next +=
          i < solved ? target[i] : alphabet[Math.floor(Math.random() * alphabet.length)]
      }
      setText(next)
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [target, reduced, firstWord, alphabet])

  return (
    <span className={classNames('relative inline-block align-baseline', className)}>
      {/* Genişliği yalnızca bu görünmez katman belirler; karışan metin
          akışın dışında durduğu için kutu ölçüsü hiç değişmez. */}
      <span className="invisible px-2" aria-hidden="true">
        {widest}
      </span>
      {/* Blok + text-center: metin kendi doğal taban çizgisine oturur, böylece
          kutunun içi satırın geri kalanıyla aynı hizada kalır. Dikey ortalama
          (grid/flex) burada yarım piksel kaydırıp Ş, Ç gibi harflerin
          çengelini kırpıyordu. */}
      <span
        className="absolute inset-0 block bg-accent px-2 text-center text-accent-fg"
        aria-hidden="true"
      >
        {text}
      </span>
      <span className="sr-only">{firstWord}</span>
    </span>
  )
}
