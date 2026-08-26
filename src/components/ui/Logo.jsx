/**
 * Site logosu: "DECHA" kelime markası, kalın ve glitch efektli.
 * Efekt aralıklı çalışır, prefers-reduced-motion altında kapanır.
 *
 * Sekme simgesi (public/favicon.svg) yalnızca "D" harfidir.
 */
export default function Logo({ className = 'text-[19px]' }) {
  return (
    <span
      className={`glitch uppercase tracking-[0.16em] ${className}`}
      data-text="DECHA"
      aria-hidden="true"
    >
      DECHA
    </span>
  )
}
