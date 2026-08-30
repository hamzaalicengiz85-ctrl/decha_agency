import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { SITE } from '../../data/content'
import { Copy } from '../../lib/siteCopy'
import { useCopy } from '../../lib/siteCopyContext'

export default function CTA() {
  const email = useCopy('site.eposta', SITE.email)

  return (
    <section className="py-16 sm:py-20">
      <div className="container">
        <div className="panel brackets px-6 py-14 text-center sm:px-12 sm:py-20">
            <p className="eyebrow">
              <Copy k="cta.eyebrow">Randevu</Copy>
              <span className="ml-2 inline-block h-2 w-2 animate-blink bg-accent align-middle" />
            </p>
            <h2 className="phosphor mx-auto mt-5 max-w-2xl text-headline font-bold uppercase text-accent">
              <Copy k="cta.baslik">Projenizi kayda geçirelim</Copy>
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-mono text-[13px] leading-relaxed text-fg-muted">
              <Copy k="cta.aciklama">
                30 dakikalık ücretsiz keşif görüşmesinde hedeflerinizi dinleyip yol haritası
                önerelim.
              </Copy>
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/iletisim" size="lg">
                <Copy k="cta.buton">Dosya aç</Copy>
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button href={`mailto:${email}`} variant="outline" size="lg">
                <Icon name="mail" className="h-4 w-4" />
                <Copy k="site.eposta">{SITE.email}</Copy>
              </Button>
            </div>
        </div>
      </div>
    </section>
  )
}
