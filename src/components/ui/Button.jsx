import { Link } from 'react-router-dom'
import { classNames } from '../../lib/format'

const variants = {
  // Ham TVA turuncusu yalnızca dolgu olarak; üzerine koyu metin (6.45)
  primary: 'key bg-accent text-accent-fg hover:brightness-[1.06]',
  // Hardal: ikincil eylem
  highlight: 'key bg-highlight text-highlight-fg hover:brightness-[1.04]',
  // Kağıt/metal yüzey
  panel: 'key border border-line/25 bg-bg-elev text-fg hover:border-accent/50',
  outline: 'border border-line/35 text-fg hover:border-accent hover:text-accent-ink',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizes = {
  sm: 'min-h-[40px] px-4 py-2 text-[12px]',
  md: 'min-h-[44px] px-5 py-2.5 text-[13px]',
  lg: 'min-h-[52px] px-7 py-3.5 text-[14px]',
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
    'group inline-flex items-center justify-center gap-2 font-mono font-medium uppercase tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-55',
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
