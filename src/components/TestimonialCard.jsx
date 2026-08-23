export default function TestimonialCard({ testimonial }) {
  return (
    <figure className="glass flex h-full flex-col p-7">
      <span className="font-display text-3xl leading-none text-accent/50" aria-hidden="true">
        “
      </span>
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg">
        {testimonial.quote}
      </blockquote>
      <figcaption className="mt-7 flex items-center gap-3 border-t hairline pt-6">
        <img
          src={testimonial.avatar_url}
          alt=""
          loading="lazy"
          className="h-10 w-10 rounded-full object-cover"
        />
        <div>
          <p className="text-[13px] font-medium text-fg">{testimonial.name}</p>
          <p className="text-[11px] text-fg-subtle">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ''}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
