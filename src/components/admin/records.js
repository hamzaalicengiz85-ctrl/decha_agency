/**
 * Yönetim panelindeki kayıt türleri. Form alanları buradan türetilir; her
 * tablo için ayrı bileşen yazmak yerine tek bir form üreteci kullanılır.
 *
 * Alan tipleri: text · textarea · number · date · select · switch · list
 * (düz metin dizisi) · pairs ({label, value} dizisi).
 */

// Icon.jsx'teki glif kümesi. Serbest metin bırakılırsa bilinmeyen ad sessizce
// "sparkles"a düşer ve sebebi anlaşılmaz bir hataya dönüşür.
export const ICON_NAMES = [
  'layout', 'sparkles', 'trending', 'phone', 'compass', 'shield', 'arrow',
  'check', 'mail', 'pin', 'clock', 'star', 'menu', 'close', 'plus',
]

export const RECORD_TYPES = {
  services: {
    label: 'Hizmetler',
    singular: 'Hizmet',
    order: { column: 'order_no', ascending: true },
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true },
      { name: 'slug', label: 'Adres eki (slug)', type: 'text', required: true, slugFrom: 'title' },
      { name: 'summary', label: 'Özet', type: 'textarea', rows: 3 },
      { name: 'icon', label: 'Simge', type: 'select', options: ICON_NAMES },
      { name: 'features', label: 'Maddeler', type: 'list' },
      { name: 'price_from', label: 'Başlangıç fiyatı (TL)', type: 'number' },
      { name: 'order_no', label: 'Sıra', type: 'number' },
      { name: 'is_active', label: 'Yayında', type: 'switch', default: true },
    ],
  },

  projects: {
    label: 'Projeler',
    singular: 'Proje',
    order: { column: 'order_no', ascending: true },
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true },
      { name: 'slug', label: 'Adres eki (slug)', type: 'text', required: true, slugFrom: 'title' },
      { name: 'client', label: 'Müşteri', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text' },
      { name: 'year', label: 'Yıl', type: 'number' },
      { name: 'summary', label: 'Özet', type: 'textarea', rows: 3 },
      { name: 'description', label: 'Açıklama', type: 'textarea', rows: 8, hint: 'Boş satır yeni paragraf açar.' },
      { name: 'tags', label: 'Etiketler', type: 'list' },
      { name: 'metrics', label: 'Sonuçlar', type: 'pairs' },
      { name: 'featured', label: 'Ana sayfada göster', type: 'switch' },
      { name: 'order_no', label: 'Sıra', type: 'number' },
    ],
  },

  posts: {
    label: 'Blog yazıları',
    singular: 'Yazı',
    order: { column: 'published_at', ascending: false },
    titleField: 'title',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true },
      { name: 'slug', label: 'Adres eki (slug)', type: 'text', required: true, slugFrom: 'title' },
      { name: 'excerpt', label: 'Özet', type: 'textarea', rows: 3 },
      { name: 'content', label: 'İçerik', type: 'textarea', rows: 12, hint: 'Boş satır yeni paragraf açar.' },
      { name: 'category', label: 'Kategori', type: 'text' },
      { name: 'author', label: 'Yazar', type: 'text', default: 'Decha Ekibi' },
      {
        name: 'published_at',
        label: 'Yayın tarihi',
        type: 'date',
        hint: 'İleri bir tarih verilirse yazı o güne kadar sitede görünmez.',
      },
    ],
  },

  testimonials: {
    label: 'Referanslar',
    singular: 'Referans',
    order: { column: 'order_no', ascending: true },
    titleField: 'name',
    fields: [
      { name: 'name', label: 'Ad soyad', type: 'text', required: true },
      { name: 'role', label: 'Unvan', type: 'text' },
      { name: 'company', label: 'Şirket', type: 'text' },
      { name: 'quote', label: 'Yorum', type: 'textarea', rows: 5, required: true },
      { name: 'rating', label: 'Puan (1-5)', type: 'number', min: 1, max: 5, default: 5 },
      { name: 'order_no', label: 'Sıra', type: 'number' },
    ],
  },
}

/** Yeni kayıt için varsayılan değerler. */
export function emptyRecord(typeKey) {
  const type = RECORD_TYPES[typeKey]
  const row = {}
  for (const field of type.fields) {
    if (field.default !== undefined) row[field.name] = field.default
    else if (field.type === 'switch') row[field.name] = false
    else if (field.type === 'list' || field.type === 'pairs') row[field.name] = []
    else row[field.name] = ''
  }
  return row
}

/**
 * Form değerlerini veritabanı satırına çevirir.
 * Boş metin null olur (sütunlar nullable); sayı alanları gerçekten sayıya
 * çevrilir, aksi hâlde Postgres metin gönderimini reddeder.
 */
export function toPayload(typeKey, values) {
  const type = RECORD_TYPES[typeKey]
  const payload = {}

  for (const field of type.fields) {
    const raw = values[field.name]

    if (field.type === 'number') {
      const text = String(raw ?? '').trim()
      payload[field.name] = text === '' ? null : Number(text)
    } else if (field.type === 'switch') {
      payload[field.name] = Boolean(raw)
    } else if (field.type === 'list') {
      payload[field.name] = (Array.isArray(raw) ? raw : [])
        .map((item) => String(item).trim())
        .filter(Boolean)
    } else if (field.type === 'pairs') {
      payload[field.name] = (Array.isArray(raw) ? raw : [])
        .map((item) => ({ label: String(item.label ?? '').trim(), value: String(item.value ?? '').trim() }))
        .filter((item) => item.label || item.value)
    } else {
      const text = String(raw ?? '').trim()
      payload[field.name] = text === '' ? null : text
    }
  }

  return payload
}

/** Kaydetmeden önce zorunlu alan kontrolü. */
export function validate(typeKey, values) {
  const errors = {}
  for (const field of RECORD_TYPES[typeKey].fields) {
    if (!field.required) continue
    const raw = values[field.name]
    const empty = Array.isArray(raw) ? raw.length === 0 : String(raw ?? '').trim() === ''
    if (empty) errors[field.name] = 'Bu alan zorunlu.'
  }

  const rating = values.rating
  if (rating !== undefined && rating !== '' && (Number(rating) < 1 || Number(rating) > 5)) {
    errors.rating = 'Puan 1 ile 5 arasında olmalı.'
  }
  return errors
}
