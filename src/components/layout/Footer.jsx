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
    <footer className="relative border-t hairline">
      <div className="container py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo className="h-8 w-8" />
              <span className="font-display text-[17px] font-semibold tracking-[-0.02em] text-fg">
                Decha
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-fg-muted">
              {SITE.tagline}. Strateji, tasarım ve mühendisliği tek ekipte topluyoruz.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {SITE.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border hairline px-4 py-2 text-xs text-fg-muted transition duration-300 hover:border-accent/40 hover:text-fg"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Menü</p>
            <ul className="mt-5 space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-fg-muted transition hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Hizmetler</p>
            <ul className="mt-5 space-y-3 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link to="/hizmetler" className="text-fg-muted transition hover:text-fg">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">İletişim</p>
            <ul className="mt-5 space-y-3.5 text-sm text-fg-muted">
              <li className="flex items-start gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${SITE.email}`} className="transition hover:text-fg">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`tel:${SITE.phone.replace(/\s|\(|\)/g, '')}`}
                  className="num transition hover:text-fg"
                >
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t hairline pt-8 text-xs text-fg-subtle sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.</p>
          <p className="font-mono tracking-tight">React · Supabase · Netlify</p>
        </div>
      </div>
    </footer>
  )
}
