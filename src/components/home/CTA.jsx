import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { SITE } from '../../data/content'

export default function CTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="panel brackets px-6 py-14 text-center sm:px-12 sm:py-20">
            <p className="eyebrow">
              Randevu
              <span className="ml-2 inline-block h-2 w-2 animate-blink bg-accent align-middle" />
            </p>
            <h2 className="phosphor mx-auto mt-5 max-w-2xl text-headline font-bold uppercase text-accent">
              Projenizi kayda geçirelim
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-mono text-[13px] leading-relaxed text-fg-muted">
              30 dakikalık ücretsiz keşif görüşmesinde hedeflerinizi dinleyip yol haritası önerelim.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/iletisim" size="lg">
                Dosya aç
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button href={`mailto:${SITE.email}`} variant="outline" size="lg">
                <Icon name="mail" className="h-4 w-4" />
                {SITE.email}
              </Button>
            </div>
        </div>
      </div>
    </section>
  )
}
