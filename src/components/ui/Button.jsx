import { Link } from 'react-router-dom'
import { classNames } from '../../lib/format'

const variants = {
  // Tek renk, degrade yok: vurgu rengi doğrudan zemin olur.
  primary:
    'bg-accent text-accent-fg hover:brightness-[1.08] active:brightness-95 disabled:brightness-75',
  // Cam buton: arka planı bulanıklaştırır, kenarı hairline.
  glass:
    'glass text-fg hover:border-accent/40 hover:bg-fg/[0.04]',
  outline:
    'border border-line/[0.18] text-fg hover:border-accent/50 hover:text-accent',
  ghost: 'text-fg-muted hover:text-fg',
}

const sizes = {
  // min-h değerleri 44px dokunma hedefini korur
  sm: 'min-h-[40px] px-4 py-2 text-[13px]',
  md: 'min-h-[44px] px-5 py-2.5 text-sm',
  lg: 'min-h-[52px] px-7 py-3.5 text-[15px]',
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
    'group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition duration-300 ease-smooth disabled:cursor-not-allowed disabled:opacity-60',
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
