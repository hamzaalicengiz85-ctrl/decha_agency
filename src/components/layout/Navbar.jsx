import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
import { classNames } from '../../lib/format'

const links = [
  { to: '/', label: 'Ana Sayfa', code: '00' },
  { to: '/hizmetler', label: 'Hizmetler', code: '01' },
  { to: '/projeler', label: 'Projeler', code: '02' },
  { to: '/hakkimizda', label: 'Hakkımızda', code: '03' },
  { to: '/blog', label: 'Blog', code: '04' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Bürokratik üst şerit: dosya numarası ve durum satırı */}
      <div className="border-b border-line/20 bg-[rgb(var(--bezel-3))] text-[rgb(217_195_165)]">
        <div className="container flex h-7 items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="flex items-center gap-2">
            <span className="led h-1.5 w-1.5" aria-hidden="true" />
            Decha Ajans Bürosu
          </span>
          <span className="hidden sm:inline opacity-70">Dosya no: DA-2026-0417</span>
          <span className="num opacity-70">Durum: Açık</span>
        </div>
      </div>

      {/* Kontrol paneli */}
      <nav
        className="border-b border-line/25 bg-bg-elev/95 backdrop-blur-sm"
        aria-label="Ana menü"
      >
        <div className="container flex h-14 items-center justify-between gap-4 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Decha Agency ana sayfa">
            <Logo className="h-8 w-8" />
            <span className="font-display text-[17px] font-bold uppercase tracking-[0.08em] text-fg">
              Decha
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
                      'flex items-baseline gap-1.5 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition',
                      isActive
                        ? 'border-accent/60 bg-accent/15 text-fg'
                        : 'border-transparent text-fg-muted hover:border-line/25 hover:text-fg',
                    )
                  }
                >
                  <span className="num text-[9px] opacity-55">{link.code}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button to="/iletisim" size="sm">
              Başvuru Aç
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-line/25 text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
          >
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={classNames(
          'overflow-hidden border-b border-line/25 bg-bg-elev transition-[max-height] duration-300 lg:hidden',
          open ? 'max-h-[75vh]' : 'invisible max-h-0',
        )}
        aria-hidden={!open}
        inert={open ? undefined : ''}
      >
        <ul className="container flex flex-col py-2">
          {links.map((link) => (
            <li key={link.to} className="border-b border-line/12 last:border-0">
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'flex items-baseline gap-3 px-1 py-3.5 font-mono text-[13px] uppercase tracking-[0.12em] transition',
                    isActive ? 'text-accent-ink' : 'text-fg-muted',
                  )
                }
              >
                <span className="num text-[10px] opacity-55">{link.code}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="py-3">
            <Button to="/iletisim" className="w-full">
              Başvuru Aç
            </Button>
          </li>
        </ul>
      </div>
    </header>
  )
}
