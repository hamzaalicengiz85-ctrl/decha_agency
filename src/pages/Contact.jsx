import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ContactForm from '../components/ContactForm'
import Icon from '../components/ui/Icon'
import { usePageMeta } from '../lib/seo'
import { SITE, faqs } from '../data/content'

const channels = [
  { icon: 'mail', label: 'E-posta', value: SITE.email, href: `mailto:${SITE.email}` },
  {
    icon: 'phone',
    label: 'Telefon',
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s|\(|\)/g, '')}`,
  },
  { icon: 'pin', label: 'Ofis', value: SITE.address },
  { icon: 'clock', label: 'Çalışma saatleri', value: 'Hafta içi 09:00 – 18:00' },
]

export default function Contact() {
  usePageMeta({
    title: 'İletişim',
    description: 'Projeniz için ücretsiz teklif alın. Decha Agency ile iletişime geçin.',
  })

  return (
    <>
      <Section spacing="intro">
        <SectionHeading
          code="06"
          eyebrow="Başvuru masası"
          title="Projenizi konuşalım"
          as="h1"
          description="Formu doldurun, en geç 1 iş günü içinde size dönüş yapalım. Dilerseniz doğrudan e-posta veya telefonla da ulaşabilirsiniz."
          align="center"
        />
      </Section>

      <Section spacing="top-none">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.label} className="panel flex items-start gap-4 p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center border border-line/25 text-accent-ink">
                  <Icon name={channel.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="eyebrow">{channel.label}</p>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="mt-1.5 block font-mono text-[13px] text-fg transition hover:text-accent-ink"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-1.5 font-mono text-[13px] text-fg">{channel.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="panel p-5">
              <p className="eyebrow">Konum kaydı</p>
              <dl className="mt-4 space-y-2.5 font-mono text-[12px]">
                {[
                  ['Enlem', '41.0812 K'],
                  ['Boylam', '29.0094 D'],
                  ['Bölge', 'Beşiktaş / İstanbul'],
                  ['Zaman dilimi', 'UTC+03:00'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="text-fg-subtle">{k}</dt>
                    <dd className="dotted-rule flex-1" aria-hidden="true" />
                    <dd className="num text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>

      <Section spacing="top-none" className="bg-bg-soft/60">
        <SectionHeading code="05" eyebrow="Bilgi notu" title="Sık sorulan sorular" align="center" />
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="panel group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[14px] font-bold uppercase tracking-[0.02em] text-fg">
                {faq.q}
                <Icon
                  name="plus"
                  className="h-5 w-5 shrink-0 text-accent-ink transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-4 text-sm leading-relaxed text-fg-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
