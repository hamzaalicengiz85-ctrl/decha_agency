import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Rota değişiminde sayfayı en üste taşır. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof window.scrollTo !== 'function') return
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
