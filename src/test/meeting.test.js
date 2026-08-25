import { describe, expect, it } from 'vitest'
import {
  MEETING_LOCATIONS,
  TIME_SLOTS,
  checkDate,
  holidayName,
  isWeekend,
  meetingLocationLabel,
} from '../data/meeting'

describe('toplantı yeri seçenekleri', () => {
  it('üç seçenek ve güncel etiketler', () => {
    expect(MEETING_LOCATIONS.map((o) => o.value)).toEqual(['online', 'client_site', 'our_office'])
    expect(MEETING_LOCATIONS.map((o) => o.label)).toEqual(['Online', 'Kendi yerim', 'Decha Ofis'])
  })

  it('anahtarı etikete çevirir', () => {
    expect(meetingLocationLabel('our_office')).toBe('Decha Ofis')
    expect(meetingLocationLabel('client_site')).toBe('Kendi yerim')
  })
})

describe('saat aralıkları', () => {
  it('yalnızca tam saatler, 09:00–17:00 arası', () => {
    expect(TIME_SLOTS).toEqual([
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    ])
  })

  it('hepsi tam saat', () => {
    expect(TIME_SLOTS.every((slot) => slot.endsWith(':00'))).toBe(true)
  })
})

describe('hafta sonu', () => {
  it('cumartesi ve pazarı yakalar', () => {
    expect(isWeekend('2026-09-12')).toBe(true) // Cumartesi
    expect(isWeekend('2026-09-13')).toBe(true) // Pazar
  })

  it('hafta içi günleri geçirir', () => {
    expect(isWeekend('2026-09-14')).toBe(false) // Pazartesi
    expect(isWeekend('2026-09-18')).toBe(false) // Cuma
  })
})

describe('resmî tatiller', () => {
  it('sabit tarihli tatilleri tanır', () => {
    expect(holidayName('2026-01-01')).toBe('Yılbaşı')
    expect(holidayName('2026-04-23')).toContain('Çocuk Bayramı')
    expect(holidayName('2026-10-29')).toBe('Cumhuriyet Bayramı')
    expect(holidayName('2027-08-30')).toBe('Zafer Bayramı')
  })

  it('dinî bayram aralıklarını kapsar (uçlar dahil)', () => {
    expect(holidayName('2026-05-26')).toBe('Kurban Bayramı')
    expect(holidayName('2026-05-28')).toBe('Kurban Bayramı')
    expect(holidayName('2026-05-29')).toBe('Kurban Bayramı')
    expect(holidayName('2026-05-30')).toBeNull()
  })

  it('normal günde null döner', () => {
    expect(holidayName('2026-09-15')).toBeNull()
  })
})

describe('checkDate', () => {
  it('hafta içi normal günü açar', () => {
    expect(checkDate('2026-09-15')).toEqual({ open: true })
  })

  it('hafta sonunu sebebiyle kapatır', () => {
    const result = checkDate('2026-09-12')
    expect(result.open).toBe(false)
    expect(result.reason).toMatch(/hafta sonu/i)
  })

  it('tatili adıyla kapatır', () => {
    const result = checkDate('2026-10-29')
    expect(result.open).toBe(false)
    expect(result.reason).toMatch(/Cumhuriyet Bayramı/)
  })

  it('boş tarihi kapatır', () => {
    expect(checkDate('').open).toBe(false)
  })
})
