import { describe, expect, it } from 'vitest'
import { renderHook } from '@testing-library/react'
import { breadcrumb, usePageMeta } from '../lib/seo'

/**
 * Meta etiketleri gezinme arasında taşınıyor: bir sayfanın açıklaması
 * diğerinde asılı kalırsa arama sonuçları yanlış olur.
 */
describe('usePageMeta', () => {
  it('başlık, açıklama, og ve canonical yazar', () => {
    renderHook(() => usePageMeta({ title: 'Hizmetler', description: 'Açıklama' }))

    expect(document.title).toBe('Hizmetler | Decha Agency')
    expect(document.querySelector('meta[name="description"]')?.content).toBe('Açıklama')
    expect(document.querySelector('meta[property="og:title"]')?.content).toBe(
      'Hizmetler | Decha Agency',
    )
    expect(document.querySelector('meta[name="twitter:image"]')?.content).toMatch(/og-image\.png$/)
    expect(document.querySelector('link[rel="canonical"]')?.href).toMatch(/\/$/)
    expect(document.querySelector('meta[name="robots"]')?.content).toBe('index, follow')
  })

  it('noindex sayfada canonical bırakmaz', () => {
    renderHook(() => usePageMeta({ title: '404', noindex: true }))

    expect(document.querySelector('meta[name="robots"]')?.content).toBe('noindex, nofollow')
    // Var olmayan bir adresi "asıl sürüm" diye işaretlemek yanlış olurdu.
    expect(document.querySelector('link[rel="canonical"]')).toBeNull()
  })

  it('yapısal veriyi tek etikette tutar', () => {
    const { rerender } = renderHook(({ schema }) => usePageMeta({ title: 'A', schema }), {
      initialProps: { schema: breadcrumb([{ name: 'Blog', path: '/blog' }]) },
    })
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(1)

    rerender({ schema: breadcrumb([{ name: 'İletişim', path: '/iletisim' }]) })
    const tags = document.querySelectorAll('script[type="application/ld+json"]')
    expect(tags).toHaveLength(1)
    expect(JSON.parse(tags[0].textContent).itemListElement[1].name).toBe('İletişim')
  })
})

describe('breadcrumb', () => {
  it('ana sayfayı başa ekler ve sırayı numaralar', () => {
    const schema = breadcrumb([{ name: 'Blog', path: '/blog' }])
    expect(schema.itemListElement.map((item) => item.name)).toEqual(['Ana Sayfa', 'Blog'])
    expect(schema.itemListElement[1].position).toBe(2)
    expect(schema.itemListElement[1].item).toMatch(/\/blog$/)
  })
})
