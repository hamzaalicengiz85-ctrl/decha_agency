export function Spinner({ label = 'Kayıt getiriliyor' }) {
  return (
    <div
      className="flex items-center justify-center gap-3 py-12 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle"
      role="status"
    >
      <span className="h-2 w-2 animate-blink bg-accent" />
      <span>{label}…</span>
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="panel animate-pulse p-6">
          <div className="h-8 w-8 bg-accent/20" />
          <div className="mt-6 h-4 w-2/3 bg-accent/20" />
          <div className="mt-3 h-3 w-full bg-accent/10" />
          <div className="mt-2 h-3 w-4/5 bg-accent/10" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title = 'Kayıt bulunamadı', description }) {
  return (
    <div className="panel brackets p-12 text-center">
      <p className="eyebrow">Arşiv</p>
      <h3 className="mt-3 font-display text-lg font-bold uppercase text-accent">{title}</h3>
      {description ? <p className="mt-2 text-sm text-fg-muted">{description}</p> : null}
    </div>
  )
}
