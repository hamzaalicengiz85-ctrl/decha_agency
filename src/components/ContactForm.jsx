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
      'w-full rounded-xl border bg-ink-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500',
      errors[field] ? 'border-rose-500/70' : 'border-white/10',
    )

  return (
    <form onSubmit={handleSubmit} noValidate className="surface p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
            Ad Soyad <span className="text-rose-400">*</span>
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
            <p id="name-error" className="mt-1.5 text-xs text-rose-400">{errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
            E-posta <span className="text-rose-400">*</span>
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
            <p id="email-error" className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">
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
          {errors.phone ? <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="company" className="mb-2 block text-sm font-medium text-slate-300">
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
          <label htmlFor="service" className="mb-2 block text-sm font-medium text-slate-300">
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
          <label htmlFor="budget" className="mb-2 block text-sm font-medium text-slate-300">
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
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-300">
            Projeniz <span className="text-rose-400">*</span>
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
            <p id="message-error" className="mt-1.5 text-xs text-rose-400">{errors.message}</p>
          ) : null}
        </div>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-slate-400">
        <input
          type="checkbox"
          name="kvkk"
          checked={values.kvkk}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 rounded border-white/20 bg-ink-950 text-brand-500 focus:ring-brand-500"
        />
        <span>
          Verilerimin talebimi değerlendirmek amacıyla işlenmesini kabul ediyorum (KVKK).
          {errors.kvkk ? <span className="block text-xs text-rose-400">{errors.kvkk}</span> : null}
        </span>
      </label>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === 'loading'} size="lg">
          {status === 'loading' ? 'Gönderiliyor…' : 'Mesajı Gönder'}
          {status !== 'loading' ? <Icon name="arrow" className="h-4 w-4" /> : null}
        </Button>
        <p className="text-xs text-slate-500">Ortalama yanıt süremiz 1 iş günü.</p>
      </div>

      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={classNames(
            'mt-5 flex items-start gap-2 rounded-xl border p-4 text-sm',
            status === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-300',
          )}
        >
          <Icon name={status === 'success' ? 'check' : 'close'} className="mt-0.5 h-4 w-4 shrink-0" />
          {feedback}
        </p>
      ) : null}
    </form>
  )
}
