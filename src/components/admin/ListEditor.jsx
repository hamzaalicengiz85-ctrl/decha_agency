import { ICON_NAMES } from './records'

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
}

const LONG = new Set(['text', 'a', 'summary'])

function fieldLabel(name) {
  return LABELS[name] ?? name
}

export default function ListEditor({ item, fields, onChange }) {
  return (
    <div className="space-y-3">
      {fields.map((name) => {
        const id = `list-field-${name}`
        const value = item?.[name] ?? ''

        return (
          <div key={name}>
            <label
              htmlFor={id}
              className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle"
            >
              {fieldLabel(name)}
            </label>

            {name === 'icon' ? (
              <select
                id={id}
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                className="w-full border border-accent/40 bg-accent/[0.04] px-3 py-2 font-mono text-[12.5px] text-fg focus:border-accent focus:outline-none"
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
                className="w-full border border-accent/40 bg-accent/[0.04] px-3 py-2 font-mono text-[12.5px] text-fg focus:border-accent focus:outline-none"
              />
            ) : (
              <input
                id={id}
                type="text"
                value={value}
                onChange={(event) => onChange(name, event.target.value)}
                className="w-full border border-accent/40 bg-accent/[0.04] px-3 py-2 font-mono text-[12.5px] text-fg focus:border-accent focus:outline-none"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
