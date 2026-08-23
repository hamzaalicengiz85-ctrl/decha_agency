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
    <div className={classNames('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow ? (
        <div
          className={classNames(
            'flex items-center gap-3',
            align === 'center' && 'justify-center',
          )}
        >
          <span className="h-px w-6 bg-accent/60" />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      ) : null}
      <Heading className="mt-5 text-headline font-semibold">{title}</Heading>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-[17px]">{description}</p>
      ) : null}
    </div>
  )
}
