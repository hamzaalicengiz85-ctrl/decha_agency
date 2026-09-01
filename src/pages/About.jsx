import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import CTA from '../components/home/CTA'
import Icon from '../components/ui/Icon'
import { usePageMeta } from '../lib/seo'
import { stats } from '../data/content'
import {
  HAKKIMIZDA_EKIP,
  HAKKIMIZDA_ILKELER,
  HAKKIMIZDA_KUNYE,
} from '../data/lists'
import { initials } from '../lib/initials'
import { Copy } from '../lib/siteCopy'
import { listAttrs, useList, useSiteCopy } from '../lib/siteCopyContext'

const VALUES_KEY = 'hakkimizda.ilkeler'
const TEAM_KEY = 'hakkimizda.ekip'
const STATS_KEY = 'site.istatistikler'
const KUNYE_KEY = 'hakkimizda.kunye'




export default function About() {
  const { edit } = useSiteCopy()
  const valueList = useList(VALUES_KEY, HAKKIMIZDA_ILKELER)
  const teamList = useList(TEAM_KEY, HAKKIMIZDA_EKIP)
  const statList = useList(STATS_KEY, stats)
  const kunye = useList(KUNYE_KEY, HAKKIMIZDA_KUNYE)

  usePageMeta({
    title: 'Hakkımızda',
    description:
      'Decha Agency; tasarımcı, geliştirici ve stratejistlerden oluşan bir dijital ürün ekibidir.',
  })

  return (
    <>
      <Section
        sectionId="hakkimizda.giris"
        label="Sayfa başlığı" spacing="intro">
        <SectionHeading
          code="03"
          eyebrow="Kurum künyesi"
          eyebrowKey="hakkimizda.eyebrow"
          title="Dijital ürünler geliştiren küçük ama iddialı bir ekibiz"
          titleKey="hakkimizda.baslik"
          as="h1"
          description="2018'den bu yana kurumsal markalar ve girişimler için tasarım ve yazılım üretiyoruz. İşimizi ajans değil, ürün ekibi gibi yapıyoruz."
          descriptionKey="hakkimizda.aciklama"
          align="center"
        />
      </Section>

      <Section
        sectionId="hakkimizda.kunye-bolumu"
        label="Künye ve tanıtım" spacing="top-none">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="panel brackets relative overflow-hidden p-8 sm:p-10">
            <div className="relative">
              <p className="eyebrow">
                <Copy k="hakkimizda.kunye.eyebrow">Kuruluş kaydı</Copy>
              </p>
              <p className="num phosphor mt-4 font-display text-[4rem] font-bold leading-none text-accent sm:text-[5.5rem]">
                <Copy k="hakkimizda.kunye.yil">2018</Copy>
              </p>
              <div className="mt-8 grid gap-px border border-accent/35 bg-accent/25 sm:grid-cols-2">
                {kunye.map((item, index) => (
                  <div key={item.label} className="bg-bg px-4 py-3">
                    <p className="eyebrow" {...listAttrs(edit, KUNYE_KEY, index, 'label')}>
                      {item.label}
                    </p>
                    <p
                      className="mt-1 font-mono text-[12.5px] text-fg"
                      {...listAttrs(edit, KUNYE_KEY, index, 'value')}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-headline font-bold uppercase">
              <Copy k="hakkimizda.metin.baslik">Ajans değil, uzatılmış ekibiniz</Copy>
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-fg-muted">
              <Copy as="p" k="hakkimizda.metin.paragraf1">
                Projelere dışarıdan bakan bir tedarikçi gibi değil, ekibinizin bir parçası gibi
                yaklaşıyoruz. Bu yüzden çalışmalarımız keşif toplantısıyla başlar, ölçümleme ve
                iyileştirmeyle sürer.
              </Copy>
              <Copy as="p" k="hakkimizda.metin.paragraf2">
                Tasarım, yazılım ve pazarlama yeteneklerini tek çatı altında tuttuğumuz için karar
                döngüleri kısa; bu da hem hızı hem kaliteyi artırır.
              </Copy>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-4">
              {statList.map((item, index) => (
                <div key={item.label} className="panel p-5">
                  <dd
                    className="font-display text-2xl font-bold text-accent"
                    {...listAttrs(edit, STATS_KEY, index, 'value')}
                  >
                    {item.value}
                  </dd>
                  <dt className="mt-1 eyebrow" {...listAttrs(edit, STATS_KEY, index, 'label')}>
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section
        sectionId="hakkimizda.ilkeler-bolumu"
        label="İlkeler" className="bg-bg-soft/60">
        <SectionHeading
          code="07"
          eyebrow="Yönetmelik"
          eyebrowKey="hakkimizda.ilkeler.eyebrow"
          title="Bizi biz yapan dört ilke"
          titleKey="hakkimizda.ilkeler.baslik"
          align="center"
        />
        <div className="stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valueList.map((value, index) => (
            <div key={value.title} className="panel panel-hover p-7">
              <span className="grid h-10 w-10 place-items-center border border-accent/35 text-accent">
                <Icon name={value.icon} className="h-5 w-5" />
              </span>
              <h3
                className="mt-5 font-display text-[15px] font-bold uppercase text-accent"
                {...listAttrs(edit, VALUES_KEY, index, 'title')}
              >
                {value.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed text-fg-muted"
                {...listAttrs(edit, VALUES_KEY, index, 'text')}
              >
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        sectionId="hakkimizda.ekip-bolumu"
        label="Ekip">
        <SectionHeading
          code="08"
          eyebrow="Personel"
          eyebrowKey="hakkimizda.ekip.eyebrow"
          title="Projenizde çalışacak kişiler"
          titleKey="hakkimizda.ekip.baslik"
          align="center"
        />
        <div className="stagger mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teamList.map((member, index) => (
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
                <p
                  className="font-mono text-[12px] font-medium uppercase tracking-[0.06em] text-accent"
                  {...listAttrs(edit, TEAM_KEY, index, 'name')}
                >
                  {member.name}
                </p>
                <p
                  className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle"
                  {...listAttrs(edit, TEAM_KEY, index, 'role')}
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  )
}
