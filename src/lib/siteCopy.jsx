import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import { CACHE_KEY, SiteCopyContext, isEditMode, useCopy, useSiteCopy } from './siteCopyContext'

function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY)
    if (!raw) return { copy: {}, lists: {} }
    const parsed = JSON.parse(raw)
    return { copy: parsed.copy ?? {}, lists: parsed.lists ?? {} }
  } catch {
    return { copy: {}, lists: {} }
  }
}

function writeCache(store) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(store))
  } catch {
    // Depolama kapalıysa her açılışta yeniden çekilir; sorun değil.
  }
}

export function SiteCopyProvider({ children, edit = isEditMode() }) {
  // Önbellekten eşzamanlı doldur: tekrar ziyaretlerde metin bir an
  // varsayılana düşüp sonra değişmiş gibi görünmesin.
  const [store, setStore] = useState(readCache)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return

    let alive = true
    Promise.allSettled([
      supabase.from('site_copy').select('key,value'),
      supabase.from('site_lists').select('key,items'),
    ]).then(([copyResult, listResult]) => {
      if (!alive) return

      const copyRows = copyResult.status === 'fulfilled' ? copyResult.value.data : null
      const listRows = listResult.status === 'fulfilled' ? listResult.value.data : null
      // İki sorgu bağımsız: biri düşerse diğeri yine uygulanır. İkisi de
      // düştüyse önbellek/varsayılan olduğu gibi kalır.
      if (!Array.isArray(copyRows) && !Array.isArray(listRows)) return

      const next = { copy: {}, lists: {} }
      if (Array.isArray(copyRows)) for (const row of copyRows) next.copy[row.key] = row.value
      if (Array.isArray(listRows)) for (const row of listRows) next.lists[row.key] = row.items

      setStore(next)
      writeCache(next)
    })

    return () => {
      alive = false
    }
  }, [])

  // Düzenleme modunda panelden gelen anlık güncellemeler: kaydedince
  // önizleme sayfa yenilemeden tazelensin, kaydırma konumu kaybolmasın.
  useEffect(() => {
    if (!edit) return
    const onMessage = (event) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'decha:apply') return
      const { key, value, listKey, items } = event.data
      setStore((current) => ({
        copy: key ? { ...current.copy, [key]: value } : current.copy,
        lists: listKey ? { ...current.lists, [listKey]: items } : current.lists,
      }))
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [edit])

  const value = useMemo(() => ({ ...store, edit }), [store, edit])
  return <SiteCopyContext.Provider value={value}>{children}</SiteCopyContext.Provider>
}

/**
 * JSX içindeki metinler.
 *
 * Normal modda Fragment döner — üretim çıktısına fazladan tek bir düğüm bile
 * eklemez. Düzenleme modunda `data-copy-key` taşıyan bir kutuya sarar; köprü
 * `closest()` ile bu kutuyu bulur, böylece bağlantı ya da buton içindeki
 * metinler de doğru hedeflenir.
 *
 * `as` verilirse sarmalayıcı yerine o etiket çizilir: satır içi span'in
 * yerleşimi bozacağı yerlerde mevcut elemanın yerini alır.
 */
export function Copy({ k, children, as: Tag, className, ...rest }) {
  const { edit } = useSiteCopy()
  const fallback = typeof children === 'string' ? children : ''
  const value = useCopy(k, fallback)

  if (!edit) {
    return Tag ? (
      <Tag className={className} {...rest}>
        {value}
      </Tag>
    ) : (
      <>{value}</>
    )
  }

  const Wrapper = Tag ?? 'span'
  return (
    <Wrapper className={className} data-copy-key={k} {...rest}>
      {value}
    </Wrapper>
  )
}
