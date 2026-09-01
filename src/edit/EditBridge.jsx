import { useEffect } from 'react'

/**
 * Önizleme iframe'inin içinde çalışır (yalnızca ?edit=1 ile yüklenir, genel
 * ziyaretçi bu kodu hiç indirmez).
 *
 * Üç iş yapar:
 *  1. Sitenin kendi tıklama/gönderme davranışını bastırır.
 *  2. Tıklanan öğeyi bir içerik anahtarına ya da kayda çözer, panele bildirir.
 *  3. Sayfanın içerik ağacını çıkarır: bölüm → metinler / listeler / kayıtlar.
 *     Panel bu ağacı iç içe pencereler hâlinde gösterir, böylece görselde
 *     tıklaması zor olan her şey de listeden düzenlenebilir.
 */

const TARGET = '[data-copy-key],[data-list-key],[data-rec-field]'
const NODE = '[data-copy-key],[data-list-key],[data-rec]'

function post(message) {
  window.parent?.postMessage({ ...message, source: 'decha-edit' }, window.location.origin)
}

function textOf(el) {
  return (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 120)
}

/**
 * Bölüm dışında kalan metinler (menü, alt bilgi) da bir pencereye düşmeli;
 * yoksa panelde hiç görünmezler.
 */
function hostOf(el) {
  const section = el.closest('[data-section]')
  if (section) {
    return {
      key: section.dataset.section,
      id: section.dataset.section,
      label: section.dataset.sectionLabel || section.dataset.section,
      hidden: section.dataset.sectionHidden === '1',
    }
  }
  if (el.closest('header')) return { key: '@header', id: null, label: 'Üst menü', hidden: false }
  if (el.closest('footer')) return { key: '@footer', id: null, label: 'Alt bilgi', hidden: false }
  return { key: '@other', id: null, label: 'Diğer', hidden: false }
}

function outline() {
  const sections = []
  const byKey = new Map()
  const seenCopy = new Set()

  const bucket = (el) => {
    const host = hostOf(el)
    let entry = byKey.get(host.key)
    if (!entry) {
      entry = { ...host, texts: [], lists: [], records: [] }
      byKey.set(host.key, entry)
      sections.push(entry)
    }
    return entry
  }

  for (const el of document.querySelectorAll(NODE)) {
    const entry = bucket(el)

    if (el.dataset.rec) {
      if (entry.records.some((item) => item.rec === el.dataset.rec)) continue
      const fields = [...el.querySelectorAll('[data-rec-field]')].map((node) => ({
        rec: el.dataset.rec,
        recField: node.dataset.recField,
        text: textOf(node),
      }))
      entry.records.push({
        rec: el.dataset.rec,
        label: el.dataset.recLabel || textOf(el.querySelector('h1,h2,h3,h4')) || 'Kayıt',
        fields,
      })
      continue
    }

    if (el.dataset.listKey) {
      const key = el.dataset.listKey
      let group = entry.lists.find((item) => item.key === key)
      if (!group) {
        group = { key, items: [] }
        entry.lists.push(group)
      }
      const index = el.dataset.listIndex ?? '0'
      let item = group.items.find((child) => child.index === index)
      if (!item) {
        item = { index, fields: [] }
        group.items.push(item)
      }
      item.fields.push({
        listKey: key,
        listIndex: index,
        listField: el.dataset.listField ?? null,
        text: textOf(el),
      })
      continue
    }

    const copyKey = el.dataset.copyKey
    // Aynı anahtar sayfada birden çok kez çizilebilir (kart rozetleri);
    // ağaçta bir kez görünsün.
    if (!copyKey || seenCopy.has(copyKey)) continue
    seenCopy.add(copyKey)
    entry.texts.push({ copyKey, text: textOf(el) })
  }

  // Görünürlüğü kapatılan bölüm hiç içerik üretmeyebilir; yine de pencere
  // olarak listelenmeli ki tekrar açılabilsin.
  for (const el of document.querySelectorAll('[data-section]')) {
    const key = el.dataset.section
    if (byKey.has(key)) continue
    const entry = {
      key,
      id: key,
      label: el.dataset.sectionLabel || key,
      hidden: el.dataset.sectionHidden === '1',
      texts: [],
      lists: [],
      records: [],
    }
    byKey.set(key, entry)
    sections.push(entry)
  }

  post({ type: 'decha:outline', path: window.location.pathname, sections })
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

      if (!el) {
        // Kayıt kartının boş bir yerine tıklamak da kaydı açsın.
        const card = event.target.closest?.('[data-rec]')
        if (card?.dataset.rec) post({ type: 'decha:pick', rec: card.dataset.rec, text: '' })
        return
      }

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

    // React her render'da DOM'a dokunuyor; ağacı her seferinde göndermek
    // panele saniyede onlarca mesaj atardı.
    let timer = null
    const observer = new MutationObserver(() => {
      openDetails()
      clearTimeout(timer)
      timer = setTimeout(outline, 300)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    outline()
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
