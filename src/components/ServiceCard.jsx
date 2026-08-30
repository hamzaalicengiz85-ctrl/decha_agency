import Icon from './ui/Icon'
import { classNames } from '../lib/format'
import { Copy } from '../lib/siteCopy'

export default function ServiceCard({ service, index = 0 }) {
  const features = Array.isArray(service.features) ? service.features : []
  const code = String(index + 1).padStart(2, '0')

  return (
    <article className="panel panel-hover brackets flex h-full flex-col p-5"
      data-rec={`services:${service.id ?? ''}`}>
      {/* Form başlığı satırı */}
      <div className="flex items-center justify-between border-b border-accent/35 pb-3">
        <span className="num font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          <Copy k="kart.hizmet.rozet">Hizmet</Copy> {code}
        </span>
        <span className="grid h-8 w-8 place-items-center border border-accent/45 text-accent">
          <Icon name={service.icon} className="h-4 w-4" />
        </span>
      </div>

      <h3 className="mt-5 font-display text-[16px] font-bold uppercase leading-snug text-accent">
        {service.title}
      </h3>
      <p className="mt-3 flex-1 text-[14px] leading-relaxed text-fg-muted">{service.summary}</p>

      {features.length > 0 ? (
        <ul className="mt-5 space-y-2 border-t border-accent/25 pt-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 font-mono text-[11px] text-fg-muted">
              <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      {service.price_from ? (
        <p
          className={classNames(
            'num mt-5 flex items-baseline justify-between border-t border-dashed border-accent/30 pt-4',
            'font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle',
          )}
        >
          <Copy k="kart.hizmet.tarife">Tarife</Copy>
          <span className="text-[13px] font-medium text-fg">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              maximumFractionDigits: 0,
            }).format(service.price_from)}
            <span className="text-fg-subtle">’den</span>
          </span>
        </p>
      ) : null}
    </article>
  )
}
