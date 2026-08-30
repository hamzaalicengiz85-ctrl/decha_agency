import { describe, expect, it, vi, beforeEach } from 'vitest'

const state = { signInError: null, updateError: null, session: null, calls: [] }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      signInWithPassword: vi.fn((args) => {
        state.calls.push(['signIn', args.email])
        return Promise.resolve({
          data: { session: state.signInError ? null : { user: { email: args.email } } },
          error: state.signInError,
        })
      }),
      updateUser: vi.fn((args) => {
        state.calls.push(['updateUser', args.password])
        return Promise.resolve({ error: state.updateError })
      }),
      getSession: vi.fn(() => Promise.resolve({ data: { session: state.session } })),
    },
  },
}))

const { resolveEmail, signIn, changePassword, adminWrite } = await import('../lib/adminAuth')

beforeEach(() => {
  state.signInError = null
  state.updateError = null
  state.session = null
  state.calls = []
})

describe('resolveEmail', () => {
  it('"admin" kullanıcı adını e-postaya çevirir', () => {
    expect(resolveEmail('admin')).toContain('@')
  })

  it('büyük harfle yazılsa da eşleşir', () => {
    // Türkçe yerel küçültme kullanılsaydı 'ADMIN' → 'admın' olur, eşleşme kaçardı.
    expect(resolveEmail('ADMIN')).toBe(resolveEmail('admin'))
    expect(resolveEmail('  Admin  ')).toBe(resolveEmail('admin'))
  })

  it('doğrudan e-posta yazılabilir', () => {
    expect(resolveEmail('biri@ornek.com')).toBe('biri@ornek.com')
  })

  it('tanınmayan kullanıcı adı için null döner', () => {
    expect(resolveEmail('yonetici')).toBeNull()
    expect(resolveEmail('')).toBeNull()
  })
})

describe('signIn', () => {
  it('tanınmayan kullanıcı adını Supabase\'ye hiç göndermez', async () => {
    const result = await signIn('yonetici', 'sifre')
    expect(result.error).toMatch(/tanınmadı/i)
    expect(state.calls).toHaveLength(0)
  })

  it('şifre boşsa uyarır', async () => {
    const result = await signIn('admin', '')
    expect(result.error).toMatch(/şifre/i)
  })

  it('hatalı şifre için anlaşılır mesaj verir', async () => {
    state.signInError = { status: 400, message: 'Invalid login credentials' }
    const result = await signIn('admin', 'yanlis')
    expect(result.error).toBe('Kullanıcı adı veya şifre hatalı.')
  })

  it('başarılı girişte oturum döner', async () => {
    const result = await signIn('admin', 'dogru')
    expect(result.error).toBeUndefined()
    expect(result.session.user.email).toContain('@')
  })
})

describe('changePassword', () => {
  it('kısa şifreyi reddeder', async () => {
    const result = await changePassword('eski', 'kisa')
    expect(result.error).toMatch(/8 karakter/)
  })

  it('yeni şifre eskisiyle aynı olamaz', async () => {
    const result = await changePassword('ayniSifre1', 'ayniSifre1')
    expect(result.error).toMatch(/aynı olamaz/)
  })

  it('mevcut şifreyi doğrular — Supabase bunu kendisi yapmaz', async () => {
    state.session = { user: { email: 'admin@ornek.com' } }
    state.signInError = { status: 400, message: 'Invalid login credentials' }

    const result = await changePassword('yanlisEski', 'yeniSifre123')
    expect(result.error).toBe('Mevcut şifre hatalı.')
    // Doğrulama düşünce şifre güncelleme hiç çağrılmamalı.
    expect(state.calls.some(([name]) => name === 'updateUser')).toBe(false)
  })

  it('doğru mevcut şifreyle değiştirir', async () => {
    state.session = { user: { email: 'admin@ornek.com' } }
    const result = await changePassword('dogruEski', 'yeniSifre123')
    expect(result.ok).toBe(true)
    expect(state.calls).toContainEqual(['updateUser', 'yeniSifre123'])
  })
})

describe('adminWrite', () => {
  it('süresi dolmuş oturumu ayırt eder', async () => {
    const result = await adminWrite(() =>
      Promise.resolve({ data: null, error: { code: 'PGRST301', message: 'JWT expired' } }),
    )
    expect(result.needsReauth).toBe(true)
  })

  it('401 de yeniden giriş gerektirir', async () => {
    const result = await adminWrite(() =>
      Promise.resolve({ data: null, error: { status: 401, message: 'Unauthorized' } }),
    )
    expect(result.needsReauth).toBe(true)
  })

  it('diğer hatalar sıradan hata olarak döner', async () => {
    const result = await adminWrite(() =>
      Promise.resolve({ data: null, error: { code: '23505', message: 'duplicate key' } }),
    )
    expect(result.needsReauth).toBeUndefined()
    expect(result.error).toBe('duplicate key')
  })

  it('başarılı yazma veriyi döner', async () => {
    const result = await adminWrite(() => Promise.resolve({ data: [{ id: 1 }], error: null }))
    expect(result.data).toEqual([{ id: 1 }])
  })
})
