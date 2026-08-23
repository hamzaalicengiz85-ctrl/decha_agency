import Icon from './ui/Icon'

export default function ServiceCard({ service }) {
  const features = Array.isArray(service.features) ? service.features : []

  return (
    <article className="glass glass-hover group flex h-full flex-col p-7">
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl border hairline text-accent">
          <Icon name={service.icon} className="h-5 w-5" />
        </span>
        {service.price_from ? (
          <span className="num font-mono text-[11px] tracking-tight text-fg-subtle">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              maximumFractionDigits: 0,
            }).format(service.price_from)}
            <span className="text-fg-subtle/70">’den</span>
          </span>
        ) : null}
      </div>

      <h3 className="mt-7 text-lg font-semibold text-fg">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{service.summary}</p>

      {features.length > 0 ? (
        <ul className="mt-7 space-y-2.5 border-t hairline pt-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-[13px] text-fg-muted">
              <Icon name="check" className="h-3.5 w-3.5 shrink-0 text-accent" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
