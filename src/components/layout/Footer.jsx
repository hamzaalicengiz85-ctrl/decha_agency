import { Link } from 'react-router-dom'
import Icon from '../ui/Icon'
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
    <footer className="border-t border-white/10 bg-ink-900/50">
      <div className="container py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 font-display text-lg font-extrabold text-white">
                D
              </span>
              <span className="font-display text-lg font-extrabold text-white">
                Decha<span className="text-brand-400">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {SITE.tagline}. Markanızı dijitalde büyütmek için strateji, tasarım ve yazılımı
              tek çatı altında topluyoruz.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SITE.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition hover:border-brand-500/50 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Menü</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-400 transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Hizmetler</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link to="/hizmetler" className="text-slate-400 transition hover:text-white">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">İletişim</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${SITE.email}`} className="transition hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${SITE.phone.replace(/\s|\(|\)/g, '')}`} className="transition hover:text-white">
                  {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{SITE.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.</p>
          <p>React · Supabase · Netlify ile geliştirildi.</p>
        </div>
      </div>
    </footer>
  )
}
