import Icon from './ui/Icon'

export default function TestimonialCard({ testimonial }) {
  const rating = Number(testimonial.rating) || 5

  return (
    <figure className="surface flex h-full flex-col p-7">
      <div className="flex gap-1 text-amber-400">
        {Array.from({ length: rating }).map((_, index) => (
          <Icon key={index} name="star" className="h-4 w-4 fill-amber-400" />
        ))}
      </div>
      <blockquote className="mt-5 flex-1 text-base leading-relaxed text-slate-300">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
        <img
          src={testimonial.avatar_url}
          alt=""
          loading="lazy"
          className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
        />
        <div>
          <p className="text-sm font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-slate-500">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ''}
          </p>
        </div>
      </figcaption>
    </figure>
  )
}
