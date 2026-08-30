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
   - `supabase/migrations/0002_drop_legacy_tables.sql` — eski siteden kalan
     `decha_content` ve `decha_settings` tablolarını düşürür. Sıfırdan kurulan
     bir projede bu tablolar zaten yoktur, göç sessizce atlar.
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
| `meeting_requests`  | Toplantı planlama talepleri | **kapalı** | herkes INSERT edebilir|

`contact_messages` ve `meeting_requests` tabloları bilinçli olarak **okunamaz**: ziyaretçi
kayıt oluşturabilir ama mevcut kayıtları listeleyemez.

`meeting_requests` alanları: ad, e-posta, tarih, saat ve yer **zorunlu**; açıklama
opsiyoneldir. `location` kolonu üç sabit değerden birini alır — `online`,
`client_site`, `our_office`. Bu değerler `src/data/meeting.js` ile birebir aynı
olmalıdır; görünen Türkçe etiketler orada tutulur, veritabanına anahtar yazılır.

### Randevu kuralları

`src/data/meeting.js` tek kaynaktır:

- **Saatler** yalnızca tam saat, çalışma saatleri içinde: 09:00 – 17:00 (son
  randevu 17:00'de başlar, 18:00'de biter). Arayüzde saat girdisi değil,
  seçilebilir bir saat tablosu gösterilir.
- **Günler** yalnızca hafta içi. Cumartesi ve pazar kapalıdır.
- **Resmî tatiller** kapalıdır. Sabit tarihli tatiller koddan hesaplanır;
  dinî bayramlar ay takvimine göre kaydığı için yıl yıl listelenir ve
  **her yıl resmî takvimle doğrulanmalıdır**.

**Çift rezervasyon** iki katmanda engellenir:

1. `meeting_requests` üzerinde kısmi benzersiz indeks — aynı gün ve saate ikinci
   kayıt veritabanı seviyesinde reddedilir (iptal edilenler slotu serbest bırakır).
   İki kişi aynı anda gönderse bile yalnızca biri geçer.
2. `meeting_slots_taken` görünümü — dolu saatler arayüzde üstü çizili ve
   tıklanamaz gösterilir. Görünüm yalnızca tarih ve saat kolonlarını açar;
   ad ve e-posta dışarı çıkmaz.

Görünüm salt okunurdur: `select distinct` kullandığı için PostgreSQL onu
otomatik güncellenebilir saymaz, ayrıca `anon` ve `authenticated` rollerinden
tüm haklar geri alınıp yalnızca `SELECT` verilir. Aksi hâlde görünüm tanımlayıcı
haklarıyla çalıştığından anon anahtarını taşıyan biri görünüm üzerinden tablonun
RLS'ini atlayıp kayıtları silebilirdi.

Kısıt ihlali (Postgres `23505`) formda "bu saat az önce doldu" mesajına çevrilir
ve saat tablosu tazelenir. Mesajları Supabase panelinden veya oturum açmış bir kullanıcıyla
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

5. **Site settings → Build & deploy → Branches** bölümünden hangi dalın yayınlanacağını
   seçin. Netlify varsayılan olarak deponun varsayılan dalını derler.

> Ortam değişkenleri derleme anında paketlenir. Değişken eklendikten/değiştirildikten sonra
> **yeniden deploy** almanız gerekir.

> Değişkenler tanımlanmasa bile site açılır: Supabase yapılandırılmamışsa yerel demo
> içerik gösterilir, yalnızca iletişim formu kayıt oluşturamaz.

#### Dikkat: `NODE_ENV` ayarlamayın

Netlify ortam değişkenlerinde veya `netlify.toml` içinde `NODE_ENV = "production"`
**tanımlamayın**. npm bu durumda `devDependencies`'i hiç kurmaz; `vite`, `tailwindcss`
ve `postcss` bu grupta olduğu için derleme şu hatayla düşer:

```
sh: 1: vite: not found
```

`vite build` zaten üretim modunda çalışır, ayrıca bir ayara gerek yoktur.

Yerelde Netlify derlemesini birebir denemek için:

```bash
rm -rf node_modules dist
npm install --no-audit --no-fund
npm run build
```

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
│   ├── migrations/
│   │   ├── 0001_init.sql          # Şema + RLS
│   │   └── 0002_drop_legacy_tables.sql  # Eski site tablolarını kaldırır
│   └── seed.sql                   # Örnek içerik
└── src/
    ├── App.jsx               # Rotalar (lazy loading ile)
    ├── main.jsx              # Giriş noktası
    ├── index.css             # Token'lar (kağıt + fosfor) + CRT/damga/plaka malzemeleri
    ├── fonts.css             # @font-face tanımları (self-host)
    ├── components/
    │   ├── layout/           # Layout, Navbar, Footer, Rail, Hud, ScreenFx, Intro, ScrollToTop
    │   ├── ui/               # Button, Stamp, Logo, Section, DecodeText, Icon, Loader…
    │   ├── home/             # Hero, Process, CTA, ClientMarquee
    │   ├── ContactForm.jsx
    │   ├── MeetingModal.jsx  # Üst menüdeki "Toplantı Planla" penceresi
    │   ├── ProjectCard.jsx / PostCard.jsx / ServiceCard.jsx / TestimonialCard.jsx
    │   └── ErrorBoundary.jsx
    ├── data/content.js       # Supabase erişilemezse kullanılan yedek içerik
    ├── data/meeting.js       # Toplantı yeri seçenekleri (DB CHECK kısıtıyla eşleşir)
    ├── hooks/
    │   ├── useSupabaseData.js  # Veri çekme + otomatik fallback
    │   └── useScrollReveal.js
    ├── lib/
    │   ├── decode.js         # Şifre çözülme efektinin ortak parçaları
    │   ├── supabase.js       # İstemci (env yoksa güvenli şekilde null)
    │   ├── seo.js            # Sayfa başlığı / meta yönetimi
    │   └── format.js         # Tarih, slug, className yardımcıları
    ├── pages/                # Home, Services, Work, ProjectDetail, About, Blog, BlogPost, Contact, NotFound
    └── test/                 # Vitest testleri
```

---

## Tasarım sistemi

Görsel dil: **retro bürokratik terminal** — sıcak siyah bir ekran üzerinde tek
renk turuncu kontrol arayüzü. Referans, Loki dizisindeki TVA kurumunun TemPad
ekranlarıdır; markalı varlıklar kopyalanmaz, yalnızca renk ve arayüz dili
yorumlanır.

### Marka renkleri ve rolleri

Ham renkler her yerde kullanılamaz. Ölçüm sonucu: ekran zemininde (sıcak siyah)
Kritik Kırmızı 3.34, Endüstriyel Kahve 1.67 kalıyor. Bu yüzden her renk bir
**role** ayrılmıştır — dolgu renkleri ham kalır, metin renkleri ölçülmüş
türevlerdir.

| Renk | Değer | Rolü | Kontrast |
| ---- | ----- | ---- | -------- |
| TVA Turuncusu | `rgb(255 107 0)` | `--c-accent` · çerçeveler, başlıklar, etiketler, dolgular. Koyu ekranda metin olarak da yeterli | 6.91 |
| Memur Beji | `rgb(217 195 165)` | `--c-fg` · gövde metni | 11.55 |
| Arduvaz Grisi → türevi | `rgb(176 158 133)` / `rgb(136 121 102)` | `--c-fg-muted` / `--c-fg-subtle` | 7.58 / 4.67 |
| Hardal Sarısı | `rgb(229 169 60)` | `--c-highlight` · ikincil dolgu | 9.46 |
| Kritik Kırmızı | `rgb(195 32 38)` | `--c-danger-fill` · uyarı bantları (dolgu) | üzerine metin 5.47 |
| — türevi | `rgb(232 112 108)` | `--c-danger` · hata metni | 6.54 |
| Endüstriyel Kahve | `rgb(74 50 37)` | Kontrast 1.67; bu zeminde metin olarak kullanılmaz. Palette kalır, koyu dolgu gerektiren yerler için ayrılmıştır | — |

### Terminal arayüz dili

Referanstan alınan öğeler, hepsi yeniden kullanılabilir sınıflar:

| Sınıf | Karşılığı |
| ----- | --------- |
| `.panel` | 1px turuncu çerçeve + dışında ikinci ince hat |
| `.brackets` | Dört köşede L işareti (sekiz arka plan katmanı, ek DOM gerekmez) |
| `.hatch` | Başlık şeritlerindeki eğik tarama dokusu |
| `.grid-field` | Panel içi grafik kağıdı zemini |
| `.list-row` | Liste satırı; seçili olan dolu turuncu, üzerine ekran siyahı |
| `.key` | Terminal butonu; keskin köşe, çift çerçeve |
| `.stamp` | Kauçuk damga |
| `Modal` | Portal ile açılan pencere; Escape, odak döngüsü ve kaydırma kilidi dahil |
| `.phosphor` | Turuncu metinlerde tüp ışıması |

İki sabit arayüz parçası referansın imzasıdır ve gerçek işlev taşır:

- **Sol ikon rayı** (`Rail`) — masaüstünde ekranın sol kenarında; alttaki ince iz
  sayfa ilerlemesini gösterir. Üst menüyle çakışan ikinci bir gezinme sunmadığı
  için ekran okuyuculardan gizlidir.
- **Alt durum şeridi** (`Hud`) — sabit sayı yığını yerine gerçek durumu gösterir:
  aktif bölüm kodu, canlı saat, sayfa konumu yüzdesi.

### Ekran efektleri

Dış televizyon kasası kaldırıldı; içerik viewport'un tamamını kullanır.
Ekranın CRT karakterini veren katmanlar `ScreenFx` içinde kalır:

| Katman | İş |
| ------ | -- |
| `tv-overlay` | Cam yansıması + tarama çizgileri + köşe karartması |
| `tv-sweep` | Aşağı inen yayın taraması bandı |

İkisi de `position: fixed` + `pointer-events: none` — içerik altlarında kayar,
tıklama ve kaydırmayı engellemez. `prefers-reduced-motion` altında yayın bandı
durur.

Ekran zemini (turuncu grafik ızgarası + üstten aşağı ton geçişi) doğrudan
`body` üzerindedir, `background-attachment: fixed` ile sabit durur.

### Hareket

Hareket belirteçleri `index.css` içindeki `:root` bloğunda tek yerde durur:
`--ease-out`, `--ease-in-out`, `--dur-fast`, `--dur-base`.

> **Not:** Animasyonlara başlangıçta `steps()` zamanlaması verilmişti; amaç
> mekanik bir his vermekti ama sonuç düşük kare hızı gibi görünüyordu.
> Ölçüldü: 450 ms'lik bir kart açılışında tarayıcı 67 kare çiziyor, kart ise
> yalnızca **7 farklı görsel duruma** giriyordu — yani göze ~16 fps. Yumuşak
> eğriye geçildi (24 durum, ~53 fps). Kademeli zamanlama yalnızca gerçekten
> açık/kapalı olan iki efektte kaldı: imleç yanıp sönmesi ve glitch kanalları.
>
> Bunun bir boyama maliyeti sorunu olmadığı ayrıca doğrulandı: mobil + 6 kat
> yavaş CPU altında 3 sn kaydırma boyunca `background-attachment: fixed`, CRT
> katmanı ve menü çubuğundaki `backdrop-blur` tek tek kapatıldığında ana iş
> parçacığı süresi gürültü sınırları içinde kalıyor (1130-1170 ms).

**Başlıktaki şifre çözülme** — `DecodeText` (`src/components/ui/DecodeText.jsx`)
ana başlıktaki vurgu kelimesini 5 saniyede bir değiştirir. Geçişte harfler
soldan sağa doğru rastgele karakterlerden çözülür. Kelime listesi `Hero.jsx`
içinde modül seviyesinde sabittir.

Dört ayrıntı bilinçli:

- **Karışan karakterler hedef harfle yakın genişlikte seçilir.** Turuncu kutu
  kelimeye tam oturduğu için karışma metninin de aynı genişlikte kalması
  gerekir; serbest bir alfabede metin kelimeden 70 px'e kadar geniş
  çizilebiliyordu (ölçüldü: dar `ı` 15.8 px, geniş `Ü` 39.7 px). Glif
  genişlikleri canvas ile ölçülür, her karakter için en yakın beş aday
  arasından rastgele seçim yapılır ve biriken sapma bir sonraki karakterde
  telafi edilir. Canvas yoksa (jsdom) kelimenin kendi harfleri karıştırılır —
  genişlik tanım gereği sabit kalır.
- **Kutu her kelimede kendi genişliğine oturur.** Genişlik, akıştaki görünmez
  katmandan `ResizeObserver` ile ölçülür (yazı tipi geç yüklenirse ve pencere
  yeniden boyutlanırsa yeniden ölçer). Genişliğe CSS geçişi verilmez: karışma
  metni yeni kelimenin genişliğinde başladığı için kutu animasyonla yetişirken
  yazı 32 px dışarı taşıyordu.
- **Metin ve kutu aynı karede değişir.** Çözülme `useLayoutEffect` içinde
  başlar ve ilk tiki beklemeden karıştırır; `useEffect` ile metin bir kare
  geriden geldiği için kutu küçülürken eski kelime 54 px dışarı taşıyordu.
- **Turuncu zemin dikeyde `em` cinsinden taşırılır.** `İ`/`Ö`/`Ü`'nün noktaları
  taban çizgisinden 0.91em yukarı, `Ş`/`Ç`'nin çengeli 0.23em aşağı çıkıyor;
  satır kutusu bunları kapsamadığı için noktalar dışarıda, çengel sınırda
  kalıyordu. Zemin ve metin ayrı katmanlarda: zeminle birlikte kaydırılsaydı
  metnin taban çizgisi satırın geri kalanından kopardı.
- **Erişilebilir ad sabit kalır.** Animasyonlu katmanlar `aria-hidden`, ekran
  okuyucular `sr-only` içindeki ilk kelimeyi okur; başlığın adı her zaman
  "Markanızı dijitalde büyüten tasarım ve yazılım" olur.

Ölçülen sonuç — harf mürekkebiyle kutu kenarı arasındaki en dar boşluk, tüm
kelimeler ve 93 farklı karışma karesi boyunca: üstte 4.9 px, altta 6.0 px,
yanlarda 5.4 px. Hiçbir karede taşma yok.

**Giriş ekranı** — `Intro` (`src/components/layout/Intro.jsx`). Ortak decode
parçaları `src/lib/decode.js` içinde; başlıktaki kelime döngüsüyle aynı alfabeyi
ve kare süresini kullanır.

Aşamalar (ilk ziyaret): `decode` → `lock` → `reveal`

| Aşama | Süre | Ne olur |
| ----- | ---- | ------- |
| `decode` | 700 ms | `DECHA` rastgele gliflerden soldan sağa çözülür (30 kare/sn) |
| `lock` | 260 ms | Yazının üzerinden "kilitlendi" taraması geçer |
| `reveal` | 380 ms | Panel eski televizyon gibi ince bir çizgiye kapanır |

Tekrar gelen ziyaretçide (`localStorage` izi varsa) yalnızca `hold` → `reveal`
çalışır: ~570 ms'lik kısa bir marka anı. İlk ziyarette toplam ~1.55 sn.

| Kural | Uygulama |
| ----- | -------- |
| Aynı anda tek hareket | Aşamalar art arda çalışır, üst üste binmez |
| Yükleme göstergesi değil | Hiçbir şeyi beklemez, sahte ilerleme çubuğu yok |
| Atlanabilir | Tıklama, `Escape` ve odaklanabilir "Geç" düğmesi |
| Oturumda bir kez | `sessionStorage` (`decha:intro-session`) |
| Yerleşimi bozmaz | `position: fixed` + `transform: scaleY()` ile kapanma |

Her açılışta değişen bir dosya numarası (`DOSYA NO: 7741-C`) gösterilir —
statik metin, hareket eklemez.

Mobil: "Geç" düğmesi 44×44 px dokunma hedefi alt sınırının altına inmez
(ölçüldü: 55×44) ve konumu `env(safe-area-inset-*)` ile ana ekran çubuğunu
hesaba katar. Ekranın herhangi bir yerine dokunmak da açılışı geçer. Yazı
boyutu `clamp(3rem, 12vw, 5rem)` — dar ekranda 48 px'in altına düşmez.

Üç ayrıntı ölçülerek çözüldü:

- **Kapanan katman ayrı.** Turuncu tarama çizgisi ve "Geç" düğmesi panelin
  dışında duruyor; içinde olsalardı `scaleY` ile birlikte ezilirlerdi.
- **Tarama `background-position` ile hareket ediyor.** Taşıyıcıyı
  `overflow: hidden` yapmak fosfor parıltısını kırpıyordu; `transform` ile de
  çubuk kutunun dışına taşıp sayfanın solunda görünüyordu.
- **"Geç" düğmesi dokunma hedefi sınırının altındaydı** (47×31 px). Ölçüsü
  44×44'ün altına inmeyecek şekilde sabitlendi.

Ölçüldü: ilk ziyaret ~1.55 sn, tekrar ziyaret ~0.57 sn; CLS 0.004; konsol
hatası yok; ilk `Tab` doğrudan "Geç" düğmesine gidiyor; panel kalkınca kaydırma
kilidi serbest bırakılıyor.

**Kaydırırken açılma** — `Section` görünür alana girdiğinde kapsayıcısına
`is-in` sınıfını ekler (`useScrollReveal`, `IntersectionObserver`).

| Sınıf | İş |
| ----- | -- |
| `reveal` | Bloğun kendisi aşağıdan yukarı belirir |
| `stagger` | İçindeki kartlar `nth-child` gecikmeleriyle sırayla açılır |

`stagger` bir ızgaraya elle eklenir; ilk 8 çocuk 60 ms aralıklarla, sonrakiler
aynı gecikmeyle girer. Kart açılışı uçtan uca ~880 ms sürer.

`prefers-reduced-motion: reduce` altında giriş ekranı hiç gösterilmez, kelime
`büyüten` üzerinde donar ve tüm içerik gecikmesiz, tam görünür gelir — hiçbir
şey gizli kalmaz.

### Sabit düzen ölçüleri

İki CSS değişkeni sabit arayüz parçalarının yerini belirler; içerik ve menü
bunlara göre boşluk alır:

| Değişken | Değer | Ne için |
| -------- | ----- | ------- |
| `--rail-w` | 0 (mobil) / 52px (≥768px) | Sol ikon rayının genişliği |
| `--hud-h` | 24px | Alt durum şeridinin yüksekliği |

### Görsel kullanılmaz

Sitede fotoğraf yoktur. Proje ve yazı kartları monogram, dosya kodu ve ölçüm
değerleriyle kurulur; ekip ve referanslar baş harf künyeleriyle gösterilir.
Bu sayede dış CDN'e hiçbir istek gitmez ve site tamamen kendi kaynaklarıyla çalışır.

Supabase şemasındaki `cover_url` / `avatar_url` kolonları duruyor — ileride gerçek
proje görselleri eklenmek istenirse veri kaybı olmadan kullanılabilir.

### Tipografi

- **Chakra Petch** — başlıklar; köşeli, retro-teknik karakter
- **Archivo** — gövde metni
- **IBM Plex Mono** — form alanları, etiketler, dosya numaraları, terminal okumaları

Fontlar `public/fonts/` altında self-host edilir (latin + latin-ext → Türkçe tam
destek). Google Fonts CDN'e istek gitmez.

### Erişilebilirlik

Kontrast iki katmanda doğrulanmıştır:

1. **Token düzeyi** — 8 renk çiftinin tamamı 4.5:1 üzerinde.
2. **Gerçek piksel düzeyi** — CRT kaplamaları (tarama çizgileri + köşe karartması)
   metnin üzerinde durduğu için ekran görüntüsünden piksel örneklenerek ölçüldü.

Butonlar 44px dokunma hedefini korur; `prefers-reduced-motion` altında yayın
bandı, yanıp sönen göstergeler ve tüm geçişler durur.

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
