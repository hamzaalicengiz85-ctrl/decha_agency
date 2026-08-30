import { describe, expect, it } from 'vitest'
import { RECORD_TYPES, emptyRecord, toPayload, validate } from '../components/admin/records'

describe('emptyRecord', () => {
  it('her alan için varsayılan üretir', () => {
    const row = emptyRecord('services')
    expect(row.is_active).toBe(true) // şemadaki varsayılan
    expect(row.features).toEqual([])
    expect(row.title).toBe('')
  })
})

describe('toPayload', () => {
  it('boş metni null yapar — sütunlar nullable', () => {
    const payload = toPayload('services', { ...emptyRecord('services'), title: 'Web', summary: '  ' })
    expect(payload.title).toBe('Web')
    expect(payload.summary).toBeNull()
  })

  it('sayı alanlarını gerçekten sayıya çevirir', () => {
    // Metin gönderilirse Postgres reddeder.
    const payload = toPayload('services', { ...emptyRecord('services'), price_from: '45000', order_no: '2' })
    expect(payload.price_from).toBe(45000)
    expect(payload.order_no).toBe(2)
  })

  it('boş sayı null olur, sıfıra dönmez', () => {
    const payload = toPayload('services', { ...emptyRecord('services'), price_from: '' })
    expect(payload.price_from).toBeNull()
  })

  it('listedeki boş satırları atar', () => {
    const payload = toPayload('services', {
      ...emptyRecord('services'),
      features: ['React', '   ', '', 'Supabase'],
    })
    expect(payload.features).toEqual(['React', 'Supabase'])
  })

  it('sonuç çiftlerinde tamamen boş olanı atar', () => {
    const payload = toPayload('projects', {
      ...emptyRecord('projects'),
      metrics: [{ label: 'Dönüşüm', value: '+38%' }, { label: '', value: '' }],
    })
    expect(payload.metrics).toEqual([{ label: 'Dönüşüm', value: '+38%' }])
  })

  it('anahtar alanlarını boolean yapar', () => {
    const payload = toPayload('projects', { ...emptyRecord('projects'), featured: undefined })
    expect(payload.featured).toBe(false)
  })
})

describe('validate', () => {
  it('zorunlu alanları yakalar', () => {
    const errors = validate('services', emptyRecord('services'))
    expect(errors.title).toBeTruthy()
    expect(errors.slug).toBeTruthy()
    expect(errors.summary).toBeUndefined()
  })

  it('dolu kayıtta hata vermez', () => {
    const errors = validate('testimonials', {
      ...emptyRecord('testimonials'),
      name: 'Elif Demir',
      quote: 'Harika iş çıkardılar.',
    })
    expect(errors).toEqual({})
  })

  it('puanı 1-5 aralığında tutar — tabloda CHECK kısıtı var', () => {
    const base = { ...emptyRecord('testimonials'), name: 'A', quote: 'B' }
    expect(validate('testimonials', { ...base, rating: 7 }).rating).toBeTruthy()
    expect(validate('testimonials', { ...base, rating: 0 }).rating).toBeTruthy()
    expect(validate('testimonials', { ...base, rating: 5 }).rating).toBeUndefined()
  })
})

describe('şema tutarlılığı', () => {
  it('simge seçenekleri Icon.jsx glif kümesiyle sınırlı', () => {
    const icon = RECORD_TYPES.services.fields.find((f) => f.name === 'icon')
    // Serbest metin bırakılsaydı bilinmeyen ad sessizce sparkles'a düşerdi.
    expect(icon.type).toBe('select')
    expect(icon.options).toContain('sparkles')
  })
})
