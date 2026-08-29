import Button from '../ui/Button'
import Icon from '../ui/Icon'
import DecodeText from '../ui/DecodeText'
import { stats } from '../../data/content'

// Başlıktaki vurgu kelimesi 5 saniyede bir çözülerek değişir.
// Sıra sabit tutulur: ilk kelime aynı zamanda ekran okuyucuların okuduğu metin.
const HEADLINE_WORDS = ['büyüten', 'yükselten', 'dönüştüren', 'hızlandıran', 'güçlendiren']

export default function Hero() {
  return (
    <section className="relative py-8 sm:py-12">
      <div className="container relative">
        {/* Ana yayın monitörü */}
        <div className="px-2 py-14 text-center sm:py-20">
            <p className="flex animate-fade-up items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              <span className="h-2 w-2 animate-blink bg-accent" aria-hidden="true" />
              Kayıt açık
              <span className="hatch inline-block h-2.5 w-14" aria-hidden="true" />
            </p>

            <h1 className="phosphor mt-7 animate-fade-up text-display font-bold uppercase text-accent [animation-delay:90ms]">
              Markanızı dijitalde
              <br className="hidden sm:block" />{' '}
              <DecodeText words={HEADLINE_WORDS} /> tasarım ve yazılım
            </h1>

            <p className="mx-auto mt-7 max-w-xl animate-fade-up font-mono text-[13px] leading-relaxed text-fg-muted [animation-delay:180ms]">
              Strateji, tasarım ve mühendisliği tek dosyada topluyoruz. Her proje kayıt altına
              alınır, ölçülür ve raporlanır.
            </p>

            <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:270ms] sm:flex-row">
              <Button to="/iletisim" size="lg">
                Ücretsiz dosya aç
                <Icon name="arrow" className="h-4 w-4" />
              </Button>
              <Button to="/projeler" variant="panel" size="lg">
                Arşivi incele
              </Button>
            </div>

            {/* Ekran altı okuma satırı */}
            {/* Ölçüm paneli: grafik kağıdı zemin, turuncu ayraçlar */}
            <div className="panel brackets mx-auto mt-14 grid max-w-3xl animate-fade-up grid-cols-2 [animation-delay:360ms] sm:grid-cols-4">
              {stats.map((item, index) => (
                <div
                  key={item.label}
                  className={[
                    'px-4 py-6',
                    index % 2 === 1 ? 'border-l border-accent/30' : '',
                    index >= 2 ? 'border-t border-accent/30 sm:border-t-0' : '',
                    index >= 1 ? 'sm:border-l sm:border-accent/30' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <p className="num phosphor font-display text-2xl font-bold text-accent sm:text-3xl">
                    {item.value}
                  </p>
                  <p className="eyebrow mt-1.5">{item.label}</p>
                </div>
              ))}
            </div>
        </div>
      </div>
    </section>
  )
}
