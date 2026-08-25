import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Terminal diline uygun kalıcı pencere.
 *
 * Menü çubuğunda `backdrop-blur` olduğu için orası kendi yığın bağlamını
 * oluşturuyor; pencere DOM'da orada dursa katman sıralaması bozulurdu.
 * Bu yüzden portal ile doğrudan body'ye basılır.
 *
 * Erişilebilirlik: Escape ile kapanır, odak pencerede döngüye alınır,
 * kapanışta odak tetikleyen öğeye geri döner, arka plan kaydırması kilitlenir.
 */
export default function Modal({ open, onClose, title, code, children }) {
  const panelRef = useRef(null)
  const restoreFocusRef = useRef(null)

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes || nodes.length === 0) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return undefined

    restoreFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    const focusTimer = window.setTimeout(() => {
      const target = panelRef.current?.querySelector(FOCUSABLE)
      target?.focus()
    }, 20)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      restoreFocusRef.current?.focus?.()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      {/* Arka plan — tıklanınca kapanır */}
      <button
        type="button"
        aria-label="Pencereyi kapat"
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-bg/85 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="panel brackets relative z-10 w-full max-w-lg animate-fade-up"
      >
        <div className="flex items-center justify-between gap-4 border-b border-accent/45 bg-accent/10 px-4 py-3">
          <div className="flex items-baseline gap-2.5">
            {code ? (
              <span className="num bg-accent px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent-fg">
                {code}
              </span>
            ) : null}
            <h2
              id="modal-title"
              className="font-display text-[13px] font-bold uppercase tracking-[0.14em] text-accent"
            >
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Pencereyi kapat"
            className="grid h-8 w-8 place-items-center border border-accent/45 text-accent transition hover:bg-accent hover:text-accent-fg"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        {children}
      </div>
    </div>,
    document.body,
  )
}
