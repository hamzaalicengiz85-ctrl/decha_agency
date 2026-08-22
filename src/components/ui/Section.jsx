import { classNames } from '../../lib/format'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Section({ id, className, containerClassName, children, reveal = true }) {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id={id}
      ref={reveal ? ref : undefined}
      className={classNames('py-20 sm:py-28', className)}
    >
      <div
        className={classNames(
          'container',
          reveal && 'transition-all duration-700',
          reveal && (visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'),
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
