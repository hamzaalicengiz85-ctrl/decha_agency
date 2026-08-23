import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import CTA from '../components/home/CTA'
import Icon from '../components/ui/Icon'
import { usePageMeta } from '../lib/seo'
import { stats } from '../data/content'
import { initials } from '../lib/initials'

const values = [
  {
    icon: 'compass',
    title: 'Önce hedef',
    text: 'Güzel görünen değil, işe yarayan çözümler üretiriz. Her kararın arkasında bir hedef vardır.',
  },
  {
    icon: 'sparkles',
    title: 'Detaycılık',
    text: 'Piksel hizasından kod kalitesine kadar detaylara takıntılıyız; fark orada oluşur.',
  },
  {
    icon: 'trending',
    title: 'Ölçülebilirlik',
    text: 'Yayın sonrası veriyi takip eder, iyileştirmeleri veriye dayandırırız.',
  },
  {
    icon: 'shield',
    title: 'Şeffaflık',
    text: 'Süreç boyunca ne yaptığımızı, neden yaptığımızı ve nerede olduğumuzu açıkça paylaşırız.',
  },
]

const team = [
  { name: 'Deniz Yılmaz', role: 'Kurucu & Kreatif Direktör' },
  { name: 'Cem Arslan', role: 'Teknoloji Direktörü' },
  { name: 'Nil Şahin', role: 'Ürün Tasarımcısı' },
  { name: 'Barış Öz', role: 'Büyüme Uzmanı' },
]

export default function About() {
  usePageMeta({
    title: 'Hakkımızda',
    description:
      'Decha Agency; tasarımcı, geliştirici ve stratejistlerden oluşan bir dijital ürün ekibidir.',
  })

  return (
    <>
      <Section spacing="intro">
        <SectionHeading
          code="03"
          eyebrow="Kurum künyesi"
          title="Dijital ürünler geliştiren küçük ama iddialı bir ekibiz"
          as="h1"
          description="2018'den bu yana kurumsal markalar ve girişimler için tasarım ve yazılım üretiyoruz. İşimizi ajans değil, ürün ekibi gibi yapıyoruz."
          align="center"
        />
      </Section>

      <Section spacing="top-none">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="panel relative overflow-hidden p-8 sm:p-10">
            <span
              className="absolute inset-0 opacity-60"
              aria-hidden="true"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(135deg, rgb(var(--c-line) / 0.05) 0 1px, transparent 1px 8px)',
              }}
            />
            <div className="relative">
              <p className="eyebrow">Kuruluş kaydı</p>
              <p className="num mt-4 font-display text-[4rem] font-bold leading-none text-fg sm:text-[5.5rem]">
                2018
              </p>
              <div className="mt-8 grid gap-px border border-accent/35 bg-accent/25 sm:grid-cols-2">
                {[
                  ['Merkez', 'Levent, İstanbul'],
                  ['Kadro', '12 kişi'],
                  ['Faaliyet alanı', 'Tasarım · Yazılım'],
                  ['Dosya durumu', 'Açık'],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg px-4 py-3">
                    <p className="eyebrow">{k}</p>
                    <p className="mt-1 font-mono text-[12.5px] text-fg">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-headline font-bold uppercase">Ajans değil, uzatılmış ekibiniz</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-fg-muted">
              <p>
                Projelere dışarıdan bakan bir tedarikçi gibi değil, ekibinizin bir parçası gibi
                yaklaşıyoruz. Bu yüzden çalışmalarımız keşif toplantısıyla başlar, ölçümleme ve
                iyileştirmeyle sürer.
              </p>
              <p>
                Tasarım, yazılım ve pazarlama yeteneklerini tek çatı altında tuttuğumuz için karar
                döngüleri kısa; bu da hem hızı hem kaliteyi artırır.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((item) => (
                <div key={item.label} className="panel p-5">
                  <dd className="font-display text-2xl font-bold text-accent">{item.value}</dd>
                  <dt className="mt-1 eyebrow">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section className="bg-bg-soft/60">
        <SectionHeading code="07" eyebrow="Yönetmelik" title="Bizi biz yapan dört ilke" align="center" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="panel panel-hover p-7">
              <span className="grid h-10 w-10 place-items-center border border-accent/35 text-accent">
                <Icon name={value.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[15px] font-bold uppercase text-accent">{value.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{value.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading code="08" eyebrow="Personel" title="Projenizde çalışacak kişiler" align="center" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="panel overflow-hidden pb-1 text-center">
              <div
                className="grid aspect-square w-full place-items-center border-b border-accent/30 bg-accent/8"
                aria-hidden="true"
              >
                <span className="font-display text-[2rem] font-bold text-fg/80">
                  {initials(member.name)}
                </span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-fg">{member.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  )
}
