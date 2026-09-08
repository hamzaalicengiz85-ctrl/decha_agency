import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSiteCopy } from '../../lib/siteCopyContext'

/**
 * İstatistik sayacı: değer görünür alana girince sıfırdan hedefe sayar.
 *
 * Değerler serbest metin ("120+", "45", "%62", "1.1s"), yalnızca içindeki
 * ilk sayı animasyona girer; önündeki ve arkasındaki karakterler olduğu gibi
 * kalır. Böylece panelden girilen her biçim çalışır.
 *
 * Sayı biçimi ilk değerden alınır: "1.234" gibi ayraçlı bir hedef, sayarken
 * de ayraçlı gider. Ondalık varsa basamak sayısı korunur, yoksa tam sayı
 * kalır — "8" sayarken "3.7" görünmez.
 */
const SAYI = /-?\d[\d.,]*/

function ayristir(value) {
  const metin = String(value ?? '')
  const eslesme = metin.match(SAYI)
  if (!eslesme) return null

  const ham = eslesme[0]

  // Nokta iki anlama gelebiliyor. Üçerli gruplanmışsa ("1.234") binlik
  // ayracı; değilse ("1.1s") ondalık nokta sayılıyor — aksi hâlde "1.1s"
  // sayarken "11s" oluyordu.
  const gruplu = /^-?\d{1,3}(\.\d{3})+$/.test(ham)
  const virgullu = ham.includes(',')
  const noktaOndalik = !gruplu && !virgullu && ham.includes('.')

  const sayisal = virgullu
    ? ham.replace(/\./g, '').replace(',', '.')
    : gruplu
      ? ham.replace(/\./g, '')
      : ham
  const sayi = Number(sayisal)
  if (!Number.isFinite(sayi)) return null

  const basamak = virgullu
    ? (ham.split(',')[1]?.length ?? 0)
    : noktaOndalik
      ? (ham.split('.')[1]?.length ?? 0)
      : 0

  return {
    hedef: sayi,
    basamak,
    ayrac: gruplu,
    // Yazarın ondalık ayracını koru: "1.1s" sayarken "1,1s" olmasın.
    noktaOndalik,
    on: metin.slice(0, eslesme.index),
    son: metin.slice(eslesme.index + ham.length),
  }
}

function bicimle({ basamak, ayrac, noktaOndalik }, sayi) {
  const metin = sayi.toLocaleString('tr-TR', {
    minimumFractionDigits: basamak,
    maximumFractionDigits: basamak,
    useGrouping: ayrac,
  })
  return noktaOndalik ? metin.replace(',', '.') : metin
}

const SURE = 1100

export default function CountUp({ value, className, ...rest }) {
  const { edit } = useSiteCopy()
  const { ref, visible } = useScrollReveal({ threshold: 0.4 })
  const parca = ayristir(value)
  const [sayi, setSayi] = useState(null)
  const cerceve = useRef(0)

  useEffect(() => {
    // Düzenleme önizlemesinde ve hareket azaltma tercihinde animasyon yok:
    // panelde metin sürekli değişirse hangi değeri düzenlediğiniz kaybolur.
    if (!parca || !visible || edit) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return

    const baslangic = performance.now()
    const adim = (simdi) => {
      const t = Math.min(1, (simdi - baslangic) / SURE)
      // Sonda yavaşlayan eğri: sayaç hedefe "oturuyor" hissi verir.
      const yumusak = 1 - (1 - t) ** 3
      setSayi(parca.hedef * yumusak)
      if (t < 1) cerceve.current = requestAnimationFrame(adim)
      else setSayi(null) // bitince gerçek metne dön
    }
    cerceve.current = requestAnimationFrame(adim)
    return () => cancelAnimationFrame(cerceve.current)
    // parça her render'da yeniden kurulur; değerin kendisi bağımlılık.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, visible, edit])

  // Sayarken ekran okuyucuya ara değerleri okutmuyoruz; hedef metin sabit.
  const gosterilen =
    sayi === null || !parca ? value : `${parca.on}${bicimle(parca, sayi)}${parca.son}`

  return (
    <span ref={ref} className={className} {...rest}>
      <span aria-hidden={sayi === null ? undefined : 'true'}>{gosterilen}</span>
      {sayi === null ? null : <span className="sr-only">{value}</span>}
    </span>
  )
}
