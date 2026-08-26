/**
 * Monogram logo: kalın "D", paletin kendi renkleriyle glitch efektli.
 * Efekt aralıklı çalışır ve prefers-reduced-motion altında kapanır.
 */
export default function Logo({ className = 'text-[26px]' }) {
  return (
    <span className={`glitch ${className}`} data-text="D" aria-hidden="true">
      D
    </span>
  )
}
