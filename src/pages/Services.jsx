import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import CTA from '../components/home/CTA'
import Icon from '../components/ui/Icon'
import { CardSkeleton, EmptyState } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { breadcrumb, usePageMeta } from '../lib/seo'
import { listAttrs, useCopy, useList, useSiteCopy } from '../lib/siteCopyContext'
import { services, faqs, processSteps } from '../data/content'

const FAQ_KEY = 'sss.liste'
const STEP_KEY = 'surec.adimlar'

export default function Services() {
  const { edit } = useSiteCopy()
  const faqList = useList(FAQ_KEY, faqs)
  const steps = useList(STEP_KEY, processSteps)
  // Hook koşullu dalda çağrılamaz; EmptyState ternary içinde render ediliyor.
  const emptyLabel = useCopy('hizmetler.bos', 'Henüz hizmet eklenmemiş')
  usePageMeta({
    title: 'Hizmetler',
    description:
      'Web tasarım, marka kimliği, dijital pazarlama, mobil uygulama ve ürün stratejisi hizmetlerimiz.',
    schema: breadcrumb([{ name: 'Hizmetler', path: '/hizmetler' }]),
  })

  const { data: serviceList, loading } = useSupabaseData('services', {
    fallback: services,
    order: { column: 'order_no', ascending: true },
  })

  return (
    <>
      <Section
        sectionId="hizmetler.giris"
        label="Sayfa başlığı" spacing="intro">
        <SectionHeading
          code="01"
          eyebrow="Hizmet kataloğu"
          eyebrowKey="hizmetler.eyebrow"
          title="İhtiyacınız olan her şey, tek ekipte"
          titleKey="hizmetler.baslik"
          as="h1"
          description="Strateji, tasarım, yazılım ve pazarlamayı birbirinden kopuk süreçler olarak değil; tek bir bütün olarak ele alıyoruz."
          descriptionKey="hizmetler.aciklama"
          align="center"
        />
      </Section>

      <Section
        sectionId="hizmetler.liste"
        label="Hizmet listesi" spacing="top-none">
        {loading ? (
          <CardSkeleton count={6} />
        ) : serviceList.length === 0 ? (
          <EmptyState title={emptyLabel} />
        ) : (
          <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service, index) => (
              <ServiceCard key={service.id ?? service.slug} service={service} index={index} as="h2" />
            ))}
          </div>
        )}
      </Section>

      <Section
        sectionId="hizmetler.surec"
        label="Süreç" className="bg-bg-soft/60">
        <SectionHeading
          code="03"
          eyebrow="İşleyiş"
          eyebrowKey="hizmetler.surec.eyebrow"
          title="4 adımda net bir süreç"
          titleKey="hizmetler.surec.baslik"
          align="center"
        />
        <ol className="stagger mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <li key={item.step} className="panel p-6">
              <span className="num font-display text-3xl font-bold text-accent">{item.step}</span>
              <h3
                className="mt-4 font-display text-[15px] font-bold uppercase text-accent"
                {...listAttrs(edit, STEP_KEY, index, 'title')}
              >
                {item.title}
              </h3>
              <p
                className="mt-3 text-sm leading-relaxed text-fg-muted"
                {...listAttrs(edit, STEP_KEY, index, 'text')}
              >
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        sectionId="hizmetler.sss"
        label="Sık sorulan sorular">
        <SectionHeading
          code="05"
          eyebrow="Bilgi notu"
          eyebrowKey="sss.eyebrow"
          title="Sık sorulan sorular"
          titleKey="sss.baslik"
          align="center"
        />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqList.map((faq, index) => (
            <details
              key={faq.q}
              className="panel group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[14px] font-bold uppercase tracking-[0.06em] text-accent">
                <span {...listAttrs(edit, FAQ_KEY, index, 'q')}>{faq.q}</span>
                <Icon
                  name="plus"
                  className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45"
                />
              </summary>
              <p
                className="mt-3 text-[13.5px] leading-relaxed text-fg-muted"
                {...listAttrs(edit, FAQ_KEY, index, 'a')}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  )
}
