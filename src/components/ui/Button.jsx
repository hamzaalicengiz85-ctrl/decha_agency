import { Link } from 'react-router-dom'
import { classNames } from '../../lib/format'

const variants = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-400 shadow-glow disabled:bg-brand-500/50',
  secondary:
    'bg-white/5 text-white border border-white/15 hover:bg-white/10 hover:border-white/25',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  outline:
    'border border-brand-500/60 text-brand-200 hover:bg-brand-500/10 hover:border-brand-400',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
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
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition duration-300 disabled:cursor-not-allowed disabled:opacity-60',
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
