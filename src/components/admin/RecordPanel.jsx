import { useState } from 'react'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { Spinner } from '../ui/Loader'
import RecordForm from './RecordForm'
import { RECORD_TYPES } from './records'
import { useAdminTable } from '../../hooks/useAdminTable'
import { adminWrite } from '../../lib/adminAuth'

/**
 * Bir tablonun kayıt listesi ve düzenleyicisi.
 * Okuma `useAdminTable` ile yapılır — boş tablo boş görünmeli, yerel demo
 * içeriği panelde asla gösterilmemeli (yoksa var olmayan kaydın üstüne
 * yazılır).
 */
export default function RecordPanel({ typeKey, onNeedsReauth }) {
  const type = RECORD_TYPES[typeKey]
  const { rows, loading, error, reload } = useAdminTable(typeKey, { order: type.order })

  const [editing, setEditing] = useState(null) // kayıt nesnesi | 'new' | null
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function handleSave(payload, id) {
    setSaving(true)
    setFeedback('')

    const result = await adminWrite((client) =>
      id
        ? client.from(typeKey).update(payload).eq('id', id).select()
        : client.from(typeKey).insert(payload).select(),
    )

    setSaving(false)
    if (result.needsReauth) return onNeedsReauth?.()
    if (result.error) return setFeedback(result.error)

    setEditing(null)
    setFeedback(id ? 'Kayıt güncellendi.' : 'Kayıt oluşturuldu.')
    reload()
  }

  async function handleDelete(id) {
    if (!window.confirm('Bu kayıt kalıcı olarak silinecek. Emin misiniz?')) return

    setSaving(true)
    const result = await adminWrite((client) => client.from(typeKey).delete().eq('id', id))
    setSaving(false)

    if (result.needsReauth) return onNeedsReauth?.()
    if (result.error) return setFeedback(result.error)

    setEditing(null)
    setFeedback('Kayıt silindi.')
    reload()
  }

  if (loading) return <Spinner label={`${type.label} yükleniyor`} />

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[19px] font-bold uppercase text-accent">{type.label}</h2>
          <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-subtle">
            {rows.length} kayıt
          </p>
        </div>
        {editing === null ? (
          <Button type="button" size="sm" onClick={() => setEditing('new')}>
            <Icon name="plus" className="h-3.5 w-3.5" /> {type.singular} ekle
          </Button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mb-4 border border-danger/50 bg-danger/10 p-3 font-mono text-[11px] text-danger">
          {error}
        </p>
      ) : null}

      {feedback ? (
        <p role="status" className="mb-4 border border-accent/40 bg-accent/[0.06] p-3 font-mono text-[11px] text-fg-muted">
          {feedback}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="panel mb-4 p-5 font-mono text-[12px] text-fg-muted">
          Bu tabloda hiç kayıt yok. Site şu an yerel demo içeriğini gösteriyor —
          buraya kayıt ekleyene kadar öyle kalır.
        </p>
      ) : null}

      {editing !== null ? (
        <div className="panel brackets p-5">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            {editing === 'new' ? `Yeni ${type.singular.toLocaleLowerCase('tr')}` : 'Kaydı düzenle'}
          </p>
          <RecordForm
            typeKey={typeKey}
            record={editing === 'new' ? null : editing}
            saving={saving}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            onDelete={editing === 'new' ? undefined : handleDelete}
          />
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                type="button"
                onClick={() => setEditing(row)}
                className="panel panel-hover flex w-full items-center justify-between gap-4 p-4 text-left"
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-[14px] font-bold uppercase text-accent">
                    {row[type.titleField] || '(başlıksız)'}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[10.5px] text-fg-subtle">
                    {row.slug ?? row.company ?? row.category ?? ''}
                  </span>
                </span>
                <Icon name="arrow" className="h-4 w-4 shrink-0 text-accent" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
