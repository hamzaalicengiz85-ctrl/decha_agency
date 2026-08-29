import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import CTA from '../components/home/CTA'
import Icon from '../components/ui/Icon'
import { CardSkeleton, EmptyState } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { services, faqs, processSteps } from '../data/content'

export default function Services() {
  usePageMeta({
    title: 'Hizmetler',
    description:
      'Web tasarım, marka kimliği, dijital pazarlama, mobil uygulama ve ürün stratejisi hizmetlerimiz.',
  })

  const { data: serviceList, loading } = useSupabaseData('services', {
    fallback: services,
    order: { column: 'order_no', ascending: true },
  })

  return (
    <>
      <Section spacing="intro">
        <SectionHeading
          code="01"
          eyebrow="Hizmet kataloğu"
          title="İhtiyacınız olan her şey, tek ekipte"
          as="h1"
          description="Strateji, tasarım, yazılım ve pazarlamayı birbirinden kopuk süreçler olarak değil; tek bir bütün olarak ele alıyoruz."
          align="center"
        />
      </Section>

      <Section spacing="top-none">
        {loading ? (
          <CardSkeleton count={6} />
        ) : serviceList.length === 0 ? (
          <EmptyState title="Henüz hizmet eklenmemiş" />
        ) : (
          <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service, index) => (
              <ServiceCard key={service.id ?? service.slug} service={service} index={index} />
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-bg-soft/60">
        <SectionHeading code="03" eyebrow="İşleyiş" title="4 adımda net bir süreç" align="center" />
        <ol className="stagger mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item) => (
            <li key={item.step} className="panel p-6">
              <span className="num font-display text-3xl font-bold text-accent">{item.step}</span>
              <h3 className="mt-4 font-display text-[15px] font-bold uppercase text-accent">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading code="05" eyebrow="Bilgi notu" title="Sık sorulan sorular" align="center" />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="panel group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[14px] font-bold uppercase tracking-[0.06em] text-accent">
                {faq.q}
                <Icon
                  name="plus"
                  className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  )
}
