export function Spinner({ label = 'Yükleniyor' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-400" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-brand-400" />
      <span>{label}…</span>
    </div>
  )
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="surface animate-pulse p-6">
          <div className="h-10 w-10 rounded-xl bg-white/10" />
          <div className="mt-6 h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-3 h-3 w-full rounded bg-white/5" />
          <div className="mt-2 h-3 w-4/5 rounded bg-white/5" />
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title = 'Kayıt bulunamadı', description }) {
  return (
    <div className="surface p-10 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
    </div>
  )
}
