import { useState } from 'react'
import Field, { fieldInputClass } from '../ui/Field'
import Button from '../ui/Button'
import Icon from '../ui/Icon'
import { classNames, slugify } from '../../lib/format'
import { RECORD_TYPES, emptyRecord, toPayload, validate } from './records'

/** Düz metin dizisi düzenleyici (maddeler, etiketler). */
function ListEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : []
  return (
    <div className="space-y-2">
      {list.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(event) => {
              const next = [...list]
              next[index] = event.target.value
              onChange(next)
            }}
            className={classNames(fieldInputClass, 'border-accent/40')}
            aria-label={`Madde ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => onChange(list.filter((_, i) => i !== index))}
            className="key shrink-0 px-3 text-accent"
            aria-label={`Madde ${index + 1} sil`}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, ''])}
        className="key inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
      >
        <Icon name="plus" className="h-3.5 w-3.5" /> Madde ekle
      </button>
    </div>
  )
}

/** {label, value} çiftleri düzenleyici (proje sonuçları). */
function PairsEditor({ items, onChange }) {
  const list = Array.isArray(items) ? items : []
  const update = (index, key, value) => {
    const next = list.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    onChange(next)
  }
  return (
    <div className="space-y-2">
      {list.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item.label ?? ''}
            onChange={(event) => update(index, 'label', event.target.value)}
            placeholder="Etiket"
            className={classNames(fieldInputClass, 'border-accent/40')}
            aria-label={`Sonuç ${index + 1} etiketi`}
          />
          <input
            value={item.value ?? ''}
            onChange={(event) => update(index, 'value', event.target.value)}
            placeholder="Değer"
            className={classNames(fieldInputClass, 'border-accent/40')}
            aria-label={`Sonuç ${index + 1} değeri`}
          />
          <button
            type="button"
            onClick={() => onChange(list.filter((_, i) => i !== index))}
            className="key shrink-0 px-3 text-accent"
            aria-label={`Sonuç ${index + 1} sil`}
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...list, { label: '', value: '' }])}
        className="key inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent"
      >
        <Icon name="plus" className="h-3.5 w-3.5" /> Sonuç ekle
      </button>
    </div>
  )
}

export default function RecordForm({ typeKey, record, onSave, onCancel, onDelete, saving }) {
  const type = RECORD_TYPES[typeKey]
  const [values, setValues] = useState(() => ({ ...emptyRecord(typeKey), ...(record ?? {}) }))
  const [errors, setErrors] = useState({})

  const isNew = !record?.id

  const set = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(typeKey, values)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    onSave(toPayload(typeKey, values), values.id)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {type.fields.map((field) => {
        if (field.type === 'list') {
          return (
            <div key={field.name}>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {field.label}
              </p>
              <ListEditor items={values[field.name]} onChange={(next) => set(field.name, next)} />
            </div>
          )
        }
        if (field.type === 'pairs') {
          return (
            <div key={field.name}>
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {field.label}
              </p>
              <PairsEditor items={values[field.name]} onChange={(next) => set(field.name, next)} />
            </div>
          )
        }
        if (field.type === 'switch') {
          return (
            <label key={field.name} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={Boolean(values[field.name])}
                onChange={(event) => set(field.name, event.target.checked)}
                className="h-4 w-4 accent-[rgb(var(--c-accent))]"
              />
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-muted">
                {field.label}
              </span>
            </label>
          )
        }
        if (field.type === 'select') {
          return (
            <Field
              key={field.name}
              as="select"
              label={field.label}
              error={errors[field.name]}
              value={values[field.name] ?? ''}
              onChange={(event) => set(field.name, event.target.value)}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Field>
          )
        }

        return (
          <Field
            key={field.name}
            label={field.label}
            required={field.required}
            error={errors[field.name]}
            hint={field.hint}
            as={field.type === 'textarea' ? 'textarea' : 'input'}
            type={field.type === 'textarea' ? undefined : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
            rows={field.rows}
            min={field.min}
            max={field.max}
            value={values[field.name] ?? ''}
            onChange={(event) => set(field.name, event.target.value)}
            // Adres eki boşsa başlıktan türetilir; elle değiştirilebilir.
            onBlur={
              field.slugFrom
                ? () => {
                    if (!String(values[field.name] ?? '').trim()) {
                      set(field.name, slugify(values[field.slugFrom] ?? ''))
                    }
                  }
                : undefined
            }
          />
        )
      })}

      <div className="flex flex-wrap items-center gap-2 border-t border-accent/25 pt-4">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? 'Kaydediliyor…' : isNew ? 'Oluştur' : 'Kaydet'}
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Vazgeç
        </Button>
        {!isNew && onDelete ? (
          <button
            type="button"
            onClick={() => onDelete(values.id)}
            className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-danger underline underline-offset-4"
          >
            Kaydı sil
          </button>
        ) : null}
      </div>
    </form>
  )
}
