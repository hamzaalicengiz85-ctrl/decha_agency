import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { SITE } from '../../data/content'

export default function CTA() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container">
        <div className="glass relative overflow-hidden rounded-3xl px-6 py-16 text-center sm:px-12 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full blur-[110px]"
            style={{ background: 'rgb(var(--ambient-1) / var(--ambient-op))' }}
          />
          <div className="relative">
            <p className="eyebrow">Başlayalım</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-headline font-semibold">
              Projenizi konuşalım mı?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-fg-muted">
              30 dakikalık ücretsiz keşif görüşmesinde hedeflerinizi dinleyip yol haritası önerelim.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/iletisim" size="lg">
                Teklif alın
                <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
              <Button href={`mailto:${SITE.email}`} variant="outline" size="lg">
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
