import { classNames } from '../../lib/format'

/** Kauçuk damga: "ONAYLANDI", "DOSYA AÇIK" gibi bürokratik işaretler. */
export default function Stamp({ children, tone = 'danger', className }) {
  return (
    <span className={classNames('stamp', tone === 'approved' && 'stamp-approved', className)}>
      {children}
    </span>
  )
}
