/**
 * Supabase erişilemediğinde (env yok / tablo boş / ağ hatası) kullanılan
 * yerel içerik. supabase/seed.sql ile birebir aynı verilerdir.
 *
 * Site fotoğraf kullanmaz: proje ve yazı kartları monogram, dosya kodu ve
 * ölçüm değerleriyle kurulur. Bu yüzden burada görsel alanı bulunmaz.
 * (Supabase şemasında cover_url / avatar_url kolonları duruyor; ileride
 * görsel eklenmek istenirse veri kaybı olmadan kullanılabilir.)
 */

export const SITE = {
  name: 'Decha Agency',
  tagline: 'Dijital büyüme için tasarım ve yazılım',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'merhaba@dechaagency.com',
  phone: '+90 (212) 000 00 00',
  address: 'Levent, İstanbul, Türkiye',
  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'Dribbble', href: 'https://dribbble.com' },
    { label: 'GitHub', href: 'https://github.com' },
  ],
}

export const services = [
  {
    id: 'web-tasarim',
    slug: 'web-tasarim',
    title: 'Web Tasarım & Geliştirme',
    summary:
      'Hızlı, erişilebilir ve dönüşüm odaklı kurumsal siteler, e-ticaret ve web uygulamaları.',
    icon: 'layout',
    features: ['UI/UX tasarım', 'React & Next.js', 'Headless CMS', 'Core Web Vitals optimizasyonu'],
    price_from: 45000,
    order_no: 1,
  },
  {
    id: 'marka-kimligi',
    slug: 'marka-kimligi',
    title: 'Marka Kimliği',
    summary:
      'Logo, tipografi, renk sistemi ve kullanım kılavuzuyla tutarlı bir marka dili kurgularız.',
    icon: 'sparkles',
    features: ['Logo & amblem', 'Marka kılavuzu', 'Sosyal medya kiti', 'Basılı materyal'],
    price_from: 28000,
    order_no: 2,
  },
  {
    id: 'dijital-pazarlama',
    slug: 'dijital-pazarlama',
    title: 'Dijital Pazarlama',
    summary:
      'Performans pazarlaması, SEO ve içerik stratejisiyle ölçülebilir büyüme sağlarız.',
    icon: 'trending',
    features: ['Google & Meta Ads', 'Teknik SEO', 'İçerik stratejisi', 'Analitik & raporlama'],
    price_from: 18000,
    order_no: 3,
  },
  {
    id: 'mobil-uygulama',
    slug: 'mobil-uygulama',
    title: 'Mobil Uygulama',
    summary:
      'iOS ve Android için tek kod tabanıyla native hisli, ölçeklenebilir mobil ürünler.',
    icon: 'phone',
    features: ['React Native', 'App Store & Play yayını', 'Push bildirim', 'Analitik entegrasyonu'],
    price_from: 90000,
    order_no: 4,
  },
  {
    id: 'urun-stratejisi',
    slug: 'urun-stratejisi',
    title: 'Ürün Stratejisi',
    summary:
      'Fikirden MVP’ye; kullanıcı araştırması, yol haritası ve prototipleme süreçleri.',
    icon: 'compass',
    features: ['Kullanıcı araştırması', 'Bilgi mimarisi', 'Prototip', 'Yol haritası'],
    price_from: 22000,
    order_no: 5,
  },
  {
    id: 'bakim-destek',
    slug: 'bakim-destek',
    title: 'Bakım & Destek',
    summary:
      'Yayına aldığınız ürünün güvenliği, hızı ve sürekliliği için aylık destek paketleri.',
    icon: 'shield',
    features: ['7/24 izleme', 'Güvenlik güncellemeleri', 'Yedekleme', 'SLA garantisi'],
    price_from: 7500,
    order_no: 6,
  },
]

export const projects = [
  {
    id: 'nova-finance',
    slug: 'nova-finance',
    title: 'Nova Finance',
    client: 'Nova Bank',
    category: 'Web Uygulaması',
    year: 2025,
    summary: 'Bireysel yatırımcılar için portföy takip paneli.',
    description:
      'Nova Bank için gerçek zamanlı portföy takibi, risk analizi ve raporlama sunan bir web uygulaması tasarladık ve geliştirdik. Kullanıcıların ortalama oturum süresi %62 arttı.',
    tags: ['React', 'Supabase', 'Design System'],
    metrics: [
      { label: 'Oturum süresi', value: '+%62' },
      { label: 'Dönüşüm', value: '+%38' },
    ],
    featured: true,
    order_no: 1,
  },
  {
    id: 'atlas-travel',
    slug: 'atlas-travel',
    title: 'Atlas Travel',
    client: 'Atlas Turizm',
    category: 'E-Ticaret',
    year: 2025,
    summary: 'Tur rezervasyon platformu ve mobil deneyim.',
    description:
      'Atlas Turizm’in rezervasyon akışını baştan kurguladık. Ödeme adımlarını 5’ten 2’ye indirerek sepet terk oranını ciddi biçimde düşürdük.',
    tags: ['E-Ticaret', 'UX', 'Ödeme Entegrasyonu'],
    metrics: [
      { label: 'Sepet terk', value: '-%41' },
      { label: 'Mobil satış', value: '+%77' },
    ],
    featured: true,
    order_no: 2,
  },
  {
    id: 'verde-organics',
    slug: 'verde-organics',
    title: 'Verde Organics',
    client: 'Verde',
    category: 'Marka Kimliği',
    year: 2024,
    summary: 'Organik gıda markası için uçtan uca kimlik.',
    description:
      'Logo, ambalaj, tipografi ve dijital varlıkları kapsayan bütünsel bir marka kimliği geliştirdik. Marka bilinirliği ilk 6 ayda iki katına çıktı.',
    tags: ['Branding', 'Ambalaj', 'Art Direction'],
    metrics: [
      { label: 'Bilinirlik', value: '2x' },
      { label: 'Raf satışı', value: '+%54' },
    ],
    featured: true,
    order_no: 3,
  },
  {
    id: 'pulse-health',
    slug: 'pulse-health',
    title: 'Pulse Health',
    client: 'Pulse',
    category: 'Mobil Uygulama',
    year: 2024,
    summary: 'Kronik hasta takibi için mobil uygulama.',
    description:
      'Hastaların ilaç ve ölçüm takibini kolaylaştıran, hekimle veri paylaşımı sağlayan bir mobil uygulama geliştirdik.',
    tags: ['React Native', 'Sağlık', 'KVKK'],
    metrics: [
      { label: 'Günlük aktif', value: '18K' },
      { label: 'Uygulama puanı', value: '4.8' },
    ],
    featured: false,
    order_no: 4,
  },
  {
    id: 'kite-saas',
    slug: 'kite-saas',
    title: 'Kite SaaS',
    client: 'Kite',
    category: 'Web Uygulaması',
    year: 2024,
    summary: 'B2B ekipler için proje yönetim aracı.',
    description:
      'Sıfırdan tasarım sistemi kurarak Kite’ın ürününü yeniden inşa ettik; yeni kullanıcı aktivasyonu belirgin şekilde arttı.',
    tags: ['SaaS', 'Design System', 'B2B'],
    metrics: [
      { label: 'Aktivasyon', value: '+%45' },
      { label: 'Destek talebi', value: '-%30' },
    ],
    featured: false,
    order_no: 5,
  },
  {
    id: 'orbit-studio',
    slug: 'orbit-studio',
    title: 'Orbit Studio',
    client: 'Orbit',
    category: 'Kurumsal Web',
    year: 2023,
    summary: 'Mimarlık ofisi için portfolyo sitesi.',
    description:
      'Görsel ağırlıklı projeleri öne çıkaran, hızlı ve sade bir kurumsal site tasarladık.',
    tags: ['Kurumsal', 'CMS', 'SEO'],
    metrics: [
      { label: 'Organik trafik', value: '+%120' },
      { label: 'LCP', value: '1.1s' },
    ],
    featured: false,
    order_no: 6,
  },
]

export const testimonials = [
  {
    id: 't1',
    name: 'Elif Demir',
    role: 'Pazarlama Direktörü',
    company: 'Nova Bank',
    quote:
      'Decha ile çalışmak bir ajansla değil, kendi ekibimizin bir parçasıyla çalışmak gibiydi. Sonuçlar hedeflerimizin üzerinde geldi.',
    rating: 5,
    order_no: 1,
  },
  {
    id: 't2',
    name: 'Mert Kaya',
    role: 'Kurucu Ortak',
    company: 'Kite',
    quote:
      'Ürünümüzü baştan kurguladılar. Tasarım sistemi sayesinde artık yeni özellikleri günler içinde çıkarabiliyoruz.',
    rating: 5,
    order_no: 2,
  },
  {
    id: 't3',
    name: 'Selin Aydın',
    role: 'E-Ticaret Müdürü',
    company: 'Atlas Turizm',
    quote:
      'Rezervasyon akışındaki iyileştirmeler ilk ayda kendini amorti etti. Süreç boyunca iletişim çok şeffaftı.',
    rating: 5,
    order_no: 3,
  },
]

export const posts = [
  {
    id: 'p1',
    slug: 'web-sitesi-hizi-neden-onemli',
    title: 'Web Sitesi Hızı Neden Dönüşümün En Sessiz Katili?',
    excerpt:
      'Sayfa yükleme süresindeki her 100 ms gecikmenin satışa etkisini ve pratik optimizasyon adımlarını anlatıyoruz.',
    category: 'Performans',
    author: 'Decha Ekibi',
    published_at: '2026-05-14',
    content:
      'Kullanıcılar yavaş siteleri terk eder. Core Web Vitals metrikleri (LCP, INP, CLS) yalnızca SEO için değil, doğrudan gelir için de belirleyicidir.\n\nGörselleri modern formatlara çevirmek, kritik olmayan JavaScript’i ertelemek ve sunucu tarafında önbellek kullanmak ilk üç adımdır. Ardından üçüncü parti scriptleri gözden geçirin: çoğu sitede yüklenme süresinin yarısından fazlası buradan gelir.\n\nSon olarak ölçün. Gerçek kullanıcı verisi (RUM) olmadan yapılan optimizasyon tahminden ibarettir.',
  },
  {
    id: 'p2',
    slug: 'tasarim-sistemi-kurmak',
    title: 'Küçük Ekipler İçin Tasarım Sistemi Kurma Rehberi',
    excerpt:
      'Bir tasarım sistemine ne zaman ihtiyaç duyulur, nereden başlanır ve nasıl sürdürülür?',
    category: 'Tasarım',
    author: 'Decha Ekibi',
    published_at: '2026-04-02',
    content:
      'Tasarım sistemi bir bileşen kütüphanesinden ibaret değildir; ortak bir dildir. Renk, tipografi ve boşluk ölçeğiyle başlayın.\n\nToken’ları önce anlamsal olarak isimlendirin: "brand-500" yerine "action-primary" gibi. Böylece marka değiştiğinde bileşenlere dokunmanız gerekmez.\n\nDokümantasyonu koda yakın tutun. Kullanılmayan bir sistem, olmayan bir sistemdir.',
  },
  {
    id: 'p3',
    slug: 'supabase-ile-hizli-mvp',
    title: 'Supabase ile 2 Haftada MVP Çıkarmak',
    excerpt:
      'Kimlik doğrulama, veritabanı ve dosya depolamayı tek çatı altında toplayarak nasıl hız kazandık?',
    category: 'Geliştirme',
    author: 'Decha Ekibi',
    published_at: '2026-02-20',
    content:
      'Supabase, Postgres üzerine kurulu açık kaynak bir backend platformu. Row Level Security sayesinde yetkilendirmeyi veritabanı seviyesinde tanımlayabiliyorsunuz.\n\nMVP aşamasında en büyük kazanç, ayrı bir API katmanı yazmadan doğrudan istemciden güvenli sorgu yapabilmek.\n\nYine de tablo tasarımını ve RLS politikalarını ilk günden doğru kurun; sonradan düzeltmek her zaman daha pahalıdır.',
  },
]

export const stats = [
  { label: 'Tamamlanan proje', value: '120+' },
  { label: 'Mutlu müşteri', value: '45' },
  { label: 'Yıllık deneyim', value: '8' },
  { label: 'Ortalama NPS', value: '72' },
]

export const processSteps = [
  {
    step: '01',
    title: 'Keşif',
    text: 'Hedefleri, kullanıcıları ve rekabeti anlıyoruz. Ölçülebilir başarı kriterleri belirliyoruz.',
  },
  {
    step: '02',
    title: 'Strateji & Tasarım',
    text: 'Bilgi mimarisi, akışlar ve arayüz tasarımı. Prototiple erken doğrulama yapıyoruz.',
  },
  {
    step: '03',
    title: 'Geliştirme',
    text: 'Modern, test edilebilir ve ölçeklenebilir kod. Haftalık demo ile şeffaf ilerleme.',
  },
  {
    step: '04',
    title: 'Yayın & Büyüme',
    text: 'Yayına alma, ölçümleme ve sürekli iyileştirme. Veriye dayalı kararlar.',
  },
]

export const clients = [
  'Nova Bank',
  'Atlas Turizm',
  'Verde',
  'Pulse',
  'Kite',
  'Orbit',
  'Lumen',
  'Vertex',
]

export const faqs = [
  {
    q: 'Bir proje ne kadar sürede tamamlanır?',
    a: 'Kurumsal web siteleri ortalama 4–6 hafta, web/mobil uygulamalar 8–16 hafta sürüyor. Keşif toplantısından sonra net bir takvim paylaşıyoruz.',
  },
  {
    q: 'Fiyatlandırma nasıl işliyor?',
    a: 'Sabit kapsamlı projelerde tek fiyat, sürekli çalışmalarda aylık retainer modeli sunuyoruz. Teklif her zaman ücretsizdir.',
  },
  {
    q: 'Yayın sonrası destek veriyor musunuz?',
    a: 'Evet. Tüm projelerde 1 ay ücretsiz destek, sonrasında opsiyonel bakım paketleri sağlıyoruz.',
  },
  {
    q: 'Mevcut sitemi yenileyebilir misiniz?',
    a: 'Kesinlikle. Önce teknik ve UX denetimi yapıyor, ardından kademeli veya komple yenileme planı sunuyoruz.',
  },
]
