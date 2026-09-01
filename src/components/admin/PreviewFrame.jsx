import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Sitenin gerçek sayfasını iframe içinde gösterir.
 *
 * Neden iframe: sayfayı panelin içinde doğrudan render etmek `min-h-screen`,
 * `100vh`, `position: fixed` (menü, CRT katmanı) ve `body.style.overflow`
 * kilitlerinin panele sızmasına yol açardı. Ayrı bir tarayıcı bağlamı bunların
 * hepsini kendiliğinden çözer.
 *
 * Ölçekleme iframe elemanının kendisine uygulanır; içeride `innerWidth` hâlâ
 * 1280 kalır, böylece medya sorguları ve sabit konumlandırma gerçek bir
 * masaüstündeki gibi davranır.
 */

const FRAME_WIDTH = 1280

export default function PreviewFrame({ src, frameRef: externalRef, onPick, onOutline, onReady }) {
  const wrapperRef = useRef(null)
  const localRef = useRef(null)
  // Panel çerçeveye mesaj gönderebilsin diye ref dışarıdan verilebilir.
  const frameRef = externalRef ?? localRef
  const [scale, setScale] = useState(1)
  const [size, setSize] = useState({ width: FRAME_WIDTH, height: 800 })

  const measure = useCallback(() => {
    const node = wrapperRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    // Asla büyütme: 1280'den geniş alanda sayfa gerçek boyutunda durur.
    const next = Math.min(1, rect.width / FRAME_WIDTH)
    setScale(next)
    setSize({ width: rect.width, height: rect.height })
  }, [])

  useEffect(() => {
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    if (wrapperRef.current) observer.observe(wrapperRef.current)
    return () => observer.disconnect()
  }, [measure])

  useEffect(() => {
    const onMessage = (event) => {
      // Kaynak ve gönderen doğrulaması: sayfadaki başka bir çerçeve panele
      // sahte mesaj yollayamasın.
      if (event.origin !== window.location.origin) return
      if (frameRef.current && event.source !== frameRef.current.contentWindow) return
      const data = event.data
      if (data?.source !== 'decha-edit') return

      if (data.type === 'decha:pick') onPick?.(data)
      if (data.type === 'decha:outline') onOutline?.(data.sections)
      if (data.type === 'decha:ready') onReady?.(data)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [onPick, onOutline, onReady, frameRef])

  return (
    <div ref={wrapperRef} className="h-full w-full overflow-hidden border border-accent/35 bg-bg">
      <iframe
        ref={frameRef}
        src={src}
        title="Sayfa önizlemesi"
        style={{
          width: `${FRAME_WIDTH}px`,
          height: `${scale ? size.height / scale : size.height}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          border: 0,
        }}
      />
    </div>
  )
}
