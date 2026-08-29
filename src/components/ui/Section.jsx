import { classNames } from '../../lib/format'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Dikey boşluk `spacing` prop'u ile verilir — className üzerinden geçilen
 * pt-0 gibi sınıflar duyarlı varsayılanı (sm:py-28) ezemediği için
 * masaüstünde sessizce etkisiz kalıyordu.
 */
const SPACING = {
  default: 'py-14 sm:py-20',
  tight: 'py-10 sm:py-14',
  intro: 'pb-8 pt-12 sm:pb-10 sm:pt-14', // sayfa başlığı bloğu
  'top-none': 'pb-14 sm:pb-20',
  'bottom-none': 'pt-14 sm:pt-20',
  none: '',
}

export default function Section({
  id,
  spacing = 'default',
  className,
  containerClassName,
  children,
  reveal = true,
}) {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id={id}
      ref={reveal ? ref : undefined}
      className={classNames(SPACING[spacing] ?? SPACING.default, className)}
    >
      <div
        className={classNames(
          'container',
          reveal && 'reveal',
          reveal && visible && 'is-in',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
