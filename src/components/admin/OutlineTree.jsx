import { useState } from 'react'
import { LIST_LABELS } from '../../data/lists'
import { RECORD_TYPES } from './records'

/**
 * Sayfanın içerik ağacı: bölüm → metinler / listeler / kayıtlar.
 *
 * Her bölüm kendi penceresi; liste ve kayıt grupları o pencerenin altında
 * kendi pencerelerini açar (örneğin "Hizmet kataloğu" altında "Hizmet 1").
 * Yaprağa tıklamak sağdaki düzenleyiciyi açar — önizlemede tıklamakla
 * birebir aynı yükü gönderir, böylece görselde ulaşılamayan metinler de
 * düzenlenebilir.
 */

function sameLeaf(a, b) {
  if (!a || !b) return false
  if (a.copyKey || b.copyKey) return a.copyKey === b.copyKey
  if (a.listKey || b.listKey) {
    return (
      a.listKey === b.listKey &&
      String(a.listIndex) === String(b.listIndex) &&
      a.listField === b.listField
    )
  }
  return a.rec === b.rec && (a.recField ?? null) === (b.recField ?? null)
}

function Leaf({ item, label, picked, onSelect }) {
  const active = sameLeaf(picked, item)
  return (
    <button
      type="button"
      onClick={() => onSelect?.(item)}
      title={label}
      className={[
        'block w-full truncate border-l px-2 py-1 text-left font-mono text-[10.5px] transition',
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-accent/20 text-fg-muted hover:border-accent hover:text-accent',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function Window({ title, badge, defaultOpen = false, children, tone = 'sub' }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={tone === 'top' ? 'border border-accent/30' : 'border border-accent/20'}>
      <div className="flex items-center gap-1 bg-accent/[0.06]">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-1.5 px-2 py-1.5 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] text-accent"
        >
          <span aria-hidden="true" className="text-fg-subtle">
            {open ? '▾' : '▸'}
          </span>
          <span className="truncate">{title}</span>
        </button>
        {badge}
      </div>
      {open ? <div className="space-y-1 p-1.5">{children}</div> : null}
    </div>
  )
}

function fieldLabel(field, text) {
  const name = field ? `${field}: ` : ''
  return `${name}${text || '—'}`
}

export default function OutlineTree({ sections, picked, onSelect, onToggleSection, busySection }) {
  if (!sections || sections.length === 0) {
    return (
      <p className="p-3 font-mono text-[10.5px] leading-relaxed text-fg-subtle">
        Sayfa yükleniyor…
      </p>
    )
  }

  return (
    <div className="space-y-1.5 p-2">
      {sections.map((section) => (
        <Window
          key={section.key}
          tone="top"
          defaultOpen={false}
          title={section.label}
          badge={
            section.id ? (
              <button
                type="button"
                onClick={() => onToggleSection?.(section)}
                disabled={busySection === section.id}
                title={section.hidden ? 'Bölümü yayına al' : 'Bölümü yayından kaldır'}
                className={[
                  'mr-1.5 shrink-0 border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] transition disabled:opacity-50',
                  section.hidden
                    ? 'border-fg-subtle/50 text-fg-subtle hover:text-fg'
                    : 'border-accent/50 text-accent hover:bg-accent/10',
                ].join(' ')}
              >
                {section.hidden ? 'Offline' : 'Online'}
              </button>
            ) : null
          }
        >
          {section.texts.map((item) => (
            <Leaf
              key={item.copyKey}
              item={item}
              label={item.text || item.copyKey}
              picked={picked}
              onSelect={onSelect}
            />
          ))}

          {section.lists.map((group) => (
            <Window key={group.key} title={LIST_LABELS[group.key] ?? group.key}>
              {group.items.map((child) => (
                <Window
                  key={child.index}
                  title={child.fields[0]?.text || `${Number(child.index) + 1}. öğe`}
                >
                  {child.fields.map((field) => (
                    <Leaf
                      key={field.listField}
                      item={field}
                      label={fieldLabel(field.listField, field.text)}
                      picked={picked}
                      onSelect={onSelect}
                    />
                  ))}
                </Window>
              ))}
            </Window>
          ))}

          {section.records.map((record) => (
            <Window
              key={record.rec}
              title={record.label || RECORD_TYPES[record.rec.split(':')[0]]?.singular || 'Kayıt'}
            >
              <Leaf
                item={{ rec: record.rec }}
                label="Kaydın tüm alanları"
                picked={picked}
                onSelect={onSelect}
              />
              {record.fields.map((field) => (
                <Leaf
                  key={field.recField}
                  item={field}
                  label={fieldLabel(field.recField, field.text)}
                  picked={picked}
                  onSelect={onSelect}
                />
              ))}
            </Window>
          ))}

          {section.texts.length === 0 &&
          section.lists.length === 0 &&
          section.records.length === 0 ? (
            <p className="px-2 py-1 font-mono text-[10px] text-fg-subtle">
              Bu bölümde düzenlenebilir metin yok.
            </p>
          ) : null}
        </Window>
      ))}
    </div>
  )
}
