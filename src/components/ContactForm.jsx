import { useState } from 'react'
import Button from './ui/Button'
import Icon from './ui/Icon'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { SITE, services } from '../data/content'
import { classNames } from '../lib/format'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  message: '',
  kvkk: false,
}

const budgets = ['25.000₺ altı', '25.000₺ – 75.000₺', '75.000₺ – 150.000₺', '150.000₺ üzeri']

function validate(values) {
  const errors = {}
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Lütfen adınızı girin.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Geçerli bir e-posta adresi girin.'
  }
  if (values.phone && !/^[0-9\s()+-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Telefon numarası geçersiz görünüyor.'
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Mesajınız en az 10 karakter olmalı.'
  }
  if (!values.kvkk) {
    errors.kvkk = 'Devam etmek için onay vermelisiniz.'
  }
  return errors
}

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      setFeedback('Lütfen işaretli alanları kontrol edin.')
      return
    }

    setStatus('loading')
    setFeedback('')

    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim() || null,
      company: values.company.trim() || null,
      service: values.service || null,
      budget: values.budget || null,
      message: values.message.trim(),
    }

    try {
      if (!isSupabaseConfigured || !supabase) {
        throw new Error('SUPABASE_NOT_CONFIGURED')
      }

      const { error } = await supabase.from('contact_messages').insert(payload)
      if (error) throw error

      setStatus('success')
      setFeedback('Mesajınız bize ulaştı. En geç 1 iş günü içinde dönüş yapacağız.')
      setValues(EMPTY)
    } catch (error) {
      setStatus('error')
      if (error.message === 'SUPABASE_NOT_CONFIGURED') {
        setFeedback(
          `Form altyapısı henüz bağlanmadı. Bize doğrudan ${SITE.email} adresinden ulaşabilirsiniz.`,
        )
      } else {
        setFeedback(
          `Mesaj gönderilemedi. Lütfen tekrar deneyin veya ${SITE.email} adresine yazın.`,
        )
      }
      if (import.meta.env.DEV) {
        console.error('[ContactForm]', error)
      }
    }
  }

  const inputClass = (field) =>
    classNames(
      'w-full border bg-bg/60 px-3 py-2.5 font-mono text-[13px] text-fg transition placeholder:text-fg-subtle/60 focus:border-accent focus:bg-bg-elev focus:outline-none',
      errors[field] ? 'border-danger bg-danger/[0.06]' : 'border-line/30',
    )

  return (
    <form onSubmit={handleSubmit} noValidate className="panel p-0">
      {/* Resmî form başlığı */}
      <div className="flex items-center justify-between border-b-2 border-line/25 bg-line/[0.06] px-5 py-3">
        <div>
          <p className="font-display text-[13px] font-bold uppercase tracking-[0.1em] text-fg">
            Başvuru Formu
          </p>
          <p className="eyebrow mt-0.5">Form DA-42 · Tüm alanlar okunaklı doldurulmalıdır</p>
        </div>
        <span className="num hidden font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle sm:block">
          Rev. 2026.04
        </span>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            Ad Soyad <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Adınız ve soyadınız"
            className={inputClass('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="mt-1.5 text-xs text-danger">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            E-posta <span className="text-danger">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="ornek@sirket.com"
            className={inputClass('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="mt-1.5 text-xs text-danger">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange}
            placeholder="+90 5xx xxx xx xx"
            className={inputClass('phone')}
          />
          {errors.phone ? <p className="mt-1.5 text-xs text-danger">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="company" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            Şirket
          </label>
          <input
            id="company"
            name="company"
            type="text"
            value={values.company}
            onChange={handleChange}
            placeholder="Şirket adı"
            className={inputClass('company')}
          />
        </div>

        <div>
          <label htmlFor="service" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            İlgilendiğiniz hizmet
          </label>
          <select
            id="service"
            name="service"
            value={values.service}
            onChange={handleChange}
            className={inputClass('service')}
          >
            <option value="">Seçiniz</option>
            {services.map((service) => (
              <option key={service.slug} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="budget" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            Bütçe aralığı
          </label>
          <select
            id="budget"
            name="budget"
            value={values.budget}
            onChange={handleChange}
            className={inputClass('budget')}
          >
            <option value="">Seçiniz</option>
            {budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-1.5 block font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-fg-muted">
            Projeniz <span className="text-danger">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange}
            placeholder="Hedeflerinizi ve beklentilerinizi kısaca anlatın…"
            className={classNames(inputClass('message'), 'resize-y')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
          />
          {errors.message ? (
            <p id="message-error" className="mt-1.5 text-xs text-danger">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <label className="flex cursor-pointer items-start gap-3 border-t border-dashed border-line/30 px-5 py-4 text-[12.5px] leading-relaxed text-fg-muted sm:px-6">
        <input
          type="checkbox"
          name="kvkk"
          checked={values.kvkk}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 rounded border-line/20 bg-transparent text-accent-ink accent-[rgb(var(--c-accent))]"
        />
        <span>
          Verilerimin talebimi değerlendirmek amacıyla işlenmesini kabul ediyorum (KVKK).
          {errors.kvkk ? <span className="block text-xs text-danger">{errors.kvkk}</span> : null}
        </span>
      </label>

      <div className="flex flex-col gap-4 border-t border-line/25 bg-line/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <Button type="submit" disabled={status === 'loading'} size="lg">
          {status === 'loading' ? 'Gönderiliyor…' : 'Mesajı Gönder'}
          {status !== 'loading' ? <Icon name="arrow" className="h-4 w-4" /> : null}
        </Button>
        <p className="text-xs text-fg-subtle">Ortalama yanıt süremiz 1 iş günü.</p>
      </div>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={classNames(
            'mx-5 mb-5 flex items-start gap-2 border p-3.5 font-mono text-[12px] sm:mx-6',
            status === 'success'
              ? 'border-accent-ink/40 bg-accent/10 text-accent-ink'
              : 'border-red-500/30 bg-red-500/10 text-danger',
          )}
        >
          <Icon name={status === 'success' ? 'check' : 'close'} className="mt-0.5 h-4 w-4 shrink-0" />
          {feedback}
        </p>
      ) : null}
    </form>
  )
}
