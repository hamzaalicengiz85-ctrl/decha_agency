/** Kurum mührü: sekizgen rozet içinde "D" — TVA tarzı resmî damga. */
export default function Logo({ className = 'h-9 w-9' }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 48 48" className="h-full w-full">
        <path
          d="M24 2.5 38.5 9.5 45.5 24 38.5 38.5 24 45.5 9.5 38.5 2.5 24 9.5 9.5Z"
          className="fill-accent"
        />
        <path
          d="M24 6.6 35.9 12.3 41.6 24 35.9 35.7 24 41.4 12.1 35.7 6.4 24 12.1 12.3Z"
          fill="none"
          className="stroke-accent-fg"
          strokeWidth="1.1"
          opacity="0.55"
        />
        <path
          d="M17 15h7.6c6.2 0 10.4 3.6 10.4 9s-4.2 9-10.4 9H17V15zm4.6 3.9v10.2h3c3.4 0 5.7-2 5.7-5.1s-2.3-5.1-5.7-5.1h-3z"
          className="fill-accent-fg"
        />
      </svg>
    </span>
  )
}
