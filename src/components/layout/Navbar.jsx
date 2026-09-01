import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
import { Copy } from '../../lib/siteCopy'
import MeetingModal from '../MeetingModal'
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
  const [meetingOpen, setMeetingOpen] = useState(false)
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
    <header className="fixed inset-x-0 top-0 z-50 pl-[var(--rail-w)]">
      {/* Kontrol paneli */}
      <nav
        className="border-b border-accent/45 bg-bg/95 backdrop-blur-sm"
        aria-label="Ana menü"
      >
        <div className="container flex h-14 items-center justify-between gap-4 sm:h-16">
          <Link
            to="/"
            className="glitch-hover flex items-center"
            aria-label="Decha Agency ana sayfa"
          >
            <Logo className="text-[25px] sm:text-[30px]" />
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
                        : 'border-transparent text-fg-muted hover:border-accent/35 hover:text-fg',
                    )
                  }
                >
                  <span className="num text-[9px] opacity-65">{link.code}</span>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <Button type="button" size="sm" onClick={() => setMeetingOpen(true)}>
              <Copy k="menu.toplanti-butonu">Toplantı Planla</Copy>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-accent/50 text-accent lg:hidden"
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
          'overflow-hidden border-b border-accent/45 bg-bg transition-[max-height] duration-300 lg:hidden',
          open ? 'max-h-[75vh]' : 'invisible max-h-0',
        )}
        aria-hidden={!open}
        inert={open ? undefined : ''}
      >
        <ul className="container flex flex-col py-2">
          {links.map((link) => (
            <li key={link.to} className="border-b border-accent/20 last:border-0">
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  classNames(
                    'flex items-baseline gap-3 px-3 py-3.5 font-mono text-[13px] uppercase tracking-[0.12em] transition-colors',
                    isActive ? 'bg-accent text-accent-fg' : 'text-accent',
                  )
                }
              >
                <span className="num text-[10px] opacity-55">{link.code}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="py-3">
            <Button type="button" className="w-full" onClick={() => setMeetingOpen(true)}>
              <Copy k="menu.toplanti-butonu">Toplantı Planla</Copy>
            </Button>
          </li>
        </ul>
      </div>

      <MeetingModal open={meetingOpen} onClose={() => setMeetingOpen(false)} />
    </header>
  )
}
