import { supabase, isSupabaseConfigured } from './supabase'

/**
 * Yönetim paneli kimlik doğrulaması.
 *
 * Panelde kullanıcı adı olarak "admin" yazılır; burada gerçek bir Supabase
 * Auth kullanıcısının e-postasına eşlenir. Şifre hiçbir yerde kodda tutulmaz.
 *
 * Asıl güvenlik sınırı bu dosya değil, RLS'tir: istemci yalnızca anon
 * anahtarını taşır ve içerik tablolarına yazma izni `authenticated` rolüne
 * bağlıdır (supabase/migrations/0001_init.sql ve 0003_site_content.sql).
 * Panelin kendisi yalnızca arayüz kapısıdır.
 */

/**
 * Supabase Auth kimlik olarak e-posta biçiminde bir metin istiyor; bu adres
 * yalnızca iç kimliktir, gerçek bir posta kutusu değildir ve oraya hiçbir şey
 * gönderilmez. Kullanıcı panelde sadece "admin" yazar.
 */
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@decha.local'

// Kullanıcı adı → e-posta. Türkçe yerele duyarlı küçültme KULLANILMAZ:
// 'ADMIN'.toLocaleLowerCase('tr') → 'admın' olur ve eşleşme kaçar.
const ID_MAP = { admin: ADMIN_EMAIL }

export function resolveEmail(id) {
  const key = String(id ?? '').trim().toLowerCase()
  if (!key) return null
  if (ID_MAP[key]) return ID_MAP[key]
  return key.includes('@') ? key : null
}

function notConfigured() {
  return { error: 'Supabase bağlantısı yapılandırılmamış. .env dosyasını kontrol edin.' }
}

export async function signIn(id, password) {
  if (!isSupabaseConfigured || !supabase) return notConfigured()

  const email = resolveEmail(id)
  if (!email) return { error: 'Kullanıcı adı tanınmadı.' }
  if (!password) return { error: 'Şifre girin.' }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    return {
      error:
        error.status === 400
          ? 'Kullanıcı adı veya şifre hatalı.'
          : `Giriş yapılamadı: ${error.message}`,
    }
  }
  return { session: data.session }
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseConfigured || !supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export function onAuthChange(callback) {
  if (!isSupabaseConfigured || !supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => data.subscription.unsubscribe()
}

/**
 * Şifre değiştirir. Supabase mevcut şifreyi doğrulamadığı için önce onunla
 * yeniden giriş yapılır; aksi hâlde açık bırakılmış bir oturumu bulan biri
 * şifreyi eskisini bilmeden değiştirebilirdi.
 */
export async function changePassword(currentPassword, nextPassword) {
  if (!isSupabaseConfigured || !supabase) return notConfigured()
  if (!nextPassword || nextPassword.length < 8) {
    return { error: 'Yeni şifre en az 8 karakter olmalı.' }
  }
  if (nextPassword === currentPassword) {
    return { error: 'Yeni şifre eskisiyle aynı olamaz.' }
  }

  const session = await getSession()
  const email = session?.user?.email
  if (!email) return { error: 'Oturum bulunamadı, tekrar giriş yapın.' }

  const check = await supabase.auth.signInWithPassword({ email, password: currentPassword })
  if (check.error) return { error: 'Mevcut şifre hatalı.' }

  const { error } = await supabase.auth.updateUser({ password: nextPassword })
  if (error) return { error: `Şifre değiştirilemedi: ${error.message}` }
  return { ok: true }
}

/**
 * Yazma çağrılarını tek yerden geçirir. Süresi dolmuş oturumu ayırt eder ki
 * panel "kaydedilemedi" demek yerine yeniden giriş isteyip işlemi
 * tekrarlayabilsin.
 */
export async function adminWrite(run) {
  if (!isSupabaseConfigured || !supabase) return notConfigured()

  const { data, error } = await run(supabase)
  if (!error) return { data }

  const expired = error.code === 'PGRST301' || error.status === 401
  if (expired) return { error: 'Oturum süresi doldu.', needsReauth: true }

  if (import.meta.env.DEV) console.error('[Yönetim] yazma hatası:', error)
  return { error: error.message || 'Kayıt işlemi başarısız.' }
}
