import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import CTA from '../components/home/CTA'
import Icon from '../components/ui/Icon'
import { usePageMeta } from '../lib/seo'
import { stats } from '../data/content'

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
  { name: 'Deniz Yılmaz', role: 'Kurucu & Kreatif Direktör', avatar: 'https://i.pravatar.cc/300?img=15' },
  { name: 'Cem Arslan', role: 'Teknoloji Direktörü', avatar: 'https://i.pravatar.cc/300?img=68' },
  { name: 'Nil Şahin', role: 'Ürün Tasarımcısı', avatar: 'https://i.pravatar.cc/300?img=45' },
  { name: 'Barış Öz', role: 'Büyüme Uzmanı', avatar: 'https://i.pravatar.cc/300?img=60' },
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
          <div className="overflow-hidden rounded-none border border-line/20">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Decha Agency ekibi çalışırken"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover grayscale-[0.3] sepia-[0.15]"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Ajans değil, uzatılmış ekibiniz</h2>
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
                  <dd className="font-display text-2xl font-bold text-fg">{item.value}</dd>
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
              <span className="grid h-10 w-10 place-items-center border border-line/25 text-accent-ink">
                <Icon name={value.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-fg">{value.title}</h3>
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
              <img
                src={member.avatar}
                alt={member.name}
                loading="lazy"
                className="aspect-square w-full object-cover grayscale-[0.4] sepia-[0.18]"
              />
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
