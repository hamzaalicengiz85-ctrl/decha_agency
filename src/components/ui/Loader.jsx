export function Spinner({ label = 'Yükleniyor' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-fg-subtle" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border border-line/20 border-t-accent" />
      <span>{label}…</span>
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass animate-pulse p-7">
          <div className="h-9 w-9 rounded-xl bg-fg/10" />
          <div className="mt-7 h-4 w-2/3 rounded bg-fg/10" />
          <div className="mt-3 h-3 w-full rounded bg-fg/[0.06]" />
          <div className="mt-2 h-3 w-4/5 rounded bg-fg/[0.06]" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title = 'Kayıt bulunamadı', description }) {
  return (
    <div className="glass p-12 text-center">
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      {description ? <p className="mt-2 text-sm text-fg-muted">{description}</p> : null}
    </div>
  )
}
