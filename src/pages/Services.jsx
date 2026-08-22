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
      <Section className="pb-10 pt-16 sm:pt-20">
        <SectionHeading
          eyebrow="Hizmetler"
          title="İhtiyacınız olan her şey, tek ekipte"
          as="h1"
          description="Strateji, tasarım, yazılım ve pazarlamayı birbirinden kopuk süreçler olarak değil; tek bir bütün olarak ele alıyoruz."
          align="center"
        />
      </Section>

      <Section className="pt-0">
        {loading ? (
          <CardSkeleton count={6} />
        ) : serviceList.length === 0 ? (
          <EmptyState title="Henüz hizmet eklenmemiş" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceList.map((service) => (
              <ServiceCard key={service.id ?? service.slug} service={service} />
            ))}
          </div>
        )}
      </Section>

      <Section className="bg-ink-900/30">
        <SectionHeading eyebrow="Çalışma şeklimiz" title="4 adımda net bir süreç" align="center" />
        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item) => (
            <li key={item.step} className="surface p-7">
              <span className="font-display text-4xl font-extrabold text-white/10">{item.step}</span>
              <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <SectionHeading eyebrow="SSS" title="Sık sorulan sorular" align="center" />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="surface group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-white">
                {faq.q}
                <Icon
                  name="plus"
                  className="h-5 w-5 shrink-0 text-brand-400 transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <CTA />
    </>
  )
}
