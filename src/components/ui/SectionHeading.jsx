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
            <span className="num bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-fg">
              {code}
            </span>
          ) : null}
          {eyebrow ? (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-accent">
              {eyebrow}
            </span>
          ) : null}
          <span className="hatch hidden h-2.5 w-20 sm:block" aria-hidden="true" />
        </div>
      ) : null}

      <Heading className="phosphor mt-4 text-headline font-bold uppercase text-accent">{title}</Heading>

      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">{description}</p>
      ) : null}
    </div>
  )
}
