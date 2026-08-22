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
      <Section className="pb-10 pt-16 sm:pt-20">
        <SectionHeading
          eyebrow="İletişim"
          title="Projenizi konuşalım"
          as="h1"
          description="Formu doldurun, en geç 1 iş günü içinde size dönüş yapalım. Dilerseniz doğrudan e-posta veya telefonla da ulaşabilirsiniz."
          align="center"
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.label} className="surface flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
                  <Icon name={channel.icon} className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500">{channel.label}</p>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="mt-1 block font-semibold text-white transition hover:text-brand-300"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold text-white">{channel.value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="surface overflow-hidden bg-ink-800">
              <iframe
                title="Ofis konumu haritası"
                src="https://www.openstreetmap.org/export/embed.html?bbox=28.9%2C41.0%2C29.1%2C41.12&layer=mapnik"
                className="h-56 w-full border-0 opacity-80 [filter:invert(92%)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>

      <Section className="bg-ink-900/30 pt-0">
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
    </>
  )
}
