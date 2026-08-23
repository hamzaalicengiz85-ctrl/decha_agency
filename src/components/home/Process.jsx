import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import { processSteps } from '../../data/content'

export default function Process() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Süreç"
        title="Nasıl çalışıyoruz?"
        description="Şeffaf, ölçülebilir ve tahmin edilebilir. Her aşamada nerede olduğunuzu bilirsiniz."
        align="center"
      />

      {/* Adımlar tek bir hairline hat üzerinde ilerler — zaman çizelgesi hissi. */}
      <ol className="relative mt-16 grid gap-px overflow-hidden rounded-2xl border hairline md:grid-cols-2 lg:grid-cols-4"
          style={{ backgroundColor: 'rgb(var(--c-line) / var(--line-op))' }}>
        {processSteps.map((item) => (
          <li key={item.step} className="group bg-bg p-8 transition duration-500 hover:bg-bg-soft">
            <span className="num font-mono text-xs tracking-[0.2em] text-accent">{item.step}</span>
            <h3 className="mt-5 text-lg font-semibold text-fg">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
