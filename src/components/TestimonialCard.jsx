import Stamp from './ui/Stamp'
import { initials } from '../lib/initials'
import { Copy } from '../lib/siteCopy'

export default function TestimonialCard({ testimonial }) {
  return (
    <figure
      className="panel flex h-full flex-col p-5"
      data-rec={`testimonials:${testimonial.id ?? ''}`}
      data-rec-label={testimonial.name}
    >
      <div className="flex items-center justify-between border-b border-line/30 pb-3">
        <span className="eyebrow"><Copy k="kart.referans.rozet">Tutanak</Copy></span>
        <Stamp tone="approved"><Copy k="kart.referans.damga">Doğrulandı</Copy></Stamp>
      </div>

      <blockquote className="mt-5 flex-1 text-body leading-relaxed text-fg">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line/25 pt-4">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center border border-line/45 font-display text-caption font-bold text-fg"
          aria-hidden="true"
        >
          {initials(testimonial.name)}
        </span>
        <div>
          <p className="font-mono text-meta font-medium uppercase tracking-data text-fg">
            {testimonial.name}
          </p>
          <p className="font-mono text-label uppercase tracking-label text-fg-subtle">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ''}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
