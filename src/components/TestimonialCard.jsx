import Stamp from './ui/Stamp'

export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="panel relative flex h-full flex-col p-6">
      <div className="flex items-center justify-between border-b border-dashed border-line/25 pb-3">
        <span className="eyebrow">Tutanak</span>
        <Stamp tone="approved">Doğrulandı</Stamp>
      </div>

      <blockquote className="mt-5 flex-1 text-[14.5px] leading-relaxed text-fg">
        “{testimonial.quote}”
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line/20 pt-4">
        <img
          src={testimonial.avatar_url}
          alt=""
          loading="lazy"
          className="h-10 w-10 border border-line/25 object-cover grayscale-[0.35] sepia-[0.15]"
        />
        <div>
          <p className="font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-fg">
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
