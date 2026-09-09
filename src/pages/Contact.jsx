import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ContactForm from '../components/ContactForm'
import Icon from '../components/ui/Icon'
import { breadcrumb, usePageMeta } from '../lib/seo'
import { SITE, faqs } from '../data/content'
import { ILETISIM_KONUM } from '../data/lists'
import { Copy } from '../lib/siteCopy'
import { listAttrs, useCopy, useList, useSiteCopy } from '../lib/siteCopyContext'

const FAQ_KEY = 'sss.liste'
const KONUM_KEY = 'iletisim.konum'



export default function Contact() {
  const { edit } = useSiteCopy()
  const faqList = useList(FAQ_KEY, faqs)
  const konum = useList(KONUM_KEY, ILETISIM_KONUM)
  // Kanal değerleri site geneli bilgilerden gelir; panelden düzenlenince
  // footer ve iletişim sayfası birlikte güncellenir.
  const email = useCopy('site.eposta', SITE.email)
  const phone = useCopy('site.telefon', SITE.phone)
  const address = useCopy('site.adres', SITE.address)
  const hours = useCopy('iletisim.calisma-saatleri', 'Hafta içi 09:00 – 18:00')

  // Değeri boş olan kanal listelenmez — uydurma telefon kaldırıldıktan
  // sonra "Telefon: (boş)" satırı kalmasın. Panelde hepsi görünür ki
  // tıklanıp doldurulabilsin.
  const channelList = [
    { icon: 'mail', label: 'E-posta', value: email, href: `mailto:${email}`, k: 'site.eposta' },
    {
      icon: 'phone',
      label: 'Telefon',
      value: phone,
      href: `tel:${phone.replace(/\s|\(|\)/g, '')}`,
      k: 'site.telefon',
    },
    { icon: 'pin', label: 'Ofis', value: address, k: 'site.adres' },
    { icon: 'clock', label: 'Çalışma saatleri', value: hours, k: 'iletisim.calisma-saatleri' },
  ].filter((channel) => edit || channel.value)

  usePageMeta({
    title: 'İletişim',
    description: 'Projeniz için ücretsiz teklif alın. Decha Agency ile iletişime geçin.',
    schema: breadcrumb([{ name: 'İletişim', path: '/iletisim' }]),
  })

  return (
    <>
      <Section
        sectionId="iletisim.giris"
        label="Sayfa başlığı" spacing="intro">
        <SectionHeading
          code="06"
          eyebrow="Başvuru masası"
          eyebrowKey="iletisim.eyebrow"
          title="Projenizi konuşalım"
          titleKey="iletisim.baslik"
          as="h1"
          description="Formu doldurun, en geç 1 iş günü içinde size dönüş yapalım. Dilerseniz doğrudan e-posta ile de ulaşabilirsiniz."
          descriptionKey="iletisim.aciklama"
          align="center"
        />
      </Section>

      <Section
        sectionId="iletisim.form"
        label="İletişim formu ve kanallar" spacing="top-none">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          {/* Dört kanal önce dört ayrı çerçeveli kutuydu: tek satırlık bilgi
              için dört kez tekrar eden ağır bir kabuk. Tek panel, içinde
              ayraçlı satırlar — aynı bilgi, dörtte bir çerçeve. */}
          <div className="space-y-4">
            <div className="panel divide-y divide-line/25">
              {channelList.map((channel) => (
                <div key={channel.label} className="flex items-center gap-4 px-5 py-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-line/35 text-accent">
                    <Icon name={channel.icon} className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="eyebrow">{channel.label}</p>
                    {channel.href ? (
                      <a
                        href={channel.href}
                        className="tap -my-2 flex items-center py-2 font-mono text-caption text-fg transition hover:text-accent"
                      >
                        <Copy k={channel.k}>{channel.value}</Copy>
                      </a>
                    ) : (
                      <p className="mt-1 font-mono text-caption text-fg">
                        <Copy k={channel.k}>{channel.value}</Copy>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="panel p-5">
              <p className="eyebrow">
                <Copy k="iletisim.konum.baslik">Konum kaydı</Copy>
              </p>
              <dl className="mt-4 space-y-2.5 font-mono text-meta">
                {konum.map((item, index) => (
                  <div key={item.label} className="flex items-baseline justify-between gap-4">
                    <dt className="text-fg-subtle" {...listAttrs(edit, KONUM_KEY, index, 'label')}>
                      {item.label}
                    </dt>
                    <dd className="dotted-rule flex-1" aria-hidden="true" />
                    <dd className="num text-fg" {...listAttrs(edit, KONUM_KEY, index, 'value')}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <ContactForm />
        </div>
      </Section>

      <Section
        sectionId="iletisim.sss"
        label="Sık sorulan sorular" spacing="top-none" className="bg-bg-soft/60">
        <SectionHeading
          code="05"
          eyebrow="Bilgi notu"
          eyebrowKey="sss.eyebrow"
          title="Sık sorulan sorular"
          titleKey="sss.baslik"
        />
        <div className="mt-12 max-w-3xl space-y-4">
          {faqList.map((faq, index) => (
            <details
              key={faq.q}
              className="panel group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-body font-bold uppercase tracking-data text-accent">
                <span {...listAttrs(edit, FAQ_KEY, index, 'q')}>{faq.q}</span>
                <Icon
                  name="plus"
                  className="h-5 w-5 shrink-0 text-accent transition group-open:rotate-45"
                />
              </summary>
              <p className="mt-4 text-caption leading-relaxed text-fg-muted">{faq.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </>
  )
}
