import { clients } from '../../data/content'

export default function ClientMarquee() {
  const items = [...clients, ...clients]

  return (
    <section className="border-y border-line/20 bg-bg-soft/70 py-6">
      <div className="container flex items-center gap-4">
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle sm:inline">
          Kayıtlı kurumlar
        </span>
        <div
          className="relative flex-1 overflow-hidden"
          style={{
            maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          }}
        >
          <div className="flex w-max animate-marquee items-center gap-10">
            {items.map((client, index) => (
              <span
                key={`${client}-${index}`}
                className="flex items-center gap-3 whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.16em] text-fg-muted"
              >
                <span className="h-1 w-1 bg-accent" aria-hidden="true" />
                {client}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
