import { classNames } from '../../lib/format'

/**
 * Bölüm başlığı. Sayfanın ana başlığı için `as="h1"` verin —
 * her sayfada tam olarak bir adet h1 bulunmalıdır (SEO + erişilebilirlik).
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  className,
}) {
  return (
    <div
      className={classNames('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-200">
          {eyebrow}
        </span>
      ) : null}
      <Heading className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{description}</p>
      ) : null}
    </div>
  )
}
