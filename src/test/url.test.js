import { describe, expect, it } from 'vitest'
import { safePath, safeUrl } from '../lib/url'

/**
 * Sosyal bağlantılar ve menü hedefleri veritabanından geliyor. React `href`
 * değerini kaçırır ama şemayı denetlemez; denetim burada.
 */
describe('safeUrl', () => {
  it('betik şemalarını engeller', () => {
    for (const value of [
      'javascript:alert(1)',
      'JaVaScRiPt:alert(1)',
      ' javascript:alert(1)',
      'java\tscript:alert(1)', // görünmez karakterle kaçırma
      'java script:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox',
    ]) {
      expect(safeUrl(value)).toBe('#')
    }
  })

  it('meşru adresleri olduğu gibi bırakır', () => {
    expect(safeUrl('https://instagram.com/decha')).toBe('https://instagram.com/decha')
    expect(safeUrl('mailto:a@b.co')).toBe('mailto:a@b.co')
    expect(safeUrl('tel:+902120000000')).toBe('tel:+902120000000')
    expect(safeUrl('/hizmetler')).toBe('/hizmetler')
    expect(safeUrl('#bolum')).toBe('#bolum')
  })

  it('şemasız alan adını https ile tamamlar', () => {
    expect(safeUrl('instagram.com/decha')).toBe('https://instagram.com/decha')
    expect(safeUrl('//evil.com')).toBe('https://evil.com')
  })

  it('boş değerde yedeğe döner', () => {
    expect(safeUrl('')).toBe('#')
    expect(safeUrl(null, '/')).toBe('/')
  })
})

describe('safePath', () => {
  it('yalnızca site içi yolu geçirir', () => {
    expect(safePath('/hizmetler')).toBe('/hizmetler')
    expect(safePath('/blog/yazi?x=1')).toBe('/blog/yazi?x=1')
  })

  it('dış adresi ve betiği reddeder', () => {
    // "//evil.com" tarayıcıda dış adrese gider; site içi yol değildir.
    expect(safePath('//evil.com')).toBe('/')
    // Ters eğik çizgi de eğik çizgi sayılır (React Router açık yönlendirme sınıfı).
    expect(safePath('/\\evil.com')).toBe('/')
    expect(safePath('\\\\evil.com')).toBe('/')
    expect(safePath('https://evil.com')).toBe('/')
    expect(safePath('javascript:alert(1)')).toBe('/')
    expect(safePath('hizmetler')).toBe('/')
    expect(safePath('')).toBe('/')
  })
})
