import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
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
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      <div className="container">
        {/* Yüzen cam çubuk — sayfa içeriği altından geçtikçe bulanıklaşır. */}
        <nav
          className={classNames(
            'flex h-14 items-center justify-between rounded-full pl-5 pr-2 transition-all duration-500 ease-smooth sm:h-16 sm:pl-6 sm:pr-3',
            scrolled || open ? 'glass' : 'border border-transparent',
          )}
          aria-label="Ana menü"
        >
          <Link to="/" className="flex items-center gap-2.5" aria-label="Decha Agency ana sayfa">
            <Logo className="h-7 w-7" />
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-fg">
              Decha
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-full px-4 py-2 text-[13.5px] transition duration-300',
                      isActive
                        ? 'text-fg'
                        : 'text-fg-muted hover:text-fg',
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
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full text-fg lg:hidden"
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
            'mt-2 overflow-hidden transition-[max-height,opacity] duration-500 ease-smooth lg:hidden',
            open ? 'max-h-[70vh] opacity-100' : 'invisible max-h-0 opacity-0',
          )}
          aria-hidden={!open}
          inert={open ? undefined : ''}
        >
          <ul className="glass flex flex-col gap-1 p-3">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    classNames(
                      'block rounded-xl px-4 py-3 text-[15px] transition',
                      isActive ? 'bg-fg/[0.06] text-fg' : 'text-fg-muted hover:text-fg',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="p-1 pt-2">
              <Button to="/iletisim" className="w-full">
                Teklif Al
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
