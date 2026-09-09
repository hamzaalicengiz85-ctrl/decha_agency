/**
 * Kart ızgarasının sütun sayısını kayıt sayısına göre seçer.
 *
 * Sabit `lg:grid-cols-3` ızgarada iki kart kaldığında sağda kart genişliğinde
 * bir boşluk kalıyordu (denetimde ana sayfadaki referans bölümünde görüldü).
 * Kayıt sayısı sütun sayısından azsa ızgara daralıp ortalanır: satır dolu
 * görünür, kartlar da gereğinden fazla genişlemez.
 */
const GENISLIK = { 1: 'max-w-md', 2: 'max-w-3xl', 3: 'max-w-5xl' }

export function cardGrid(count, max = 3) {
  const cols = Math.max(1, Math.min(count || max, max))
  if (cols >= max) {
    return max >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'
  }
  const sinif = [
    cols >= 2 ? 'sm:grid-cols-2' : '',
    cols >= 3 ? 'lg:grid-cols-3' : '',
    'mx-auto',
    GENISLIK[cols],
  ]
  return sinif.filter(Boolean).join(' ')
}
