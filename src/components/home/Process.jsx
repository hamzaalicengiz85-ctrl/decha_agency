import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { processSteps } from '../../data/content'
import { listAttrs, useList, useSiteCopy } from '../../lib/siteCopyContext'

const LIST_KEY = 'surec.adimlar'

export default function Process() {
  const { edit } = useSiteCopy()
  const steps = useList(LIST_KEY, processSteps)

  return (
    <Section>
      <SectionHeading
        code="03"
        eyebrow="İşleyiş"
        eyebrowKey="surec.eyebrow"
        title="Dosya nasıl ilerler?"
        titleKey="surec.baslik"
        description="Şeffaf, ölçülebilir ve tahmin edilebilir. Her aşama kayıt altına alınır."
        descriptionKey="surec.aciklama"
        align="center"
      />

      <div className="mt-12">
        <ol className="panel brackets stagger grid gap-px bg-accent/25 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <li key={item.step} className="bg-bg p-6">
                <div className="flex items-baseline gap-2">
                  <span className="num font-display text-3xl font-bold text-accent">
                    {item.step}
                  </span>
                  <span className="hatch h-2 flex-1" aria-hidden="true" />
                </div>
                <h3
                  className="mt-4 font-display text-[15px] font-bold uppercase text-accent"
                  {...listAttrs(edit, LIST_KEY, index, 'title')}
                >
                  {item.title}
                </h3>
                <p
                  className="mt-3 text-[13.5px] leading-relaxed text-fg-muted"
                  {...listAttrs(edit, LIST_KEY, index, 'text')}
                >
                  {item.text}</p>
              </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
