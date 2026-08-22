import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { SITE } from '../../data/content'

export default function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-600/25 via-ink-900 to-accent-600/20 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/25 blur-[100px]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl">
              Projenizi konuşalım mı?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-300">
              30 dakikalık ücretsiz keşif görüşmesinde hedeflerinizi dinleyip yol haritası önerelim.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/iletisim" size="lg">
                Teklif alın
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button href={`mailto:${SITE.email}`} variant="secondary" size="lg">
                <Icon name="mail" className="h-4 w-4" />
                {SITE.email}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
