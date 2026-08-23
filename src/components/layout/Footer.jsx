import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
import { SITE, services } from '../../data/content'

const navigation = [
  { to: '/hizmetler', label: 'Hizmetler' },
  { to: '/projeler', label: 'Projeler' },
  { to: '/hakkimizda', label: 'Hakkımızda' },
  { to: '/blog', label: 'Blog' },
  { to: '/iletisim', label: 'İletişim' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line/25 bg-bg-soft/60">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="h-9 w-9" />
              <span className="font-display text-[17px] font-bold uppercase tracking-[0.08em] text-fg">
                Decha
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-fg-muted">
              {SITE.tagline}. Strateji, tasarım ve mühendislik tek dosyada.
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {SITE.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-line/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-muted transition hover:border-accent/50 hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Bölümler</p>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-muted transition hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Hizmetler</p>
            <ul className="mt-4 space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    to="/hizmetler"
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-muted transition hover:text-fg"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Büro</p>
            <ul className="mt-4 space-y-3 text-[13px] text-fg-muted">
              <li className="flex items-start gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <a href={`mailto:${SITE.email}`} className="transition hover:text-fg">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <a
                  href={`tel:${SITE.phone.replace(/\s|\(|\)/g, '')}`}
                  className="num transition hover:text-fg"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resmî alt şerit */}
        <div className="mt-12 border-t border-line/25 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:flex-row">
            <p>© {new Date().getFullYear()} {SITE.name} · Tüm kayıtlar saklıdır</p>
            <p className="num">Form DA-01 · Rev. 2026.04</p>
            <p>React · Supabase · Netlify</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
