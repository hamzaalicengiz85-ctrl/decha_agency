/**
 * Toplantı planlama kuralları.
 *
 * Buradaki `value` anahtarları veritabanındaki CHECK kısıtlarıyla birebir
 * aynı olmalıdır. Görünen Türkçe etiketler değişse bile eski kayıtlar
 * bozulmasın diye veritabanına etiket değil anahtar yazılır.
 */
export const MEETING_LOCATIONS = [
  { value: 'online', label: 'Online' },
  { value: 'client_site', label: 'Kendi yerim' },
  { value: 'our_office', label: 'Decha Ofis' },
]

export function meetingLocationLabel(value) {
  return MEETING_LOCATIONS.find((option) => option.value === value)?.label ?? value
}

/**
 * Çalışma saatleri: hafta içi 09:00 – 18:00.
 * Randevular tam saat başlar; son randevu 17:00'de başlayıp 18:00'de biter.
 */
export const WORK_START_HOUR = 9
export const WORK_END_HOUR = 18

/** ["09:00", "10:00", … "17:00"] */
export const TIME_SLOTS = Array.from(
  { length: WORK_END_HOUR - WORK_START_HOUR },
  (_, index) => `${String(WORK_START_HOUR + index).padStart(2, '0')}:00`,
)

/**
 * Sabit tarihli resmî tatiller (her yıl aynı gün).
 * 28 Ekim yarım gün olduğu için kapalı sayılmaz.
 */
const FIXED_HOLIDAYS = [
  { month: 1, day: 1, name: 'Yılbaşı' },
  { month: 4, day: 23, name: 'Ulusal Egemenlik ve Çocuk Bayramı' },
  { month: 5, day: 1, name: 'Emek ve Dayanışma Günü' },
  { month: 5, day: 19, name: 'Atatürk’ü Anma, Gençlik ve Spor Bayramı' },
  { month: 7, day: 15, name: 'Demokrasi ve Millî Birlik Günü' },
  { month: 8, day: 30, name: 'Zafer Bayramı' },
  { month: 10, day: 29, name: 'Cumhuriyet Bayramı' },
]

/**
 * Dinî bayramlar ay takvimine göre kaydığı için hesaplanamaz; yıl yıl
 * girilmesi gerekir. Aralıklar [başlangıç, bitiş] ve her iki uç dahildir.
 *
 * ⚠ Bu tarihler her yıl Diyanet'in resmî takvimiyle doğrulanmalıdır.
 * Yeni yıl eklendiğinde buraya bir satır yazmak yeterlidir.
 */
const RELIGIOUS_HOLIDAYS = [
  { from: '2026-03-19', to: '2026-03-21', name: 'Ramazan Bayramı' },
  { from: '2026-05-26', to: '2026-05-29', name: 'Kurban Bayramı' },
  { from: '2027-03-09', to: '2027-03-11', name: 'Ramazan Bayramı' },
  { from: '2027-05-16', to: '2027-05-19', name: 'Kurban Bayramı' },
]

/** "2026-09-15" → { year, month, day } (saat dilimi kaymasına karşı elle ayrıştırılır) */
function parts(isoDate) {
  const [year, month, day] = String(isoDate).split('-').map(Number)
  return { year, month, day }
}

/** Hafta sonu mu? (Cumartesi / Pazar) */
export function isWeekend(isoDate) {
  const { year, month, day } = parts(isoDate)
  const weekday = new Date(year, month - 1, day).getDay()
  return weekday === 0 || weekday === 6
}

/** Resmî tatilse tatil adını, değilse null döner. */
export function holidayName(isoDate) {
  const { month, day } = parts(isoDate)

  const fixed = FIXED_HOLIDAYS.find((item) => item.month === month && item.day === day)
  if (fixed) return fixed.name

  const religious = RELIGIOUS_HOLIDAYS.find((item) => isoDate >= item.from && isoDate <= item.to)
  return religious ? religious.name : null
}

/**
 * Tarih randevuya açık mı? Kapalıysa sebebini döner.
 * @returns {{ open: true } | { open: false, reason: string }}
 */
export function checkDate(isoDate) {
  if (!isoDate) return { open: false, reason: 'Tarih seçin.' }

  if (isWeekend(isoDate)) {
    return { open: false, reason: 'Hafta sonu randevu alınamaz. Hafta içi bir gün seçin.' }
  }

  const holiday = holidayName(isoDate)
  if (holiday) {
    return { open: false, reason: `${holiday} nedeniyle kapalıyız. Başka bir gün seçin.` }
  }

  return { open: true }
}

/** Bugünün tarihi (yerel saat) — geçmişe randevu verilmesini engellemek için. */
export function today() {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}
