import Button from '../ui/Button'
import Icon from '../ui/Icon'
import Crt from '../ui/Crt'
import { stats } from '../../data/content'

export default function Hero() {
  return (
    <section className="relative py-8 sm:py-12">
      <div className="container relative">
        {/* Ana yayın monitörü */}
        <Crt label="Yayın · Kanal 01" channel="DA-2026-0417">
          <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
            <p className="eyebrow animate-fade-up">
              Kayıt açık
              <span className="ml-2 inline-block h-2 w-2 animate-blink bg-accent align-middle" />
            </p>

            <h1 className="phosphor mt-6 animate-fade-up text-display font-bold uppercase">
              Markanızı dijitalde
              <br className="hidden sm:block" />{' '}
              <span className="text-accent-ink">büyüten</span> tasarım ve yazılım
            </h1>

            <p className="mx-auto mt-7 max-w-xl animate-fade-up font-mono text-[13px] leading-relaxed text-fg-muted">
              Strateji, tasarım ve mühendisliği tek dosyada topluyoruz. Her proje kayıt altına
              alınır, ölçülür ve raporlanır.
            </p>

            <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
              <Button to="/iletisim" size="lg">
                Ücretsiz dosya aç
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button to="/projeler" variant="panel" size="lg">
                Arşivi incele
              </Button>
            </div>

            {/* Ekran altı okuma satırı */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px border border-line/20 bg-line/20 sm:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="bg-bg px-4 py-5">
                  <p className="num font-display text-2xl font-bold text-accent-ink sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="eyebrow mt-1.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Crt>
      </div>
    </section>
  )
}
