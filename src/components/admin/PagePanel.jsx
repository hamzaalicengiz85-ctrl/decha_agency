import { useCallback, useMemo, useRef, useState } from 'react'
import PreviewFrame from './PreviewFrame'
import CopyDrawer from './CopyDrawer'
import { PAGES, pageUrl } from './pages'
import { useAdminTable } from '../../hooks/useAdminTable'

/**
 * Sayfa kategorisi: solda gerçek sayfanın görseli, tıklanan öğe sağda
 * düzenleme çekmecesinde açılır.
 */
export default function PagePanel({ onNeedsReauth }) {
  const [pageKey, setPageKey] = useState(PAGES[0].key)
  const page = PAGES.find((item) => item.key === pageKey) ?? PAGES[0]

  const [slug, setSlug] = useState('')
  const [picked, setPicked] = useState(null)
  const [inventory, setInventory] = useState([])
  const frameRef = useRef(null)

  // Detay rotaları bir kayıt gerektirir; tablodan ilk slug seçilir.
  const { rows } = useAdminTable(page.table ?? 'projects', { enabled: Boolean(page.table) })
  const slugs = useMemo(() => rows.map((row) => row.slug).filter(Boolean), [rows])
  const activeSlug = slug || slugs[0] || 'ornek'

  const src = pageUrl(page, activeSlug)

  const handlePick = useCallback((data) => setPicked(data), [])
  const handleInventory = useCallback((items) => setInventory(items), [])

  const applyToPreview = useCallback((payload) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'decha:apply', ...payload },
      window.location.origin,
    )
  }, [])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PAGES.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => {
              setPageKey(item.key)
              setPicked(null)
              setSlug('')
            }}
            aria-current={item.key === pageKey ? 'page' : undefined}
            className={[
              'px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] transition',
              item.key === pageKey
                ? 'bg-accent text-accent-fg'
                : 'border border-accent/35 text-fg-muted hover:text-accent',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}

        {page.table ? (
          <select
            value={activeSlug}
            onChange={(event) => setSlug(event.target.value)}
            aria-label="Gösterilecek kayıt"
            className="border border-accent/40 bg-accent/[0.04] px-2 py-1.5 font-mono text-[10.5px] text-fg"
          >
            {slugs.length === 0 ? <option value="ornek">(kayıt yok)</option> : null}
            {slugs.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      <p className="mb-3 font-mono text-[10.5px] text-fg-subtle">
        Sayfadaki bir yazıya tıklayın; sağda düzenlenir. Kesikli çerçeveli her
        şey düzenlenebilir.
      </p>

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="min-w-0 flex-1">
          <PreviewFrame
            key={src}
            src={src}
            frameRef={frameRef}
            onPick={handlePick}
            onInventory={handleInventory}
          />
        </div>

        <CopyDrawer
          picked={picked}
          inventory={inventory}
          onSelect={setPicked}
          onClose={() => setPicked(null)}
          onApplied={applyToPreview}
          onNeedsReauth={onNeedsReauth}
        />
      </div>
    </div>
  )
}
