const paths = {
  layout: 'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 5h18M9 10v11',
  sparkles:
    'M12 3l1.9 4.8L19 9.5l-4.4 2.3L13 17l-2.1-4.9L6 9.5l5.1-1.7L12 3zm7 9l.9 2.3 2.1.8-2.1.9-.9 2.3-.9-2.3-2.1-.9 2.1-.8L19 12z',
  trending: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  phone: 'M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm3 15h4',
  compass: 'M12 22a10 10 0 100-20 10 10 0 000 20zm3.5-13.5l-2 5.5-5.5 2 2-5.5 5.5-2z',
  shield: 'M12 3l8 3.5v5c0 4.6-3.2 8.6-8 10-4.8-1.4-8-5.4-8-10v-5L12 3zm-1 11l5-5-1.4-1.4L11 11.2 9.4 9.6 8 11l3 3z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  check: 'M5 13l4 4L19 7',
  mail: 'M3 6h18v12H3V6zm0 0l9 7 9-7',
  pin: 'M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zm0-9a3 3 0 100-6 3 3 0 000 6z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-16v6l4 2',
  star: 'M12 3l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.9 9.1 9 12 3z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
}

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.7, ...props }) {
  const d = paths[name] ?? paths.sparkles
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d={d} />
    </svg>
  )
}
