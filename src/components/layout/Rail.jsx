import { useEffect, useState } from 'react'

/**
 * Ekranın sol kenarındaki ikon rayı (referanstaki dikey glif sütunu).
 * Dekoratiftir — üst menüyle çakışan ikinci bir gezinme sunmaz, bu yüzden
 * ekran okuyuculardan gizlenir. Alttaki ince iz sayfa ilerlemesini gösterir.
 */
const GLYPHS = [
  // iki nokta üst üste dizisi
  <g key="a">
    <circle cx="4" cy="4" r="1.3" /><circle cx="4" cy="10" r="1.3" />
    <circle cx="10" cy="4" r="1.3" /><circle cx="10" cy="10" r="1.3" />
  </g>,
  // dosya
  <g key="b" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M2.5 3.5h4l1 1.5h4v6h-9z" />
  </g>,
  // kalem
  <g key="c" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M3 11l1-3 5-5 2 2-5 5z" />
  </g>,
  // hedef
  <g key="d" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M3 3l8 8M11 3l-8 8" />
  </g>,
  // liste
  <g key="e" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M3 3.5h8M3 7h8M3 10.5h5" />
  </g>,
]

export default function Rail() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-[calc(var(--bz-b)+26px)] left-[var(--bz-x)] top-[calc(var(--bz-t)+56px)] z-30 hidden w-[var(--rail-w)] flex-col items-center gap-4 border-r border-accent/30 pt-4 md:flex"
    >
      {GLYPHS.map((glyph, index) => (
        <svg
          key={index}
          viewBox="0 0 14 14"
          className="h-3.5 w-3.5 text-accent/70"
          fill="currentColor"
        >
          {glyph}
        </svg>
      ))}

      {/* Sayfa ilerleme izi */}
      <div className="mt-3 flex w-px flex-1 flex-col bg-accent/20">
        <div
          className="w-px bg-accent transition-[height] duration-150"
          style={{ height: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  )
}
