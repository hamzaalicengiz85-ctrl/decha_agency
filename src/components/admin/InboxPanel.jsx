import { Spinner } from '../ui/Loader'
import { useAdminTable } from '../../hooks/useAdminTable'
import { formatDate } from '../../lib/format'
import { MEETING_LOCATIONS } from '../../data/meeting'

const LOCATION_LABEL = Object.fromEntries(MEETING_LOCATIONS.map((item) => [item.value, item.label]))

/** İletişim mesajları ve toplantı talepleri — şimdilik salt okunur. */
export default function InboxPanel({ table }) {
  const isMessages = table === 'contact_messages'
  const { rows, loading, error } = useAdminTable(table, {
    order: { column: 'created_at', ascending: false },
  })

  if (loading) return <Spinner label="Kayıtlar yükleniyor" />

  return (
    <div>
      <h2 className="font-display text-[19px] font-bold uppercase text-accent">
        {isMessages ? 'İletişim mesajları' : 'Toplantı talepleri'}
      </h2>
      <p className="mb-5 mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-fg-subtle">
        {rows.length} kayıt
      </p>

      {error ? (
        <p role="alert" className="mb-4 border border-danger/50 bg-danger/10 p-3 font-mono text-[11px] text-danger">
          {error}
        </p>
      ) : null}

      {rows.length === 0 && !error ? (
        <p className="panel p-5 font-mono text-[12px] text-fg-muted">Henüz kayıt yok.</p>
      ) : null}

      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.id} className="panel p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[14px] font-bold uppercase text-accent">{row.name}</p>
              <p className="num font-mono text-[10.5px] text-fg-subtle">
                {formatDate(row.created_at)}
              </p>
            </div>
            <p className="mt-1 font-mono text-[11px] text-fg-muted">{row.email}</p>

            {isMessages ? (
              <p className="mt-3 whitespace-pre-wrap text-[13px] leading-relaxed text-fg-muted">
                {row.message}
              </p>
            ) : (
              <p className="num mt-3 font-mono text-[12px] text-fg-muted">
                {formatDate(row.meeting_date)} · {String(row.meeting_time).slice(0, 5)} ·{' '}
                {LOCATION_LABEL[row.location] ?? row.location}
                {row.notes ? ` · ${row.notes}` : ''}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
