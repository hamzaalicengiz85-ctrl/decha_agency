import { useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SITE } from '../data/content'
import { classNames } from '../lib/format'
import { MEETING_LOCATIONS, meetingLocationLabel } from '../data/meeting'

const EMPTY = { name: '', email: '', date: '', time: '', location: '', notes: '' }

/** Bugünün tarihi — geçmişe randevu verilmesini engellemek için. */
function today() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

function validate(values) {
  const errors = {}
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Adınızı girin.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi girin.'
  }
  if (!values.date) {
    errors.date = 'Tarih seçin.'
  } else if (values.date < today()) {
    errors.date = 'Geçmiş bir tarih seçilemez.'
  }
  if (!values.time) {
    errors.time = 'Saat seçin.'
  }
  if (!MEETING_LOCATIONS.some((option) => option.value === values.location)) {
    errors.location = 'Toplantı yerini seçin.'
  }
  return errors
}

export default function MeetingModal({ open, onClose }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')

  const close = () => {
    onClose()
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
    setFeedback('')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setFeedback('İşaretli alanları kontrol edin.')
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('SUPABASE_NOT_CONFIGURED')
      }

      const { error } = await supabase.from('meeting_requests').insert({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        meeting_date: values.date,
        meeting_time: values.time,
        location: values.location,
        notes: values.notes.trim() || null,
      })
      if (error) throw error

      setStatus('success')
      setFeedback('Toplantı talebiniz kaydedildi. Onay için size e-posta ile döneceğiz.')
    } catch (error) {
      setStatus('error')
      setFeedback(
        error.message === 'SUPABASE_NOT_CONFIGURED'
          ? `Kayıt altyapısı henüz bağlanmadı. ${SITE.email} adresinden yazabilirsiniz.`
          : `Talep kaydedilemedi. Lütfen tekrar deneyin veya ${SITE.email} adresine yazın.`,
      )
      if (import.meta.env.DEV) {
        console.error('[MeetingModal]', error)
      }
    }
  }

  const fieldClass = (field) =>
    classNames(
      'w-full border bg-accent/[0.04] px-3 py-2.5 font-mono text-[13px] text-fg transition placeholder:text-fg-subtle focus:border-accent focus:bg-accent/[0.09] focus:outline-none',
      errors[field] ? 'border-danger bg-danger/10' : 'border-accent/40',
    )

  const labelClass =
    'mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-accent'

  const errorFor = (field, id) =>
    errors[field] ? (
      <p id={id} className="mt-1.5 font-mono text-[11px] text-danger">
        {errors[field]}
      </p>
    ) : null

  const locationLabel = meetingLocationLabel(values.location)

  return (
    <Modal open={open} onClose={close} title="Toplantı Planla" code="07">
      {status === 'success' ? (
        <div className="px-5 py-8 text-center sm:px-6">
          <span className="mx-auto grid h-11 w-11 place-items-center border border-accent text-accent">
            <Icon name="check" className="h-5 w-5" />
          </span>
          <p className="mt-5 font-display text-[15px] font-bold uppercase text-accent">
            Talep kaydedildi
          </p>

          <dl className="mx-auto mt-6 max-w-sm space-y-2 font-mono text-[12px]">
            {[
              ['Ad', values.name],
              ['E-posta', values.email],
              ['Tarih', values.date],
              ['Saat', values.time],
              ['Yer', locationLabel],
            ].map(([key, value]) => (
              <div key={key} className="flex items-baseline justify-between gap-3">
                <dt className="shrink-0 text-fg-subtle">{key}</dt>
                <dd className="dotted-rule flex-1" aria-hidden="true" />
                <dd className="num truncate text-fg">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[12.5px] leading-relaxed text-fg-muted">{feedback}</p>
          <Button type="button" onClick={close} className="mt-7">
            Kapat
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <p className="border-b border-dashed border-accent/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:px-6">
            Form DA-07 · Yıldızlı alanlar zorunludur
          </p>

          <div className="grid max-h-[52vh] gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2 sm:px-6">
            <div>
              <label htmlFor="meeting-name" className={labelClass}>
                Ad Soyad <span className="text-danger">*</span>
              </label>
              <input
                id="meeting-name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                placeholder="Adınız ve soyadınız"
                className={fieldClass('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'meeting-name-error' : undefined}
              />
              {errorFor('name', 'meeting-name-error')}
            </div>

            <div>
              <label htmlFor="meeting-email" className={labelClass}>
                E-posta <span className="text-danger">*</span>
              </label>
              <input
                id="meeting-email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="ornek@sirket.com"
                className={fieldClass('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'meeting-email-error' : undefined}
              />
              {errorFor('email', 'meeting-email-error')}
            </div>

            <div>
              <label htmlFor="meeting-date" className={labelClass}>
                Tarih <span className="text-danger">*</span>
              </label>
              <input
                id="meeting-date"
                name="date"
                type="date"
                min={today()}
                value={values.date}
                onChange={handleChange}
                className={fieldClass('date')}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? 'meeting-date-error' : undefined}
              />
              {errorFor('date', 'meeting-date-error')}
            </div>

            <div>
              <label htmlFor="meeting-time" className={labelClass}>
                Saat <span className="text-danger">*</span>
              </label>
              <input
                id="meeting-time"
                name="time"
                type="time"
                value={values.time}
                onChange={handleChange}
                className={fieldClass('time')}
                aria-invalid={Boolean(errors.time)}
                aria-describedby={errors.time ? 'meeting-time-error' : undefined}
              />
              {errorFor('time', 'meeting-time-error')}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="meeting-location" className={labelClass}>
                Yer <span className="text-danger">*</span>
              </label>
              <select
                id="meeting-location"
                name="location"
                value={values.location}
                onChange={handleChange}
                className={fieldClass('location')}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? 'meeting-location-error' : undefined}
              >
                <option value="">Seçiniz</option>
                {MEETING_LOCATIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errorFor('location', 'meeting-location-error')}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="meeting-notes" className={labelClass}>
                Açıklama <span className="text-fg-subtle">(opsiyonel)</span>
              </label>
              <textarea
                id="meeting-notes"
                name="notes"
                rows={3}
                value={values.notes}
                onChange={handleChange}
                placeholder="Görüşmek istediğiniz konu, adres veya bağlantı bilgisi…"
                className={classNames(fieldClass('notes'), 'resize-y')}
              />
            </div>
          </div>

          {feedback ? (
            <p
              role="status"
              aria-live="polite"
              className="mx-5 mb-4 flex items-start gap-2 border border-danger/40 bg-danger/10 p-3 font-mono text-[12px] text-danger sm:mx-6"
            >
              <Icon name="close" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {feedback}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-accent/40 bg-accent/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Kaydediliyor…' : 'Toplantıyı Planla'}
              {status !== 'loading' ? <Icon name="arrow" className="h-3.5 w-3.5" /> : null}
            </Button>
            <button
              type="button"
              onClick={close}
              className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle transition hover:text-accent"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
