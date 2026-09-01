import { Link, useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import Logo from '../ui/Logo'
import { SITE } from '../../data/content'
import { useServices } from '../../hooks/useServices'
import { Copy } from '../../lib/siteCopy'
import { listAttrs, useCopy, useList, useSiteCopy } from '../../lib/siteCopyContext'
import { SITE_MENU_ALT } from '../../data/lists'
import { safePath, safeUrl } from '../../lib/url'

const NAV_KEY = 'site.menu.alt'
const SOCIAL_KEY = 'site.sosyal'

export default function Footer() {
  const navigate = useNavigate()
  const { edit } = useSiteCopy()
  const navigation = useList(NAV_KEY, SITE_MENU_ALT)
  const social = useList(SOCIAL_KEY, SITE.social)
  const email = useCopy('site.eposta', SITE.email)
  const phone = useCopy('site.telefon', SITE.phone)
  const { data: services } = useServices({ limit: 5 })

  return (
    <footer className="border-t border-accent/40 bg-accent/[0.03]">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div>
            <Link
              to="/"
              className="glitch-hover inline-flex items-center"
              aria-label="Decha Agency ana sayfa"
            >
              <Logo className="text-[28px]" />
            </Link>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-fg-muted">
              <Copy k="footer.slogan">
                {`${SITE.tagline}. Strateji, tasarım ve mühendislik tek dosyada.`}
              </Copy>
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {social.map((item, index) => (
                <a
                  key={item.label}
                  href={safeUrl(item.href)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="border border-accent/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-accent transition hover:bg-accent hover:text-accent-fg"
                  {...listAttrs(edit, SOCIAL_KEY, index, 'label')}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-accent">
              <Copy k="footer.baslik.bolumler">Bölümler</Copy>
            </p>
            <ul className="mt-4 space-y-2.5">
              {navigation.map((item, index) => (
                <li key={item.to}>
                  <Link
                    to={safePath(item.to)}
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-muted transition hover:text-accent"
                    {...listAttrs(edit, NAV_KEY, index, 'label')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-accent">
              <Copy k="footer.baslik.hizmetler">Hizmetler</Copy>
            </p>
            <ul className="mt-4 space-y-2.5">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to="/hizmetler"
                    className="font-mono text-[12px] uppercase tracking-[0.08em] text-fg-muted transition hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-accent">
              <Copy k="footer.baslik.buro">Büro</Copy>
            </p>
            <ul className="mt-4 space-y-3 text-[13px] text-fg-muted">
              <li className="flex items-start gap-2.5">
                <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${email}`} className="transition hover:text-accent">
                  <Copy k="site.eposta">{SITE.email}</Copy>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <a
                  href={`tel:${phone.replace(/\s|\(|\)/g, '')}`}
                  className="num transition hover:text-accent"
                >
                  <Copy k="site.telefon">{SITE.phone}</Copy>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  <Copy k="site.adres">{SITE.address}</Copy>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Resmî alt şerit */}
        <div className="mt-12 border-t border-accent/30 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/85 sm:flex-row">
            {/* Yönetim paneli girişi: üç kez art arda tıklama.
                event.detail tarayıcının kendi çoklu tıklama sayacı — işletim
                sisteminin zamanlamasını kullanır, elle sayaç tutmaya gerek
                kalmaz. Görünüm değişmez, klavye/ekran okuyucu davranışına
                dokunmaz; erişilebilir yol doğrudan /yonetim adresidir. */}
            <p onClick={(event) => event.detail >= 3 && navigate('/yonetim')}>
              © {new Date().getFullYear()} {SITE.name} · Tüm kayıtlar saklıdır
            </p>
            <p className="num">
              <Copy k="footer.form">Form DA-01 · Rev. 2026.04</Copy>
            </p>
            <Link to="/gizlilik" className="transition hover:text-accent">
              <Copy k="footer.gizlilik">Gizlilik &amp; KVKK</Copy>
            </Link>
            <p>
              <Copy k="footer.teknoloji">React · Supabase · Netlify</Copy>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
