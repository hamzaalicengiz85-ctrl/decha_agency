import { useCallback, useEffect, useState } from 'react'
import Modal from './ui/Modal'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SITE } from '../data/content'
import { classNames } from '../lib/format'
import {
  MEETING_LOCATIONS,
  TIME_SLOTS,
  checkDate,
  meetingLocationLabel,
  today,
} from '../data/meeting'

// `website` bal küpü: gerçek kullanıcı göremez, otomatik bot doldurur.
const EMPTY = { name: '', email: '', date: '', time: '', location: '', notes: '', website: '' }

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
  } else {
    const check = checkDate(values.date)
    if (!check.open) errors.date = check.reason
  }

  if (!TIME_SLOTS.includes(values.time)) {
    errors.time = 'Saat seçin.'
  }
  if (!MEETING_LOCATIONS.some((option) => option.value === values.location)) {
    errors.location = 'Toplantı yerini seçin.'
  }

  return errors
}

/** Bugün için geçmiş saatler seçilemesin. */
function isPastSlot(isoDate, slot) {
  if (isoDate !== today()) return false
  const now = new Date()
  return Number(slot.slice(0, 2)) <= now.getHours()
}

export default function MeetingModal({ open, onClose }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')
  const [takenSlots, setTakenSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  const dateCheck = values.date ? checkDate(values.date) : { open: false }
  const dateUsable = Boolean(values.date) && dateCheck.open && values.date >= today()

  /** Seçili gün için dolu saatleri getirir. */
  const loadTakenSlots = useCallback(async (isoDate) => {
    if (!isoDate || !isSupabaseConfigured || !supabase) {
      setTakenSlots([])
      return
    }

    setSlotsLoading(true)
    try {
      const { data, error } = await supabase
        .from('meeting_slots_taken')
        .select('meeting_time')
        .eq('meeting_date', isoDate)
      if (error) throw error

      // Postgres "14:00:00" döner; arayüzdeki "14:00" ile eşleşmesi için kırpılır.
      setTakenSlots((data ?? []).map((row) => String(row.meeting_time).slice(0, 5)))
    } catch (error) {
      // Dolu saatler okunamazsa hepsi boş varsayılır; çakışmayı veritabanındaki
      // benzersizlik kısıtı yine de engeller.
      setTakenSlots([])
      if (import.meta.env.DEV) {
        console.warn('[MeetingModal] dolu saatler alınamadı:', error.message)
      }
    } finally {
      setSlotsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    if (dateUsable) {
      loadTakenSlots(values.date)
    } else {
      setTakenSlots([])
    }
  }, [open, dateUsable, values.date, loadTakenSlots])

  const close = () => {
    onClose()
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
    setFeedback('')
    setTakenSlots([])
  }

  /** Kullanıcı bir alanı düzeltince önceki gönderim hatası ekranda kalmamalı. */
  const clearSubmitError = () => {
    setStatus((prev) => (prev === 'error' ? 'idle' : prev))
    setFeedback((prev) => (prev ? '' : prev))
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    clearSubmitError()
    setValues((prev) => ({
      ...prev,
      [name]: value,
      // Gün değişince seçili saat geçersiz olabilir; sıfırlanır.
      ...(name === 'date' ? { time: '' } : null),
    }))
    setErrors((prev) => ({ ...prev, [name]: undefined, ...(name === 'date' ? { time: undefined } : null) }))
  }

  const selectSlot = (slot) => {
    clearSubmitError()
    setValues((prev) => ({ ...prev, time: slot }))
    setErrors((prev) => (prev.time ? { ...prev, time: undefined } : prev))
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

    // Bal küpü doldurulmuşsa sessizce başarılı gibi davran.
    if (values.website) {
      setStatus('success')
      setFeedback('Toplantı talebiniz kaydedildi. Onay için size e-posta ile döneceğiz.')
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

      if (error.code === '23505') {
        // Benzersizlik kısıtı: bu slot biz formu doldururken kapılmış.
        setFeedback('Bu saat az önce doldu. Lütfen başka bir saat seçin.')
        setValues((prev) => ({ ...prev, time: '' }))
        loadTakenSlots(values.date)
      } else if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        setFeedback(`Kayıt altyapısı henüz bağlanmadı. ${SITE.email} adresinden yazabilirsiniz.`)
      } else {
        setFeedback(`Talep kaydedilemedi. Lütfen tekrar deneyin veya ${SITE.email} adresine yazın.`)
      }

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
              ['Yer', meetingLocationLabel(values.location)],
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
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
            <label htmlFor="meeting-website">Bu alanı boş bırakın</label>
            <input
              id="meeting-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <p className="border-b border-dashed border-accent/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:px-6">
            Form DA-07 · Hafta içi 09:00 – 18:00 · Yıldızlı alanlar zorunlu
          </p>

          <div className="max-h-[58vh] overflow-y-auto px-5 py-5 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="meeting-name" className={labelClass}>
                  Ad Soyad <span className="text-danger">*</span>
                </label>
                <input
                  id="meeting-name"
                  name="name"
                  autoComplete="name"
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
                  autoComplete="email"
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
                  aria-describedby={errors.date ? 'meeting-date-error' : 'meeting-date-hint'}
                />
                {errors.date ? (
                  errorFor('date', 'meeting-date-error')
                ) : (
                  <p id="meeting-date-hint" className="mt-1.5 font-mono text-[10px] text-fg-subtle">
                    Hafta içi · resmî tatiller kapalı
                  </p>
                )}
              </div>

              <div>
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
            </div>

            {/* Saat tablosu */}
            <fieldset className="mt-5">
              <legend className={labelClass}>
                Saat <span className="text-danger">*</span>
              </legend>

              {!dateUsable ? (
                <p className="border border-dashed border-accent/30 px-3 py-4 text-center font-mono text-[11px] text-fg-subtle">
                  Saatleri görmek için önce uygun bir tarih seçin.
                </p>
              ) : (
                <>
                  <div
                    className="grid grid-cols-3 gap-1.5 sm:grid-cols-5"
                    role="group"
                    aria-describedby="meeting-time-hint"
                  >
                    {TIME_SLOTS.map((slot) => {
                      const taken = takenSlots.includes(slot)
                      const past = isPastSlot(values.date, slot)
                      const disabled = taken || past
                      const selected = values.time === slot

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={disabled}
                          aria-pressed={selected}
                          onClick={() => selectSlot(slot)}
                          className={classNames(
                            'num min-h-[38px] border px-2 py-2 font-mono text-[12px] transition-colors duration-150',
                            selected
                              ? 'border-accent bg-accent text-accent-fg'
                              : disabled
                                ? 'cursor-not-allowed border-accent/15 text-fg-subtle/50 line-through'
                                : 'border-accent/40 text-accent hover:bg-accent hover:text-accent-fg',
                          )}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>

                  <p
                    id="meeting-time-hint"
                    className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-fg-subtle"
                  >
                    {slotsLoading
                      ? 'Dolu saatler kontrol ediliyor…'
                      : 'Üstü çizili saatler dolu veya geçmiş'}
                  </p>
                </>
              )}

              {errorFor('time', 'meeting-time-error')}
            </fieldset>

            <div className="mt-5">
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
