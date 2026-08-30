import { useCallback, useEffect, useState } from 'react'
import { FRAME_MS, decodeFrame, prefersReducedMotion } from '../../lib/decode'

/**
 * Giriş ekranı: siyah panelde "DECHA" şifre çözülür gibi belirir, ardından
 * panel yukarı süpürülüp site açılır.
 *
 * Tasarım kuralları (ui-ux-pro-max):
 * - Görünüm başına en fazla 1-2 öğe canlandırılır: burada çözülen yazı ve
 *   panelin süpürülmesi. Ek dekoratif hareket yok.
 * - Bu bir yükleme göstergesi değil, marka açılışıdır; sahte ilerleme çubuğu
 *   göstermez ve hiçbir şeyi beklemez. İçerik arkada hazırdır.
 * - `prefers-reduced-motion` açıkken hiç gösterilmez.
 * - Panel `position: fixed` olduğu için sayfa yerleşimini kaydırmaz (CLS 0).
 */

const WORD = 'DECHA'
// Testler zamanlamayı buradan okur; sabitler değişince testler kaymaz.
export const DECODE_MS = 800 // yazının çözülme süresi
export const REVEAL_MS = 400 // panelin yukarı süpürülme süresi
const STORAGE_KEY = 'decha:intro-seen'

/** Oturumda daha önce gösterildi mi? Gizli sekmede erişim hata verebilir. */
function alreadySeen() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Depolama kapalıysa giriş ekranı her yüklemede görünür; sorun değil.
  }
}

export default function Intro() {
  // İlk render'da karar verilir; sonradan açılırsa ekran bir an parlar.
  const [visible, setVisible] = useState(() => !prefersReducedMotion() && !alreadySeen())
  const [phase, setPhase] = useState('decode') // 'decode' | 'reveal'
  const [text, setText] = useState(() => decodeFrame(WORD, 0))

  const dismiss = useCallback(() => setPhase('reveal'), [])

  useEffect(() => {
    if (!visible) return
    markSeen()

    // Kaydırmayı kilitle: panel her şeyi kapatıyor, arkadaki sayfa kaymasın.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  // Çözülme
  useEffect(() => {
    if (!visible || phase !== 'decode') return

    const startedAt = Date.now()
    const id = setInterval(() => {
      const progress = (Date.now() - startedAt) / DECODE_MS
      if (progress >= 1) {
        setText(WORD)
        clearInterval(id)
        return
      }
      setText(decodeFrame(WORD, Math.floor(progress * WORD.length)))
    }, FRAME_MS)

    return () => clearInterval(id)
  }, [visible, phase])

  // Çözülme bitince panel süpürülür, süpürme bitince bileşen kalkar.
  useEffect(() => {
    if (!visible) return

    if (phase === 'decode') {
      const id = setTimeout(dismiss, DECODE_MS + 120)
      return () => clearTimeout(id)
    }

    const id = setTimeout(() => setVisible(false), REVEAL_MS)
    return () => clearTimeout(id)
  }, [visible, phase, dismiss])

  // Escape ile atla
  useEffect(() => {
    if (!visible) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [visible, dismiss])

  if (!visible) return null

  return (
    <div className="intro" data-phase={phase} onClick={dismiss}>
      {/* Dekoratif katman: ekran okuyucular başlığı zaten sayfadan okur. */}
      <div className="text-center" aria-hidden="true">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/70">
          Dijital Tasarım &amp; Yazılım
        </p>
        <p className="phosphor mt-5 font-display text-[clamp(2.6rem,9vw,5rem)] font-bold uppercase leading-none tracking-[0.16em] text-accent">
          {text}
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="key absolute bottom-8 right-6 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] sm:bottom-10 sm:right-10"
      >
        Geç
      </button>
    </div>
  )
}
