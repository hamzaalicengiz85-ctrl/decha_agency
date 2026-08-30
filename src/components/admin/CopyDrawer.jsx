import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { adminWrite } from '../../lib/adminAuth'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { LIST_DEFAULTS } from '../../data/lists'

/**
 * Önizlemede tıklanan öğenin düzenleyicisi.
 *
 * Boş bırakmak "varsayılanı kullan" demektir: koddaki metin geri gelir.
 * Bu bilinçli — yanlışlıkla boşaltılan bir başlık kalıcı olarak kaybolmaz.
 */
export default function CopyDrawer({ picked, inventory, onSelect, onClose, onApplied, onNeedsReauth }) {
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [listRow, setListRow] = useState(null)

  useEffect(() => {
    setValue(picked?.text ?? '')
    setFeedback('')
  }, [picked])

  // Liste öğesi seçildiğinde kayıtlı diziyi çek. Kayıt yoksa koddaki
  // varsayılandan başlanır — DOM'dan yeniden kurmak, ekranda görünmeyen
  // alanları (örneğin ilke simgesi) düşürürdü.
  useEffect(() => {
    const key = picked?.listKey
    if (!key) return setListRow(null)

    let alive = true
    const fallback = LIST_DEFAULTS[key] ?? []
    if (!isSupabaseConfigured || !supabase) return setListRow(fallback)

    supabase
      .from('site_lists')
      .select('items')
      .eq('key', key)
      .maybeSingle()
      .then(({ data }) => {
        if (!alive) return
        setListRow(Array.isArray(data?.items) && data.items.length > 0 ? data.items : fallback)
      })
    return () => {
      alive = false
    }
  }, [picked?.listKey])

  async function handleSave() {
    if (!picked?.copyKey) return
    setSaving(true)

    const result = await adminWrite((client) =>
      client
        .from('site_copy')
        .upsert({ key: picked.copyKey, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select(),
    )

    setSaving(false)
    if (result.needsReauth) return onNeedsReauth?.()
    if (result.error) return setFeedback(result.error)

    setFeedback('Kaydedildi.')
    onApplied?.({ key: picked.copyKey, value })
  }

  async function handleSaveList() {
    const key = picked?.listKey
    const index = Number(picked?.listIndex)
    const field = picked?.listField
    if (!key || !listRow || Number.isNaN(index)) return

    // Yalnızca seçilen alan değişir; öğenin diğer alanları olduğu gibi kalır.
    const items = listRow.map((item, i) => (i === index ? { ...item, [field]: value } : item))

    setSaving(true)
    const result = await adminWrite((client) =>
      client
        .from('site_lists')
        .upsert({ key, items, updated_at: new Date().toISOString() }, { onConflict: 'key' })
        .select(),
    )
    setSaving(false)

    if (result.needsReauth) return onNeedsReauth?.()
    if (result.error) return setFeedback(result.error)

    setListRow(items)
    setFeedback('Kaydedildi.')
    onApplied?.({ listKey: key, items })
  }

  const isList = Boolean(picked?.listKey)

  return (
    <aside className="flex w-80 shrink-0 flex-col border border-accent/35 bg-bg-soft/40">
      <div className="border-b border-accent/35 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          {picked ? 'Seçili öğe' : 'Sayfa metinleri'}
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isList ? (
          <>
            <p className="mb-2 break-all font-mono text-[10px] text-fg-subtle">
              {picked.listKey} · {Number(picked.listIndex) + 1}. öğe · {picked.listField}
            </p>
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={5}
              aria-label="Metin"
              className="w-full border border-accent/40 bg-accent/[0.04] px-3 py-2.5 font-mono text-[12.5px] text-fg focus:border-accent focus:outline-none"
            />
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-fg-subtle">
              Bu listedeki {listRow?.length ?? '—'} öğeden birini düzenliyorsunuz. Öğe ekleme ve
              silme henüz panelde yok.
            </p>

            {feedback ? (
              <p role="status" className="mt-3 font-mono text-[10.5px] text-accent">
                {feedback}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button type="button" size="sm" onClick={handleSaveList} disabled={saving || !listRow}>
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onClose}>
                Kapat
              </Button>
            </div>
          </>
        ) : picked?.copyKey ? (
          <>
            <p className="mb-2 break-all font-mono text-[10px] text-fg-subtle">{picked.copyKey}</p>
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={6}
              aria-label="Metin"
              className="w-full border border-accent/40 bg-accent/[0.04] px-3 py-2.5 font-mono text-[12.5px] text-fg focus:border-accent focus:outline-none"
            />
            <p className="mt-2 font-mono text-[10px] leading-relaxed text-fg-subtle">
              Boş bırakırsanız sitedeki varsayılan metin kullanılır.
            </p>

            {feedback ? (
              <p role="status" className="mt-3 font-mono text-[10.5px] text-accent">
                {feedback}
              </p>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button type="button" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={onClose}>
                Kapat
              </Button>
            </div>
          </>
        ) : picked?.rec ? (
          <p className="font-mono text-[11.5px] leading-relaxed text-fg-muted">
            Bu bir kayıt: <span className="text-accent">{picked.rec}</span>. Sol menüdeki
            ilgili bölümden düzenleyebilirsiniz.
          </p>
        ) : (
          <>
            <p className="mb-3 font-mono text-[10.5px] leading-relaxed text-fg-subtle">
              Bu sayfada {inventory.length} düzenlenebilir metin var. Görselde
              tıklaması zor olanlar (açılır menü, hata mesajları) buradan
              seçilebilir.
            </p>
            <ul className="space-y-1">
              {inventory
                .filter((item) => item.copyKey)
                .map((item) => (
                  <li key={item.copyKey}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(item)}
                      className="w-full truncate border border-accent/25 px-2 py-1.5 text-left font-mono text-[10.5px] text-fg-muted transition hover:border-accent hover:text-accent"
                      title={item.copyKey}
                    >
                      {item.text || item.copyKey}
                    </button>
                  </li>
                ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  )
}
