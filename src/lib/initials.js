/**
 * Görsel kullanılmayan yerlerde kimlik göstergesi olarak baş harfler üretir.
 * Türkçe karakterler ASCII karşılığına çevrilir (İ → I, Ş → S ...).
 */
const MAP = { Ç: 'C', Ğ: 'G', I: 'I', İ: 'I', Ö: 'O', Ş: 'S', Ü: 'U' }

export function initials(name = '', max = 2) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, max)
    .map((word) => {
      const char = word.charAt(0).toLocaleUpperCase('tr-TR')
      return MAP[char] ?? char
    })
    .join('')
}

/** Dosya kodu: "nova-finance" + 2025 → "25-NOVA" */
export function fileCode(slug = '', year) {
  const suffix = String(slug).replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase()
  const prefix = year ? String(year).slice(-2) : '00'
  return `${prefix}-${suffix}`
}
