import { SITE, stats, processSteps, faqs } from './content'

/**
 * Dizi içeriklerin varsayılanları, `site_lists` anahtarlarıyla eşlenmiş.
 *
 * Tek kaynak olması önemli: hem sayfalar bunları varsayılan olarak render
 * ediyor hem de yönetim paneli düzenlemeye buradan başlıyor. İkisi ayrı
 * yerlerden okusaydı, panelde düzenlenen liste sitede görünenden farklı bir
 * şeyin üstüne yazabilirdi.
 */

export const HAKKIMIZDA_ILKELER = [
  {
    icon: 'compass',
    title: 'Önce hedef',
    text: 'Güzel görünen değil, işe yarayan çözümler üretiriz. Her kararın arkasında bir hedef vardır.',
  },
  {
    icon: 'sparkles',
    title: 'Detaycılık',
    text: 'Piksel hizasından kod kalitesine kadar detaylara takıntılıyız; fark orada oluşur.',
  },
  {
    icon: 'trending',
    title: 'Ölçülebilirlik',
    text: 'Yayın sonrası veriyi takip eder, iyileştirmeleri veriye dayandırırız.',
  },
  {
    icon: 'shield',
    title: 'Şeffaflık',
    text: 'Süreç boyunca ne yaptığımızı, neden yaptığımızı ve nerede olduğumuzu açıkça paylaşırız.',
  },
]

export const HAKKIMIZDA_EKIP = [
  { name: 'Deniz Yılmaz', role: 'Kurucu & Kreatif Direktör' },
  { name: 'Cem Arslan', role: 'Teknoloji Direktörü' },
  { name: 'Nil Şahin', role: 'Ürün Tasarımcısı' },
  { name: 'Barış Öz', role: 'Büyüme Uzmanı' },
]

export const HAKKIMIZDA_KUNYE = [
  { label: 'Merkez', value: 'Levent, İstanbul' },
  { label: 'Kadro', value: '12 kişi' },
  { label: 'Faaliyet alanı', value: 'Tasarım · Yazılım' },
  { label: 'Dosya durumu', value: 'Açık' },
]

export const ILETISIM_KONUM = [
  { label: 'Enlem', value: '41.0812 K' },
  { label: 'Boylam', value: '29.0094 D' },
  { label: 'Bölge', value: 'Beşiktaş / İstanbul' },
  { label: 'Zaman dilimi', value: 'UTC+03:00' },
]

/** Panelin liste düzenleyicisi bu haritadan başlar. */
export const LIST_DEFAULTS = {
  'surec.adimlar': processSteps,
  'sss.liste': faqs,
  'site.istatistikler': stats,
  'site.sosyal': SITE.social,
  'hakkimizda.ilkeler': HAKKIMIZDA_ILKELER,
  'hakkimizda.ekip': HAKKIMIZDA_EKIP,
  'hakkimizda.kunye': HAKKIMIZDA_KUNYE,
  'iletisim.konum': ILETISIM_KONUM,
}

/** Panelde okunabilir başlıklar. */
export const LIST_LABELS = {
  'surec.adimlar': 'Süreç adımları',
  'sss.liste': 'Sık sorulan sorular',
  'site.istatistikler': 'İstatistikler',
  'site.sosyal': 'Sosyal bağlantılar',
  'hakkimizda.ilkeler': 'Hakkımızda — ilkeler',
  'hakkimizda.ekip': 'Hakkımızda — ekip',
  'hakkimizda.kunye': 'Hakkımızda — künye',
  'iletisim.konum': 'İletişim — konum kaydı',
}
