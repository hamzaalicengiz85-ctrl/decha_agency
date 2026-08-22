import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Bir Supabase tablosundan veri çeker.
 * Supabase yapılandırılmamışsa veya sorgu başarısız olursa `fallback` döner;
 * böylece site her koşulda içerikle açılır.
 *
 * @param {string} table       Tablo adı
 * @param {object} options
 * @param {any[]}  options.fallback      Yedek veri
 * @param {string} options.select        Seçilecek kolonlar
 * @param {object} options.order         { column, ascending }
 * @param {object} options.filters       { column: value } eşitlik filtreleri
 * @param {number} options.limit         Kayıt limiti
 * @param {boolean} options.single       Tek kayıt döndür
 */
export function useSupabaseData(table, options = {}) {
  const {
    fallback = [],
    select = '*',
    order,
    filters,
    limit,
    single = false,
    enabled = true,
  } = options

  const [data, setData] = useState(single ? null : fallback)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)
  const [source, setSource] = useState('fallback')

  // Nesne referansları her render'da değiştiği için serileştirip bağımlılık yapıyoruz.
  const filtersKey = JSON.stringify(filters ?? null)
  const orderKey = JSON.stringify(order ?? null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const run = useCallback(async () => {
    if (!enabled) return

    const localFallback = single ? (fallback?.[0] ?? null) : fallback

    if (!isSupabaseConfigured || !supabase) {
      if (mounted.current) {
        setData(localFallback)
        setSource('fallback')
        setLoading(false)
      }
      return
    }

    setLoading(true)
    try {
      let query = supabase.from(table).select(select)

      const parsedFilters = JSON.parse(filtersKey)
      if (parsedFilters) {
        for (const [column, value] of Object.entries(parsedFilters)) {
          if (value === undefined || value === null || value === '') continue
          query = query.eq(column, value)
        }
      }

      const parsedOrder = JSON.parse(orderKey)
      if (parsedOrder?.column) {
        query = query.order(parsedOrder.column, {
          ascending: parsedOrder.ascending !== false,
        })
      }

      if (limit) query = query.limit(limit)
      if (single) query = query.maybeSingle()

      const { data: result, error: queryError } = await query
      if (queryError) throw queryError

      const isEmpty = single ? !result : !Array.isArray(result) || result.length === 0

      if (mounted.current) {
        setData(isEmpty ? localFallback : result)
        setSource(isEmpty ? 'fallback' : 'supabase')
        setError(null)
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.warn(`[Supabase] "${table}" sorgusu başarısız, yerel içerik kullanılıyor:`, err.message)
      }
      if (mounted.current) {
        setData(localFallback)
        setSource('fallback')
        setError(err)
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
    // fallback bilinçli olarak bağımlılıkta değil: her render'da yeni referans üretebilir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select, filtersKey, orderKey, limit, single, enabled])

  useEffect(() => {
    run()
  }, [run])

  return { data, loading, error, source, refetch: run }
}
