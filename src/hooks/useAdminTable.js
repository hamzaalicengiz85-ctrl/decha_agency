import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Yönetim paneli için tablo okuma.
 *
 * `useSupabaseData`'dan bilerek ayrı: o hook boş sonucu ve hatayı yerel demo
 * içeriğine çevirir, çünkü genel site her koşulda dolu görünmeli. Panel için
 * bu yanlış olur — olmayan kaydı varmış gibi göstermek, düzenlemenin üstüne
 * yazıp veri kaybettirir. Burada boş boştur, hata hatadır.
 */
export function useAdminTable(table, { order, enabled = true } = {}) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)
  const mounted = useRef(true)

  const orderKey = JSON.stringify(order ?? null)

  const load = useCallback(async () => {
    if (!enabled) return
    if (!isSupabaseConfigured || !supabase) {
      if (mounted.current) {
        setRows([])
        setError('Supabase bağlantısı yapılandırılmamış.')
        setLoading(false)
      }
      return
    }

    setLoading(true)
    try {
      let query = supabase.from(table).select('*')
      const parsed = JSON.parse(orderKey)
      if (parsed) query = query.order(parsed.column, { ascending: parsed.ascending !== false })

      const { data, error: queryError } = await query
      if (queryError) throw queryError

      if (mounted.current) {
        setRows(Array.isArray(data) ? data : [])
        setError(null)
      }
    } catch (err) {
      if (mounted.current) {
        setRows([])
        setError(err.message || 'Kayıtlar okunamadı.')
      }
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [table, orderKey, enabled])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  return { rows, loading, error, reload: load }
}
