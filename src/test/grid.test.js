import { describe, expect, it } from 'vitest'
import { cardGrid } from '../lib/grid'

/**
 * Üç sütunlu ızgarada iki kart kalınca sağda kart genişliğinde boşluk
 * kalıyordu (ana sayfadaki referans bölümü).
 */
describe('cardGrid', () => {
  it('kayıt sayısı sütunu doldurunca tam ızgara verir', () => {
    expect(cardGrid(3)).toBe('sm:grid-cols-2 lg:grid-cols-3')
    expect(cardGrid(9)).toBe('sm:grid-cols-2 lg:grid-cols-3')
    expect(cardGrid(4, 4)).toBe('sm:grid-cols-2 lg:grid-cols-4')
  })

  it('eksik kalan satırı daraltır', () => {
    expect(cardGrid(2)).toBe('sm:grid-cols-2 max-w-3xl')
    expect(cardGrid(1)).toBe('max-w-md')
    expect(cardGrid(3, 4)).toBe('sm:grid-cols-2 lg:grid-cols-3 max-w-5xl')
  })

  it('ortalamaz: bölüm başlığıyla aynı sol eksende kalır', () => {
    expect(cardGrid(2)).not.toMatch(/mx-auto/)
  })

  it('sayı bilinmiyorken tam ızgaraya döner', () => {
    expect(cardGrid(0)).toBe('sm:grid-cols-2 lg:grid-cols-3')
    expect(cardGrid(undefined)).toBe('sm:grid-cols-2 lg:grid-cols-3')
  })
})
