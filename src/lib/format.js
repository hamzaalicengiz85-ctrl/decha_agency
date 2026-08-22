export function formatDate(value, locale = 'tr-TR') {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const TURKISH_MAP = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', I: 'i', İ: 'i', i: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
}

export function slugify(text = '') {
  return text
    .toString()
    // Türkçe karakterleri küçültmeden önce ASCII karşılığına çeviriyoruz;
    // aksi halde "İ".toLowerCase() birleşik nokta üretip karakteri kaybettiriyor.
    .replace(/[çÇğĞıIİiöÖşŞüÜ]/g, (char) => TURKISH_MAP[char] ?? char)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function classNames(...values) {
  return values.filter(Boolean).join(' ')
}
