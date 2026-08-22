import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { classNames } from '../../lib/format'

const links = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/hizmetler', label: 'Hizmetler' },
  { to: '/projeler', label: 'Projeler' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Rota değişince mobil menüyü kapat
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Menü açıkken arka plan kaydırmasını engelle
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled || open
          ? 'border-b border-white/10 bg-ink-950/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="container flex h-20 items-center justify-between" aria-label="Ana menü">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Decha Agency ana sayfa">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white">
            D
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-white">
            Decha<span className="text-brand-400">.</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'rounded-full px-4 py-2 text-sm font-medium transition',
                    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:text-white hover:bg-white/5',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button to="/iletisim" size="sm">
            Teklif Al
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={classNames(
          'overflow-hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-xl transition-[max-height] duration-300 lg:hidden',
          open ? 'max-h-[80vh]' : 'invisible max-h-0 border-t-transparent',
        )}
        aria-hidden={!open}
        inert={open ? undefined : ''}
      >
        <ul className="container flex flex-col gap-1 py-4">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'block rounded-xl px-4 py-3 text-base font-medium transition',
                    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2">
            <Button to="/iletisim" className="w-full">
              Teklif Al
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
