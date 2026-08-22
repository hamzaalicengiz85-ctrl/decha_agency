import Icon from './ui/Icon'

export default function ServiceCard({ service }) {
  const features = Array.isArray(service.features) ? service.features : []

  return (
    <article className="surface surface-hover group flex h-full flex-col p-7">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-accent-500/20 text-brand-300 ring-1 ring-inset ring-white/10">
        <Icon name={service.icon} className="h-6 w-6" />
      </span>

      <h3 className="mt-6 text-xl font-bold text-white">{service.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{service.summary}</p>

      {features.length > 0 ? (
        <ul className="mt-6 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
              <Icon name="check" className="h-4 w-4 shrink-0 text-brand-400" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}

      {service.price_from ? (
        <p className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">
          Başlangıç:{' '}
          <span className="font-semibold text-white">
            {new Intl.NumberFormat('tr-TR', {
              style: 'currency',
              currency: 'TRY',
              maximumFractionDigits: 0,
            }).format(service.price_from)}
          </span>
        </p>
      ) : null}
    </article>
  )
}
