import { useRef, useState } from 'react'
import Button from '../ui/Button'
import { EN_BUYUK_BOYUT, IZINLI_TURLER, gorselYukle } from '../../lib/medya'
import { safeUrl } from '../../lib/url'

/**
 * Liste öğelerindeki fotoğraf alanı: yükle · önizle · kaldır.
 *
 * Adres kutusu da duruyor — dışarıda barındırılan bir görselin adresi
 * yapıştırılabilsin. Yükleme onun yerine geçmiyor, kolay yolu ekliyor.
 */
export default function PhotoField({ id, value, onChange, onNeedsReauth }) {
  const inputRef = useRef(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  async function handleFile(event) {
    const file = event.target.files?.[0]
    // Aynı dosya ikinci kez seçilebilsin diye alan hemen sıfırlanır.
    event.target.value = ''
    if (!file) return

    setHata('')
    setYukleniyor(true)
    const sonuc = await gorselYukle(file)
    setYukleniyor(false)

    if (sonuc.needsReauth) return onNeedsReauth?.()
    if (sonuc.error) return setHata(sonuc.error)
    onChange(sonuc.url)
  }

  // Site hangi adresi çiziyorsa panel de onu göstersin: şema denetiminden
  // geçmeyen bir adres (örneğin data:) burada da çizilmemeli.
  const onizleme = value ? safeUrl(value, '') : ''

  return (
    <div className="space-y-2">
      {/* Küçük resim ve adres yan yana; düğmeler çekmecenin tam genişliğinde
          — dar sütuna sıkışınca "Kaldır" alt satıra ortalanmış görünüyordu. */}
      <div className="flex items-center gap-3">
        <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden border border-line/80 bg-accent/[0.04]">
          {onizleme ? (
            <img src={onizleme} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-label text-fg-subtle">yok</span>
          )}
        </span>

        <input
          id={id}
          type="text"
          value={value ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… veya yükleyin"
          className="min-w-0 flex-1 border border-line/80 bg-accent/[0.04] px-3 py-2 font-mono text-meta text-fg focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={yukleniyor}
          onClick={() => inputRef.current?.click()}
        >
          {yukleniyor ? 'Yükleniyor…' : 'Fotoğraf yükle'}
        </Button>
        {value ? (
          <Button type="button" size="sm" variant="outline" onClick={() => onChange('')}>
            Kaldır
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={IZINLI_TURLER.join(',')}
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
      />

      <p className="font-mono text-label text-fg-subtle">
        JPG · PNG · WEBP · en fazla {(EN_BUYUK_BOYUT / 1024 / 1024).toFixed(0)} MB. Kare kırpılır;
        yüz ortada olsun.
      </p>

      {hata ? (
        <p role="alert" className="font-mono text-label text-danger">
          {hata}
        </p>
      ) : null}
    </div>
  )
}
