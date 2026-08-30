import { describe, expect, it, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'

// Supabase istemcisini mock'luyoruz; gerçek ağ çağrısı yapılmaz.
const state = { result: { data: null, error: null }, calls: [] }

vi.mock('../lib/supabase', () => {
  const builder = () => {
    const chain = {
      select: vi.fn(() => chain),
      eq: vi.fn((column, value) => {
        state.calls.push(['eq', column, value])
        return chain
      }),
      order: vi.fn((column, options) => {
        state.calls.push(['order', column, options])
        return chain
      }),
      limit: vi.fn((value) => {
        state.calls.push(['limit', value])
        return chain
      }),
      maybeSingle: vi.fn(() => {
        state.calls.push(['maybeSingle'])
        return Promise.resolve(state.result)
      }),
      then: (resolve, reject) => Promise.resolve(state.result).then(resolve, reject),
    }
    return chain
  }

  return {
    isSupabaseConfigured: true,
    supabase: {
      from: vi.fn((table) => {
        state.calls.push(['from', table])
        return builder()
      }),
    },
  }
})

const { useSupabaseData } = await import('../hooks/useSupabaseData')

const fallback = [{ id: 'yerel', title: 'Yerel kayıt' }]

beforeEach(() => {
  state.result = { data: null, error: null }
  state.calls = []
})

describe('useSupabaseData', () => {
  it('Supabase verisi dönerse onu kullanır', async () => {
    state.result = { data: [{ id: 'uzak', title: 'Uzak kayıt' }], error: null }

    const { result } = renderHook(() => useSupabaseData('projects', { fallback }))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('supabase')
    expect(result.current.data[0].title).toBe('Uzak kayıt')
  })

  it('sorgu hata verirse yerel içeriğe düşer', async () => {
    state.result = { data: null, error: new Error('relation does not exist') }

    const { result } = renderHook(() => useSupabaseData('projects', { fallback }))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('fallback')
    expect(result.current.data).toEqual(fallback)
  })

  it('boş sonuçta da yerel içeriğe düşer', async () => {
    state.result = { data: [], error: null }

    const { result } = renderHook(() => useSupabaseData('projects', { fallback }))

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('fallback')
    expect(result.current.data).toEqual(fallback)
  })

  it('fallbackOnEmpty false iken boş sonuç boş kalır', async () => {
    // Panelden yönetilen tablolarda kritik: son kayıt silindiğinde site demo
    // içeriğini geri getirmemeli, yoksa silme işlemi olmamış gibi görünür.
    state.result = { data: [], error: null }

    const { result } = renderHook(() =>
      useSupabaseData('projects', { fallback, fallbackOnEmpty: false }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('supabase')
    expect(result.current.data).toEqual([])
  })

  it('fallbackOnEmpty false olsa da hata durumunda yedeğe düşer', async () => {
    // Boş sonuç ile hata farklı şeyler: ağ/izin hatasında site yine de
    // içerikle açılmalı.
    state.result = { data: null, error: new Error('bağlantı yok') }

    const { result } = renderHook(() =>
      useSupabaseData('projects', { fallback, fallbackOnEmpty: false }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.source).toBe('fallback')
    expect(result.current.data).toEqual(fallback)
  })

  it('filtre, sıralama ve limit sorguya aktarılır', async () => {
    state.result = { data: [{ id: 'x' }], error: null }

    const { result } = renderHook(() =>
      useSupabaseData('projects', {
        fallback,
        filters: { featured: true, category: '' },
        order: { column: 'order_no', ascending: true },
        limit: 3,
      }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(state.calls).toContainEqual(['from', 'projects'])
    expect(state.calls).toContainEqual(['eq', 'featured', true])
    // boş değerli filtre sorguya eklenmemeli
    expect(state.calls.some(([fn, col]) => fn === 'eq' && col === 'category')).toBe(false)
    expect(state.calls).toContainEqual(['order', 'order_no', { ascending: true }])
    expect(state.calls).toContainEqual(['limit', 3])
  })

  it('single modunda tek kayıt döner, yoksa yerel kayda düşer', async () => {
    state.result = { data: null, error: null }

    const { result } = renderHook(() =>
      useSupabaseData('projects', { fallback, filters: { slug: 'yok' }, single: true }),
    )

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(state.calls).toContainEqual(['maybeSingle'])
    expect(result.current.data).toEqual(fallback[0])
  })
})
