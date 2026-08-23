import { clients } from '../../data/content'

export default function ClientMarquee() {
  const items = [...clients, ...clients]

  return (
    <section className="border-y hairline py-12">
      <div className="container">
        <p className="eyebrow text-center">Birlikte çalıştığımız markalar</p>
      </div>
      <div
        className="relative mt-9 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)',
        }}
      >
        <div className="flex w-max animate-marquee gap-16 px-8">
          {items.map((client, index) => (
            <span
              key={`${client}-${index}`}
              className="whitespace-nowrap font-display text-lg font-medium tracking-[-0.02em] text-fg-muted/70 transition duration-300 hover:text-fg"
            >
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
