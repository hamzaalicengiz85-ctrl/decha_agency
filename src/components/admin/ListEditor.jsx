import { ICON_NAMES } from './records'
import PhotoField from './PhotoField'

/**
 * Liste öğesi düzenleyicisi.
 *
 * Seçilen alan değil, öğenin TAMAMI gösterilir: ekranda görünmeyen alanlar
 * (simge adı, bağlantı adresi) da düzenlenebilsin. Yeni öğe eklerken de aynı
 * form kullanılır — aksi hâlde eklenen öğenin adresi boş kalır ve düzeltmenin
 * yolu olmazdı.
 */

const LABELS = {
  title: 'Başlık',
  text: 'Metin',
  label: 'Etiket',
  value: 'Değer',
  name: 'Ad',
  role: 'Görev',
  q: 'Soru',
  a: 'Cevap',
  step: 'Adım no',
  code: 'Kod',
  icon: 'Simge',
  href: 'Bağlantı (https://…)',
  to: 'Site içi adres (/hizmetler)',
  photo: 'Fotoğraf',
}

const LONG = new Set(['text', 'a', 'summary'])

function fieldLabel(name) {
  return LABELS[name] ?? name
}

export default function ListEditor({ item, fields, onChange, onNeedsReauth }) {
  return (
    <div className="space-y-3">
      {fields.map((name) => {
        const id = `list-field-${name}`
        const value = item?.[name] ?? ''

        return (
          <div key={name}>
            <label
              htmlFor={id}
              className="mb-1 block font-mono text-label uppercase tracking-label text-fg-subtle"
            >
              {fieldLabel(name)}
            </label>

            {name === 'photo' ? (
              <PhotoField
                id={id}
                value={value}
                onChange={(next) => onChange(name, next)}
                onNeedsReauth={onNeedsReauth}
              />
            ) : name === 'icon' ? (
              <select
                id={id}
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                className="w-full border border-line/40 bg-accent/[0.04] px-3 py-2 font-mono text-meta text-fg focus:border-accent focus:outline-none"
              >
                <option value="">(varsayılan)</option>
                {ICON_NAMES.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            ) : LONG.has(name) ? (
              <textarea
                id={id}
                rows={4}
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                className="w-full border border-line/40 bg-accent/[0.04] px-3 py-2 font-mono text-meta text-fg focus:border-accent focus:outline-none"
              />
            ) : (
              <input
                id={id}
                type="text"
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                className="w-full border border-line/40 bg-accent/[0.04] px-3 py-2 font-mono text-meta text-fg focus:border-accent focus:outline-none"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
