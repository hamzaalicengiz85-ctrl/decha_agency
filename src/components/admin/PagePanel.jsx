import { useCallback, useMemo, useRef, useState } from 'react'
import PreviewFrame from './PreviewFrame'
import CopyDrawer from './CopyDrawer'
import OutlineTree from './OutlineTree'
import { PAGES, pageUrl } from './pages'
import { useAdminTable } from '../../hooks/useAdminTable'
import { adminWrite } from '../../lib/adminAuth'
import { VISIBILITY_PREFIX } from '../../lib/siteCopyContext'

/**
 * Sayfa kategorisi: ortada gerçek sayfanın görseli, yanında sayfanın içerik
 * ağacı. Hem görselden hem ağaçtan seçilen öğe sağdaki çekmecede düzenlenir.
 */
export default function PagePanel({ onNeedsReauth }) {
  const [pageKey, setPageKey] = useState(PAGES[0].key)
  const page = PAGES.find((item) => item.key === pageKey) ?? PAGES[0]

  const [slug, setSlug] = useState('')
  const [picked, setPicked] = useState(null)
  const [sections, setSections] = useState([])
  const [busySection, setBusySection] = useState(null)
  const [error, setError] = useState('')
  const frameRef = useRef(null)

  // Detay rotaları bir kayıt gerektirir; tablodan ilk slug seçilir.
  const { rows } = useAdminTable(page.table ?? 'projects', { enabled: Boolean(page.table) })
  const slugs = useMemo(() => rows.map((row) => row.slug).filter(Boolean), [rows])
  const activeSlug = slug || slugs[0] || 'ornek'

  const src = pageUrl(page, activeSlug)

  const handlePick = useCallback((data) => setPicked(data), [])
  const handleOutline = useCallback((data) => setSections(data ?? []), [])

  const applyToPreview = useCallback((payload) => {
    frameRef.current?.contentWindow?.postMessage(
      { type: 'decha:apply', ...payload },
      window.location.origin,
    )
  }, [])

  /**
   * Bölümü yayına alır / yayından kaldırır. Görünürlük ayrı bir tablo yerine
   * `site_copy` içinde `gorunurluk.<bölüm>` anahtarında tutulur; boş değer
   * "yayında" demektir.
   *
   * Ağaç yerel olarak da güncellenir: iframe yalnızca bir öznitelik
   * değiştirdiği için köprünün gözlemcisi tetiklenmez.
   */
  const toggleSection = useCallback(
    async (section) => {
      if (!section.id) return
      const key = `${VISIBILITY_PREFIX}${section.id}`
      const value = section.hidden ? '' : 'gizli'

      setBusySection(section.id)
      setError('')
      const result = await adminWrite((client) =>
        client
          .from('site_copy')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
          .select(),
      )
      setBusySection(null)

      if (result.needsReauth) return onNeedsReauth?.()
      if (result.error) return setError(result.error)

      applyToPreview({ key, value })
      setSections((current) =>
        current.map((item) =>
          item.id === section.id ? { ...item, hidden: !section.hidden } : item,
        ),
      )
    },
    [applyToPreview, onNeedsReauth],
  )

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
              setSections([])
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
        Sayfadaki bir yazıya tıklayın ya da yandaki ağaçtan seçin. Bölüm
        başlığındaki Online/Offline düğmesi o bölümü siteden kaldırır.
        {error ? <span className="ml-2 text-accent">{error}</span> : null}
      </p>

      <div className="flex min-h-0 flex-1 gap-3">
        <div className="min-w-0 flex-1">
          <PreviewFrame
            key={src}
            src={src}
            frameRef={frameRef}
            onPick={handlePick}
            onOutline={handleOutline}
          />
        </div>

        <div className="flex w-72 shrink-0 flex-col border border-accent/35 bg-bg-soft/40">
          <div className="border-b border-accent/35 px-3 py-2.5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              Sayfa içeriği
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <OutlineTree
              sections={sections}
              picked={picked}
              onSelect={setPicked}
              onToggleSection={toggleSection}
              busySection={busySection}
            />
          </div>
        </div>

        {picked ? (
          <CopyDrawer
            picked={picked}
            onSelect={setPicked}
            onClose={() => setPicked(null)}
            onApplied={applyToPreview}
            onNeedsReauth={onNeedsReauth}
          />
        ) : null}
      </div>
    </div>
  )
}
