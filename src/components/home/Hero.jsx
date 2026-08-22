import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { stats } from '../../data/content'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-fade"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[130px]"
      />

      <div className="container relative py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            2026 için 3 proje kontenjanı kaldı
          </span>

          <h1 className="mt-7 animate-fade-up text-4xl font-extrabold leading-[1.1] sm:text-5xl lg:text-6xl">
            Markanızı dijitalde <span className="text-gradient">büyüten</span> tasarım ve yazılım
          </h1>

          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-slate-400 sm:text-lg">
            Decha Agency; strateji, tasarım ve mühendisliği birleştirerek ölçülebilir sonuç üreten
            web siteleri, uygulamalar ve kampanyalar geliştirir.
          </p>

          <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
            <Button to="/iletisim" size="lg">
              Ücretsiz teklif alın
              <Icon name="arrow" className="h-4 w-4" />
            </Button>
            <Button to="/projeler" variant="secondary" size="lg">
              Projelerimizi inceleyin
            </Button>
          </div>
        </div>

        <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:mt-20 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="surface p-6 text-center">
              <dt className="order-2 mt-2 text-xs uppercase tracking-widest text-slate-500">
                {item.label}
              </dt>
              <dd className="order-1 font-display text-3xl font-extrabold text-white sm:text-4xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
