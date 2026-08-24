import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ekranın altındaki sayısal durum şeridi (referanstaki alt bant).
 * Sabit sayı yığını yerine gerçek durumu gösterir: aktif bölüm kodu,
 * canlı saat ve sayfa konumu.
 */
const CODES = {
  '/': 'ANA',
  '/hizmetler': 'HZM',
  '/projeler': 'ARŞ',
  '/hakkimizda': 'KRM',
  '/blog': 'KYT',
  '/iletisim': 'BŞV',
}

function pad(value, size = 2) {
  return String(value).padStart(size, '0')
}

export default function Hud() {
  const { pathname } = useLocation()
  const [clock, setClock] = useState('')
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(
        `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ` +
          `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setPercent(max > 0 ? Math.round((window.scrollY / max) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const section =
    CODES[pathname] ?? (pathname.startsWith('/projeler') ? 'ARŞ' : pathname.startsWith('/blog') ? 'KYT' : '404')

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex h-[var(--hud-h)] items-center justify-between gap-4 border-t border-accent/40 bg-bg/95 px-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-accent/80 sm:px-5 sm:text-[10px]"
    >
      <span className="num">DA · {section}</span>
      <span className="num hidden sm:inline">{clock}</span>
      <span className="num">{pad(percent, 3)}%</span>
    </div>
  )
}
