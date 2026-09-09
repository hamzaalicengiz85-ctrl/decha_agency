import { useId } from 'react'
import { classNames } from '../../lib/format'

/**
 * Etiket + girdi + hata üçlüsü. Yönetim panelinde kırkın üzerinde girdi var;
 * stil tek kaynaktan gelmezse sürüklenir.
 *
 * Genel sitedeki ContactForm ve MeetingModal hâlâ kendi yerel sınıflarını
 * kullanıyor — çalışan ve testli formlar, aynı commit'te taşımak gereksiz
 * risk. Sonraki bir adımda buraya alınabilirler.
 */

export const fieldInputClass =
  'w-full border bg-accent/[0.04] px-3 py-2.5 font-mono text-caption text-fg transition ' +
  'placeholder:text-fg-subtle focus:border-accent focus:bg-accent/[0.09] focus:outline-none'

export default function Field({
  label,
  error,
  hint,
  required = false,
  as = 'input',
  className,
  children,
  ...props
}) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const Control = as

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-label uppercase tracking-label text-accent"
      >
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </label>

      <Control
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={classNames(error && errorId, hint && hintId) || undefined}
        className={classNames(
          fieldInputClass,
          // Form alanının çerçevesi bir arayüz sınırı: WCAG 1.4.11 için
          // 3:1 gerekiyor. Ölçüldü — çizgi rengi %40 opaklıkta 1.9:1,
          // %80'de 3.0:1. Dekoratif kart çerçeveleri daha soluk kalabilir,
          // bu kalamaz.
          error ? 'border-danger bg-danger/10' : 'border-line/90',
        )}
        {...props}
      >
        {children}
      </Control>

      {hint && !error ? (
        <p id={hintId} className="mt-1.5 font-mono text-label text-fg-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-1.5 font-mono text-label text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
