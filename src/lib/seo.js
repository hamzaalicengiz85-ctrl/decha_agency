import { useEffect } from 'react'
import { SITE_URL } from './siteUrl'

const SITE_NAME = 'Decha Agency'
const DEFAULT_DESCRIPTION =
  'Decha Agency; markalar için web tasarımı, yazılım geliştirme, dijital pazarlama ve marka kimliği çözümleri üretir.'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`

const JSONLD_ID = 'decha-page-schema'

function upsertMeta(attr, key, value) {
  const selector = `meta[${attr}="${key}"]`
  let el = document.head.querySelector(selector)

  // Değer boşsa etiketi bırakmak yanlış bilgi yayar: önceki sayfanın
  // açıklaması yeni sayfada asılı kalırdı.
  if (!value) {
    if (el?.dataset.dechaSeo) el.remove()
    return
  }

  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    el.dataset.dechaSeo = '1'
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Sayfaya özel yapısal veri; her gezinmede tek bir etiket yenilenir. */
function upsertJsonLd(schema) {
  const existing = document.getElementById(JSONLD_ID)
  if (!schema) return existing?.remove()

  const el = existing ?? document.createElement('script')
  el.id = JSONLD_ID
  el.type = 'application/ld+json'
  el.textContent = JSON.stringify(schema)
  if (!existing) document.head.appendChild(el)
}

/**
 * Kırıntı yolu şeması. Arama sonucunda sayfanın site içindeki yeri görünür.
 * `trail`: [{ name, path }] — ana sayfa otomatik eklenir.
 */
export function breadcrumb(trail = []) {
  const items = [{ name: 'Ana Sayfa', path: '/' }, ...trail]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/**
 * Sayfa başlığı, meta etiketleri, canonical ve yapısal veri (react-helmet'e
 * gerek kalmadan).
 *
 * `noindex` yönetim paneli ve 404 gibi dizine girmemesi gereken sayfalar için.
 * `schema` sayfaya özel JSON-LD; verilmezse index.html'deki kurum künyesi
 * tek başına kalır.
 */
export function usePageMeta({ title, description, image, noindex = false, schema } = {}) {
  // Nesne her render'da yeniden kurulduğu için bağımlılık olarak string'e
  // çevrilir; aksi hâlde effect sonsuz döngüye girerdi.
  const schemaKey = schema ? JSON.stringify(schema) : ''

  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} — Dijital Tasarım & Yazılım Ajansı`
    const text = description || DEFAULT_DESCRIPTION
    const cover = image || DEFAULT_IMAGE
    const url = SITE_URL + window.location.pathname

    document.title = fullTitle

    upsertMeta('name', 'description', text)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', text)
    upsertMeta('property', 'og:image', cover)
    upsertMeta('property', 'og:url', url)

    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', text)
    upsertMeta('name', 'twitter:image', cover)

    // Dizine girmeyen sayfa için canonical anlamsız: 404'te var olmayan bir
    // adresi "asıl sürüm" diye işaretlerdi.
    if (noindex) {
      document.head.querySelector('link[rel="canonical"]')?.remove()
    } else {
      upsertLink('canonical', url)
    }
    upsertJsonLd(schemaKey ? JSON.parse(schemaKey) : null)
  }, [title, description, image, noindex, schemaKey])
}

/** Blog yazısı şeması. */
export function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    inLanguage: 'tr-TR',
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@id': `${SITE_URL}/#kurum` },
    image: DEFAULT_IMAGE,
  }
}

/** Proje dosyası şeması. */
export function projectSchema(project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary ?? undefined,
    genre: project.category ?? undefined,
    dateCreated: project.year ? String(project.year) : undefined,
    inLanguage: 'tr-TR',
    url: `${SITE_URL}/projeler/${project.slug}`,
    creator: { '@id': `${SITE_URL}/#kurum` },
    image: DEFAULT_IMAGE,
  }
}
