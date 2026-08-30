import { useEffect } from 'react'

/**
 * Önizleme iframe'inin içinde çalışır (yalnızca ?edit=1 ile yüklenir, genel
 * ziyaretçi bu kodu hiç indirmez).
 *
 * Üç iş yapar:
 *  1. Sitenin kendi tıklama/gönderme davranışını bastırır.
 *  2. Tıklanan öğeyi bir içerik anahtarına ya da kayda çözer, panele bildirir.
 *  3. Sayfadaki düzenlenebilir her şeyin envanterini çıkarır — görsel olarak
 *     tıklanması zor metinler (açılır menü içi, hata durumları) panelde
 *     listeden düzenlenebilsin diye.
 */

const TARGET = '[data-copy-key],[data-list-key],[data-rec-field]'

function post(message) {
  window.parent?.postMessage({ ...message, source: 'decha-edit' }, window.location.origin)
}

function inventory() {
  const items = []
  for (const el of document.querySelectorAll(TARGET)) {
    items.push({
      copyKey: el.dataset.copyKey ?? null,
      listKey: el.dataset.listKey ?? null,
      listIndex: el.dataset.listIndex ?? null,
      listField: el.dataset.listField ?? null,
      recField: el.dataset.recField ?? null,
      rec: el.closest('[data-rec]')?.dataset.rec ?? null,
      text: (el.textContent ?? '').trim().slice(0, 120),
    })
  }
  post({ type: 'decha:inventory', items })
}

export default function EditBridge() {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.edit = '1'

    // React dinleyicilerini #root'a bağlar; document üzerindeki yakalama
    // fazı onlardan önce çalışır. stopPropagation burada hem React
    // onClick'lerini hem <Link> gezinmesini kesiyor — tek mekanizma bu.
    const onClick = (event) => {
      const el = event.target.closest?.(TARGET)
      event.preventDefault()
      event.stopPropagation()
      if (!el) return

      const rect = el.getBoundingClientRect()
      post({
        type: 'decha:pick',
        copyKey: el.dataset.copyKey ?? null,
        listKey: el.dataset.listKey ?? null,
        listIndex: el.dataset.listIndex ?? null,
        listField: el.dataset.listField ?? null,
        recField: el.dataset.recField ?? null,
        rec: el.closest('[data-rec]')?.dataset.rec ?? null,
        text: (el.textContent ?? '').trim(),
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      })
    }

    const swallow = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', swallow, true)

    // SSS akordeonları: preventDefault yerel açma davranışını da iptal eder,
    // cevaplar erişilemez kalırdı. Hepsini açık tutuyoruz — düzenlerken
    // zaten hepsini görmek isteniyor.
    const openDetails = () => {
      for (const details of document.querySelectorAll('details')) details.open = true
    }
    openDetails()

    // React her render'da DOM'a dokunuyor; envanteri her seferinde
    // göndermek panele saniyede onlarca mesaj atardı.
    let timer = null
    const observer = new MutationObserver(() => {
      openDetails()
      clearTimeout(timer)
      timer = setTimeout(inventory, 300)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    inventory()
    post({ type: 'decha:ready', path: window.location.pathname })

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', swallow, true)
      observer.disconnect()
      clearTimeout(timer)
      delete root.dataset.edit
    }
  }, [])

  return null
}
