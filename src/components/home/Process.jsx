import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { processSteps } from '../../data/content'

export default function Process() {
  return (
    <Section className="bg-ink-900/30">
      <SectionHeading
        eyebrow="Süreç"
        title="Nasıl çalışıyoruz?"
        description="Şeffaf, ölçülebilir ve tahmin edilebilir bir süreç. Her aşamada ne olduğunu bilirsiniz."
        align="center"
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((item) => (
          <div key={item.step} className="surface surface-hover relative p-7">
            <span className="font-display text-4xl font-extrabold text-white/10">{item.step}</span>
            <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.text}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
