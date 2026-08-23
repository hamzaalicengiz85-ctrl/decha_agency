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
    ├── index.css             # Tailwind katmanları + 3 palet + cam paneller
    ├── fonts.css             # @font-face tanımları (self-host)
    ├── components/
    │   ├── layout/           # Navbar, Footer, Layout, ScrollToTop
    │   ├── ui/               # Button, Section, Icon, Loader…
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

Tüm renkler `src/index.css` içinde **CSS değişkeni** olarak tanımlıdır; Tailwind bu
değişkenleri okur. Bileşenlerde sabit renk (örn. `text-slate-400`) kullanılmaz —
sadece anlamsal token'lar: `bg`, `bg-soft`, `bg-elev`, `fg`, `fg-muted`, `fg-subtle`,
`line`, `accent`, `accent-fg`.

### Palet değiştirme

Palet `index.html` içindeki tek bir öznitelikle değişir:

```html
<html lang="tr" data-palette="pearl">
```

| Değer      | Palet     | Karakter                                                        |
| ---------- | --------- | --------------------------------------------------------------- |
| `pearl`    | **Sedef** | **Varsayılan.** Kırık beyaz kağıt, mürekkep siyahı, sinyal turuncusu. Açık, editoryal, premium. |
| `titanium` | Titanyum  | Sıcak grafit zemin, şampanya-titanyum vurgu. Neredeyse monokrom, Apple donanım hissi. |
| `abyss`    | Abyss     | Derin petrol mürekkep, aurora mint vurgu. Koyu, teknik, fütüristik. |

Öznitelik hiç verilmezse Sedef paleti geçerli olur (`:root` varsayılanı).

### Cam paneller

`.glass` sınıfı Apple tarzı yarı saydam yüzeyi üretir: katmanlı dolgu + `backdrop-filter`
bulanıklığı + doygunluk artışı + üst kenarda 1px ışık çizgisi + yumuşak ortam gölgesi.
Her palet kendi cam değerlerini tanımlar, bu yüzden açık temada da doğru görünür.

### Tipografi

- **Instrument Sans** — başlıklar
- **Inter** — gövde metni
- **JetBrains Mono** — etiketler, sayılar, üst başlıklar (eyebrow)

Fontlar `public/fonts/` altında **self-host** edilir (değişken woff2, latin + latin-ext).
Google Fonts CDN'e istek gitmez: daha hızlı ilk boyama, üçüncü taraf bağımlılığı yok,
Türkçe karakterler (ğ, ı, ş, İ) eksiksiz.

### Erişilebilirlik

Kontrast oranları tarayıcıda ölçülerek doğrulanmıştır. Üç palette de gövde, ikincil ve
üçüncül metin ile vurgu üzerindeki metin **4.5:1** eşiğini geçer. Butonlar 44px dokunma
hedefini korur, `prefers-reduced-motion` desteklenir.

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
