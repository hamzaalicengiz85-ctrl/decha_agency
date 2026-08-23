import { classNames } from '../../lib/format'

/**
 * Bölüm başlığı — bürokratik form başlığı gibi: kod, ad, açıklama.
 * Sayfanın ana başlığı için `as="h1"` verin.
 */
export default function SectionHeading({
  eyebrow,
  code,
  title,
  description,
  align = 'left',
  as: Heading = 'h2',
  className,
}) {
  return (
    <div className={classNames('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow || code ? (
        <div
          className={classNames(
            'flex items-center gap-2.5',
            align === 'center' && 'justify-center',
          )}
        >
          {code ? (
            <span className="num border border-accent/50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-ink">
              {code}
            </span>
          ) : null}
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <span className="dotted-rule hidden w-16 sm:block" aria-hidden="true" />
        </div>
      ) : null}

      <Heading className="mt-4 text-headline font-bold uppercase">{title}</Heading>

      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">{description}</p>
      ) : null}
    </div>
  )
}
