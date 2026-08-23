import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { stats } from '../../data/content'

export default function Hero() {
  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-24 sm:pt-16">
      {/* Ortam ışığı: tek renk, çok düşük yoğunluk — "AI glow" değil, mekân hissi. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[38rem] w-[64rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: 'rgb(var(--ambient-1) / var(--ambient-op))' }}
      />
      {/* İnce hairline ızgara — teknik/mimari doku */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--c-line) / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--c-line) / 0.045) 1px, transparent 1px)',
          backgroundSize: '88px 88px',
          maskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 30%, #000 30%, transparent 78%)',
        }}
      />

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <span className="glass inline-flex animate-fade-up items-center gap-2.5 rounded-full px-4 py-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
              2026 · 3 proje kontenjanı
            </span>
          </span>

          <h1 className="mt-8 animate-fade-up text-display font-semibold text-fg">
            Markanızı dijitalde
            <br className="hidden sm:block" />
            <span className="text-accent"> büyüten </span>
            tasarım ve yazılım
          </h1>

          <p className="mx-auto mt-7 max-w-lg animate-fade-up text-[16.5px] leading-relaxed text-fg-muted">
            Strateji, tasarım ve mühendisliği birleştirerek ölçülebilir sonuç üreten dijital
            ürünler geliştiriyoruz.
          </p>

          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/iletisim" size="lg">
              Ücretsiz teklif alın
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <Button to="/projeler" variant="glass" size="lg">
              Projelerimizi inceleyin
            </Button>
          </div>
        </div>

        {/* Tek cam panel içinde bölünmüş istatistikler — dört ayrı kutu yerine tek malzeme. */}
        <dl className="glass mx-auto mt-[4.5rem] grid max-w-4xl grid-cols-2 overflow-hidden sm:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={item.label}
              className={[
                'px-6 py-7 text-center',
                index % 2 === 1 ? 'border-l hairline' : '',
                index >= 2 ? 'border-t hairline sm:border-t-0' : '',
                index >= 1 ? 'sm:border-l sm:hairline' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <dd className="num font-display text-[2rem] font-semibold text-fg sm:text-[2.25rem]">
                {item.value}
              </dd>
              <dt className="eyebrow mt-2 block">{item.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
