import { classNames } from '../../lib/format'
import { Copy } from '../../lib/siteCopy'

/**
 * Bölüm başlığı — bürokratik form başlığı gibi: kod, ad, açıklama.
 * Sayfanın ana başlığı için `as="h1"` verin.
 */
/**
 * `*Key` prop'ları düzenlenebilirlik içindir: metin prop olarak geçtiği için
 * çağrı yerinde `<Copy>` ile sarılamıyor, sarmalama burada yapılıyor.
 * Anahtar verilmezse metin düz basılır (davranış değişmez).
 */
export default function SectionHeading({
  eyebrow,
  eyebrowKey,
  code,
  title,
  titleKey,
  description,
  descriptionKey,
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
              {eyebrowKey ? <Copy k={eyebrowKey}>{eyebrow}</Copy> : eyebrow}
            </span>
          ) : null}
          <span className="hatch hidden h-2.5 w-20 sm:block" aria-hidden="true" />
        </div>
      ) : null}

      <Heading className="phosphor mt-4 text-headline font-bold uppercase text-accent">
        {titleKey ? <Copy k={titleKey}>{title}</Copy> : title}
      </Heading>

      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
          {descriptionKey ? <Copy k={descriptionKey}>{description}</Copy> : description}
        </p>
      ) : null}
    </div>
  )
}
