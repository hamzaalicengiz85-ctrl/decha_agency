import { useCallback, useEffect, useState } from 'react'
import { FRAME_MS, decodeFrame, prefersReducedMotion } from '../../lib/decode'

/**
 * Giriş ekranı: siyah panelde "DECHA" şifre çözülür gibi belirir, kilitlendiğini
 * gösteren bir tarama geçer, ardından panel eski televizyon gibi ince bir
 * çizgiye kapanıp siteyi açar.
 *
 * Tasarım kuralları (ui-ux-pro-max):
 * - Aynı anda en fazla bir hareket olur; aşamalar art arda çalışır.
 * - Bu bir yükleme göstergesi değil, marka açılışıdır; sahte ilerleme çubuğu
 *   göstermez ve hiçbir şeyi beklemez. İçerik arkada hazırdır.
 * - `prefers-reduced-motion` açıkken hiç gösterilmez.
 * - Panel `position: fixed` olduğu için sayfa yerleşimini kaydırmaz (CLS ~0).
 */

const WORD = 'DECHA'

// Testler zamanlamayı buradan okur; sabitler değişince testler kaymaz.
export const DECODE_MS = 700 // yazının çözülme süresi
export const LOCK_MS = 260 // "kilitlendi" taraması
export const HOLD_MS = 150 // tekrar gelen ziyaretçide kısa bekleme
export const REVEAL_MS = 380 // panelin kapanma süresi
export const SHORT_REVEAL_MS = 300 // tekrar gelen ziyaretçide kapanma süresi

const SESSION_KEY = 'decha:intro-session' // bu oturumda gösterildi mi
const VISITOR_KEY = 'decha:intro-seen' // daha önce hiç görüldü mü

/** Depolama gizli sekmede ya da kapalı ayarda hata verebilir; sessizce geç. */
function read(storage, key) {
  try {
    return window[storage].getItem(key) === '1'
  } catch {
    return false
  }
}

function write(storage, key) {
  try {
    window[storage].setItem(key, '1')
  } catch {
    // Depolama kapalıysa giriş ekranı her yüklemede tam hâliyle görünür.
  }
}

/**
 * Hangi biçimde gösterilecek:
 * - `full`  → ilk ziyaret: çözülme + tarama + kapanma
 * - `short` → daha önce gelmiş: yalnızca kısa bir marka anı
 * - `none`  → bu oturumda gösterildi ya da hareket azaltma açık
 */
function pickMode() {
  if (prefersReducedMotion()) return 'none'
  if (read('sessionStorage', SESSION_KEY)) return 'none'
  return read('localStorage', VISITOR_KEY) ? 'short' : 'full'
}

/** Her açılışta değişen dosya numarası — bürokratik dilin küçük bir detayı. */
function makeFileNo() {
  const digits = String(Math.floor(1000 + Math.random() * 9000))
  const letters = 'ABCDEFGHJKLMNPRSTUVYZ'
  return `${digits}-${letters[Math.floor(Math.random() * letters.length)]}`
}

export default function Intro() {
  // İlk render'da karar verilir; sonradan açılırsa ekran bir an parlar.
  const [mode] = useState(pickMode)
  const [visible, setVisible] = useState(() => mode !== 'none')
  const [phase, setPhase] = useState(() => (mode === 'full' ? 'decode' : 'hold'))
  const [text, setText] = useState(() => (mode === 'full' ? decodeFrame(WORD, 0) : WORD))
  const [fileNo] = useState(makeFileNo)

  const dismiss = useCallback(() => setPhase('reveal'), [])

  useEffect(() => {
    if (!visible) return
    write('sessionStorage', SESSION_KEY)
    write('localStorage', VISITOR_KEY)

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

  // Aşama zinciri: decode → lock → reveal → kalkış (kısa biçimde hold → reveal)
  useEffect(() => {
    if (!visible) return

    const next = {
      decode: [DECODE_MS + 80, () => setPhase('lock')],
      lock: [LOCK_MS, () => setPhase('reveal')],
      hold: [HOLD_MS, () => setPhase('reveal')],
      reveal: [mode === 'short' ? SHORT_REVEAL_MS : REVEAL_MS, () => setVisible(false)],
    }[phase]

    const id = setTimeout(next[1], next[0])
    return () => clearTimeout(id)
  }, [visible, phase, mode])

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
    <div className="intro" data-phase={phase} data-mode={mode} onClick={dismiss}>
      {/* Kapanan katman ayrı: turuncu çizgi ve "Geç" düğmesi onunla birlikte
          ezilmesin diye dışarıda duruyor. */}
      <div className="intro-panel">
        {/* Dekoratif: ekran okuyucular başlığı zaten sayfadan okur. */}
        <div className="text-center" aria-hidden="true">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/85">
            Dijital Tasarım &amp; Yazılım
          </p>

          <span className="relative mt-5 inline-block">
            <span className="phosphor font-display text-[clamp(3rem,12vw,5rem)] font-bold uppercase leading-none tracking-[0.16em] text-accent">
              {text}
            </span>
            {phase === 'lock' ? <span className="intro-sweep" /> : null}
          </span>

          <p className="num mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
            Dosya No: {fileNo}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="key intro-skip absolute inline-flex min-h-[44px] min-w-[44px] items-center justify-center px-4 font-mono text-[10px] uppercase tracking-[0.18em]"
      >
        Geç
      </button>
    </div>
  )
}
