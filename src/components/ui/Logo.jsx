/** Kurumsal işaret: keskin geometrik "D", degrade yok. */
export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <span
      className={`glass grid place-items-center rounded-[9px] ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none">
        <path
          d="M5 3.5h6.4c5.1 0 8.6 3.4 8.6 8.5s-3.5 8.5-8.6 8.5H5V3.5zm3.6 3.4v10.2h2.6c3 0 5-2 5-5.1s-2-5.1-5-5.1H8.6z"
          fill="currentColor"
          className="text-accent"
        />
      </svg>
    </span>
  )
}
