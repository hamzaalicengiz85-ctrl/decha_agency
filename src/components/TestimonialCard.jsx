import Stamp from './ui/Stamp'
import { initials } from '../lib/initials'

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="panel brackets flex h-full flex-col p-5">
      <div className="flex items-center justify-between border-b border-accent/30 pb-3">
        <span className="eyebrow">Tutanak</span>
        <Stamp tone="approved">Doğrulandı</Stamp>
      </div>

      <blockquote className="mt-5 flex-1 text-[14.5px] leading-relaxed text-fg">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-accent/25 pt-4">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center border border-accent/45 font-display text-[13px] font-bold text-accent"
          aria-hidden="true"
        >
          {initials(testimonial.name)}
        </span>
        <div>
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-accent">
            {testimonial.name}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ''}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
