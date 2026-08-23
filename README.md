# Decha Agency

Dijital ajans web sitesi. **React + Vite** ile geliştirildi, veritabanı olarak **Supabase**,
yayınlama için **Netlify** kullanır.

---

## İçindekiler

- [Teknoloji yığını](#teknoloji-yığını)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Supabase kurulumu](#supabase-kurulumu)
- [Netlify ile yayınlama](#netlify-ile-yayınlama)
- [Proje yapısı](#proje-yapısı)
- [Tasarım sistemi](#tasarım-sistemi)
- [Komutlar](#komutlar)
- [Nasıl çalışıyor?](#nasıl-çalışıyor)

---

## Teknoloji yığını

| Katman        | Teknoloji                          |
| ------------- | ---------------------------------- |
| Arayüz        | React 18, React Router 6           |
| Derleme       | Vite 5                             |
| Stil          | Tailwind CSS 3 (CSS değişkeni token'ları) |
| Veritabanı    | Supabase (PostgreSQL + RLS)        |
| Yayın         | Netlify                            |
| Test          | Vitest + Testing Library           |
| Kod kalitesi  | ESLint 9 (flat config)             |

---

## Hızlı başlangıç

Gereksinim: **Node.js 20+**

```bash
# 1) Bağımlılıkları kur
npm install

# 2) Ortam değişkenlerini hazırla
cp .env.example .env
#    .env içine Supabase URL ve anon key değerlerinizi yazın

# 3) Geliştirme sunucusunu başlat
npm run dev
```

Site `http://localhost:5173` adresinde açılır.

> **Not:** `.env` doldurulmasa bile site çalışır. Supabase yapılandırılmamışsa
> `src/data/content.js` içindeki yerel demo içerik gösterilir; yalnızca iletişim formu
> kayıt oluşturamaz. Bu sayede derleme ve yayın hiçbir koşulda kırılmaz.

---

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluşturun.
2. **SQL Editor** sekmesinde sırasıyla şu dosyaları çalıştırın:
   - `supabase/migrations/0001_init.sql` — tablolar, indeksler ve RLS politikaları
   - `supabase/seed.sql` — örnek içerik (opsiyonel)
3. **Project Settings → API** bölümünden şu iki değeri kopyalayın ve `.env` dosyasına yazın:

```env
VITE_SUPABASE_URL=https://<proje-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

> ⚠️ **`service_role` anahtarını asla istemci tarafına koymayın.** Bu proje yalnızca
> `anon` anahtarını kullanır; güvenlik Row Level Security politikalarıyla sağlanır.

### Tablolar

| Tablo               | Amaç                    | Okuma        | Yazma                 |
| ------------------- | ----------------------- | ------------ | --------------------- |
| `services`          | Hizmetler               | herkese açık | yalnızca oturum açmış |
| `projects`          | Portfolyo projeleri     | herkese açık | yalnızca oturum açmış |
| `testimonials`      | Müşteri referansları    | herkese açık | yalnızca oturum açmış |
| `posts`             | Blog yazıları           | herkese açık | yalnızca oturum açmış |
| `contact_messages`  | İletişim formu kayıtları| **kapalı**   | herkes INSERT edebilir|

`contact_messages` tablosu bilinçli olarak **okunamaz**: ziyaretçi mesaj gönderebilir ama
gelen mesajları listeleyemez. Mesajları Supabase panelinden veya oturum açmış bir kullanıcıyla
görüntüleyebilirsiniz.

---

## Netlify ile yayınlama

### 1. Git üzerinden (önerilen)

1. Netlify’da **Add new site → Import an existing project** ile bu repoyu seçin.
2. Derleme ayarları `netlify.toml` dosyasından otomatik okunur:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Site settings → Environment variables** bölümüne şunları ekleyin:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (opsiyonel) `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`
4. **Deploy** deyin.

> Ortam değişkenleri derleme anında paketlenir. Değişken eklendikten/değiştirildikten sonra
> **yeniden deploy** almanız gerekir.

### 2. CLI ile

```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### SPA yönlendirmesi

React Router client-side routing kullandığı için tüm istekler `index.html`'e yönlendirilir.
Bu kural hem `netlify.toml` hem de `public/_redirects` içinde tanımlıdır; doğrudan
`/projeler/nova-finance` gibi bir adrese girildiğinde 404 alınmaz.

---

## Proje yapısı

```
.
├── netlify.toml              # Netlify derleme, redirect ve güvenlik başlıkları
├── public/
│   ├── _redirects            # SPA fallback (yedek kural)
│   ├── fonts/                # Self-host değişken fontlar (woff2)
│   ├── favicon.svg
│   └── robots.txt
├── supabase/
│   ├── migrations/0001_init.sql   # Şema + RLS
│   └── seed.sql                   # Örnek içerik
└── src/
    ├── App.jsx               # Rotalar (lazy loading ile)
    ├── main.jsx              # Giriş noktası
    ├── index.css             # Token'lar (kağıt + fosfor) + CRT/damga/plaka malzemeleri
    ├── fonts.css             # @font-face tanımları (self-host)
    ├── components/
    │   ├── layout/           # Navbar, Footer, Layout, ScrollToTop
    │   ├── ui/               # Crt, Button, Stamp, Logo, Section, Icon, Loader…
    │   ├── home/             # Hero, Process, CTA, ClientMarquee
    │   ├── ContactForm.jsx
    │   ├── ProjectCard.jsx / PostCard.jsx / ServiceCard.jsx / TestimonialCard.jsx
    │   └── ErrorBoundary.jsx
    ├── data/content.js       # Supabase erişilemezse kullanılan yedek içerik
    ├── hooks/
    │   ├── useSupabaseData.js  # Veri çekme + otomatik fallback
    │   └── useScrollReveal.js
    ├── lib/
    │   ├── supabase.js       # İstemci (env yoksa güvenli şekilde null)
    │   ├── seo.js            # Sayfa başlığı / meta yönetimi
    │   └── format.js         # Tarih, slug, className yardımcıları
    ├── pages/                # Home, Services, Work, ProjectDetail, About, Blog, BlogPost, Contact, NotFound
    └── test/                 # Vitest testleri
```

---

## Tasarım sistemi

Görsel dil: **retro bürokrasi** — 60–70'ler kurum estetiği, tüplü televizyon
monitörleri, damgalı dosya kartları ve daktilo formları. Referans, Loki dizisindeki
TVA kurumunun görsel dünyasıdır; markalı varlıklar kopyalanmaz, yalnızca estetik
yorumlanır.

### Marka renkleri ve rolleri

Ham renkler her yerde kullanılamaz: turuncu ve hardal, açık zeminde küçük metin için
kontrast eşiğini geçmez (ölçülen 1.67 ve 1.22). Bu yüzden her renk bir **role**
ayrılmıştır — dolgu renkleri ham kalır, metin renkleri ölçülmüş türevlerdir.

| Renk | Değer | Rolü |
| ---- | ----- | ---- |
| TVA Turuncusu | `rgb(255 107 0)` | `--c-accent` · buton dolgusu, led, grafik öğeler. Metin olarak **kullanılmaz** |
| — türevi | `rgb(164 78 18)` | `--c-accent-ink` · kağıt zeminde vurgu metni (4.54) |
| Hardal Sarısı | `rgb(229 169 60)` | `--c-highlight` · ikincil dolgu; üzerine kahve metin (5.68) |
| Kritik Kırmızı | `rgb(195 32 38)` | `--c-danger` · damgalar, form hataları (4.70) |
| Memur Beji | `rgb(217 195 165)` | Sayfa zemininin kaynağı; CRT ekranında fosfor metin rengi (10.98) |
| Endüstriyel Kahve | `rgb(74 50 37)` | `--c-fg` · ana metin (9.42), CRT gövde dökümü, hairline'lar |
| Arduvaz Grisi | `rgb(92 100 102)` | `--c-fg-muted` / `--c-fg-subtle` · ikincil metin (5.60 / 4.81) |

### İki yüzey, tek token seti

Site iki yüzeyden oluşur ve **aynı** token adlarını kullanır:

- **Kağıt** (`:root`) — bürokrasi zemini, milimetrik ızgara ve kağıt dokusu
- **Fosfor** (`.screen-phosphor`) — CRT ekranının içi; koyu, sıcak, bej metinli

`.screen-phosphor` token'ları yeniden tanımladığı için, ekranın **içine giren her
bileşen** (kart, form, buton) ayrı bir varyanta ihtiyaç duymadan otomatik uyum sağlar.

### CRT bileşeni

```jsx
<Crt label="Arşiv · Kanal 02" channel="SEÇİLİ İŞLER" tone="phosphor">
  {/* içerik */}
</Crt>
```

Kasa katmanları: döküm gövde (kahve degrade + gren) → köşe vidaları → künye plakası
ve led → tüp camı (yastık kavisli köşeler) → tarama çizgileri → köşe karartması →
cam yansıması → alt havalandırma ve kadranlar. `tone="paper"` açık ekran verir
(proje ve blog kartlarındaki küçük monitörler bunu kullanır).

### Tipografi

- **Chakra Petch** — başlıklar; köşeli, retro-teknik karakter
- **Archivo** — gövde metni
- **IBM Plex Mono** — form alanları, etiketler, dosya numaraları, terminal okumaları

Fontlar `public/fonts/` altında self-host edilir (latin + latin-ext → Türkçe tam
destek). Google Fonts CDN'e istek gitmez.

### Erişilebilirlik

Kontrast iki katmanda doğrulanmıştır:

1. **Token düzeyi** — her iki yüzeyde de 8 renk çiftinin tamamı 4.5:1 üzerinde.
2. **Gerçek piksel düzeyi** — CRT kaplamaları (tarama çizgileri + köşe karartması)
   metnin üzerinde durduğu için ekran görüntüsünden piksel örneklenerek ölçüldü:
   gövde metni 5.02, ekran kenarındaki vurgu metni 5.41.

Butonlar 44px dokunma hedefini korur; `prefers-reduced-motion` altında tarama bandı,
yanıp sönen ledler ve tüm geçişler durur.

### Boşluk ölçeği

`<Section>` bileşeninin dikey boşluğu `spacing` prop'u ile verilir
(`default`, `tight`, `intro`, `top-none`, `bottom-none`, `none`).
className üzerinden `pt-0` gibi sınıflar geçmeyin — duyarlı varsayılan (`sm:py-28`)
medya sorgusu içinde olduğu için bunlar masaüstünde sessizce etkisiz kalır.

---

## Komutlar

| Komut               | Açıklama                              |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Geliştirme sunucusu (HMR)             |
| `npm run build`     | Üretim derlemesi → `dist/`            |
| `npm run preview`   | Derlenmiş çıktıyı yerelde önizle      |
| `npm run lint`      | ESLint denetimi                       |
| `npm test`          | Testleri bir kez çalıştır             |
| `npm run test:watch`| Testleri izleme modunda çalıştır      |

---

## Nasıl çalışıyor?

### Veri akışı

`useSupabaseData` hook'u her sayfada aynı deseni uygular:

```jsx
const { data, loading } = useSupabaseData('projects', {
  fallback: projects,                        // Supabase yoksa/boşsa bu kullanılır
  filters: { featured: true },
  order: { column: 'order_no', ascending: true },
  limit: 3,
})
```

Sıralama şu şekildedir:

1. Supabase yapılandırılmışsa sorgu çalışır.
2. Sorgu hata verirse veya **boş** dönerse otomatik olarak `fallback` içeriğe düşer.
3. Böylece site hiçbir zaman boş ekranla açılmaz.

### Rota tablosu

| Yol                 | Sayfa            |
| ------------------- | ---------------- |
| `/`                 | Ana sayfa        |
| `/hizmetler`        | Hizmetler + SSS  |
| `/projeler`         | Proje listesi (kategori filtreli) |
| `/projeler/:slug`   | Proje detayı     |
| `/hakkimizda`       | Hakkımızda / ekip|
| `/blog`             | Blog listesi     |
| `/blog/:slug`       | Blog yazısı      |
| `/iletisim`         | İletişim + form  |
| diğer               | 404              |

Ana sayfa dışındaki tüm sayfalar `React.lazy` ile bölünmüştür; ilk yükleme paketi küçüktür.
