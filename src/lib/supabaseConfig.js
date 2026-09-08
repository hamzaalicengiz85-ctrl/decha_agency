/**
 * Supabase bağlantı bilgileri.
 *
 * NEDEN DEPODA DURUYORLAR
 * `.env` dosyası .gitignore'da — olması gerektiği gibi. Ama bu, depoyu
 * klonlayan her kurulumda dosyanın hiç bulunmaması demekti: site yedek
 * içerikle açılıyor, yönetim paneli de "Supabase yapılandırılmamış" diyordu.
 * Aynı şey GitHub Actions'ta depo değişkenleri tanımlanmadığında da oluyordu.
 *
 * NEDEN SAKINCASI YOK
 * Bu iki değer zaten public. Tarayıcının Supabase'e bağlanabilmesi için
 * ikisinin de üretim paketinin içinde bulunması ZORUNLU — yani yayındaki
 * her sürümde okunabilir hâlde duruyorlar. Depoya yazmak yeni bir açıklık
 * yaratmıyor.
 *
 * Koruma anahtarda değil, RLS'te: anon rolü içeriği okuyabilir ama
 * yazamaz, gelen kutusunu hiç göremez (supabase/migrations/0001_init.sql).
 * `service_role` anahtarı buraya ASLA yazılmaz.
 *
 * BAŞKA BİR PROJEYE GEÇMEK
 * Ortam değişkeni verilirse o kazanır; bu dosyaya dokunmak gerekmez:
 *   - yerelde  → .env içinde VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
 *   - Actions  → depo ayarlarında Variables
 * Anahtarı yenilerseniz (Supabase → Settings → API → Rotate) buradaki
 * değeri de güncelleyin.
 */

const VARSAYILAN_URL = 'https://ymjgbsreczcjwmgujina.supabase.co'
const VARSAYILAN_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inltamdic3JlY3pjandtZ3VqaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NDYwMDQsImV4cCI6MjA5NDMyMjAwNH0.cSPsnIMklmzhlqOtfD9U3kAsNxWYrs311h7edKOKfZs'

/** Örnek dosyadaki yer tutucular gerçek değer sayılmamalı. */
function gecerli(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  if (raw.includes('xxxxxxxx')) return null
  return raw
}

export const SUPABASE_URL =
  gecerli(import.meta.env?.VITE_SUPABASE_URL) ?? VARSAYILAN_URL

export const SUPABASE_ANON_KEY =
  gecerli(import.meta.env?.VITE_SUPABASE_ANON_KEY) ?? VARSAYILAN_ANON_KEY

/** Bağlantı bilgisi ortam değişkeninden mi geldi, gömülü varsayılandan mı? */
export const SUPABASE_KAYNAK = gecerli(import.meta.env?.VITE_SUPABASE_URL)
  ? 'ortam değişkeni'
  : 'gömülü varsayılan'
