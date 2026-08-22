import { describe, expect, it } from 'vitest'
import { classNames, formatDate, slugify } from '../lib/format'

describe('slugify', () => {
  it('Türkçe karakterleri dönüştürür', () => {
    expect(slugify('Ürün Stratejisi')).toBe('urun-stratejisi')
    expect(slugify('Çığır Açan İşler')).toBe('cigir-acan-isler')
  })

  it('boşluk ve noktalama temizler', () => {
    expect(slugify('  Merhaba,  Dünya!  ')).toBe('merhaba-dunya')
  })
})

describe('formatDate', () => {
  it('geçerli tarihi biçimlendirir', () => {
    expect(formatDate('2026-05-14')).toContain('2026')
  })

  it('geçersiz değerde boş string döner', () => {
    expect(formatDate('')).toBe('')
    expect(formatDate('abc')).toBe('')
  })
})

describe('classNames', () => {
  it('boş değerleri atar', () => {
    expect(classNames('a', false, null, undefined, 'b')).toBe('a b')
  })
})
