import { classNames } from '../../lib/format'
import { useScrollReveal } from '../../hooks/useScrollReveal'

/**
 * Dikey boşluk `spacing` prop'u ile verilir — className üzerinden geçilen
 * pt-0 gibi sınıflar duyarlı varsayılanı (sm:py-28) ezemediği için
 * masaüstünde sessizce etkisiz kalıyordu.
 */
const SPACING = {
  default: 'py-20 sm:py-28',
  tight: 'py-14 sm:py-20',
  intro: 'pb-10 pt-14 sm:pb-12 sm:pt-16', // sayfa başlığı bloğu
  'top-none': 'pb-20 sm:pb-28',
  'bottom-none': 'pt-20 sm:pt-28',
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
          reveal && 'transition-all duration-700 ease-smooth',
          reveal && (visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'),
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
