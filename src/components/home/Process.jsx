import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { processSteps } from '../../data/content'

export default function Process() {
  return (
    <Section>
      <SectionHeading
        code="03"
        eyebrow="İşleyiş"
        title="Dosya nasıl ilerler?"
        description="Şeffaf, ölçülebilir ve tahmin edilebilir. Her aşama kayıt altına alınır."
        align="center"
      />

      <div className="mt-12">
        <ol className="grid gap-px border border-line/25 bg-line/20 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((item) => (
            <li key={item.step} className="bg-bg-elev p-7">
                <div className="flex items-baseline gap-2">
                  <span className="num font-display text-3xl font-bold text-accent-ink">
                    {item.step}
                  </span>
                  <span className="h-px flex-1 bg-line/25" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-display text-[15px] font-bold uppercase text-fg">
                  {item.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">{item.text}</p>
              </li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
