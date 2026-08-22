import { clients } from '../../data/content'

export default function ClientMarquee() {
  const items = [...clients, ...clients]

  return (
    <section className="border-y border-white/10 bg-ink-900/40 py-10">
      <div className="container">
        <p className="text-center text-xs uppercase tracking-[0.24em] text-slate-500">
          Birlikte çalıştığımız markalar
        </p>
      </div>
      <div className="relative mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee gap-14 px-7">
          {items.map((client, index) => (
            <span
              key={`${client}-${index}`}
              className="whitespace-nowrap font-display text-xl font-bold text-slate-600 transition hover:text-slate-300"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
