/**
 * Toplantı yeri seçenekleri.
 *
 * Veritabanına etiket değil sabit anahtar yazılır; böylece görünen metin
 * değişse bile kayıtlar bozulmaz. `meeting_requests.location` kolonundaki
 * CHECK kısıtı buradaki değerlerle birebir aynı olmalıdır.
 */
export const MEETING_LOCATIONS = [
  { value: 'online', label: 'Online' },
  { value: 'client_site', label: 'Müşterinin yeri' },
  { value: 'our_office', label: 'Bizim ofisimiz' },
]

export function meetingLocationLabel(value) {
  return MEETING_LOCATIONS.find((option) => option.value === value)?.label ?? value
}
