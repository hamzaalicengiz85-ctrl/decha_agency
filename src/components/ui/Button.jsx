import { Link } from 'react-router-dom'
import { classNames } from '../../lib/format'

const variants = {
  // Dolu turuncu, üzerine ekran siyahı (6.91)
  primary: 'key bg-accent text-accent-fg hover:bg-accent/90',
  highlight: 'key bg-highlight text-highlight-fg hover:bg-highlight/90',
  // Çerçeveli: hover'da dolar — referanstaki liste satırı davranışı
  panel: 'key border border-accent/60 bg-transparent text-accent hover:bg-accent hover:text-accent-fg',
  outline:
    'border border-accent/50 text-accent transition hover:border-accent hover:bg-accent hover:text-accent-fg',
  ghost: 'text-fg-muted hover:text-accent',
}

const sizes = {
  sm: 'min-h-[38px] px-3.5 py-2 text-[11px]',
  md: 'min-h-[44px] px-5 py-2.5 text-[12px]',
  lg: 'min-h-[50px] px-7 py-3.5 text-[13px]',
}

export default function Button({
  as,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) {
  const classes = classNames(
    'group inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-50',
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    const external = /^https?:\/\//.test(href)
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...props}
      >
        {children}
      </a>
    )
  }

  const Component = as ?? 'button'
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
