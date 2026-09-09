import { beforeEach, describe, expect, it, vi } from 'vitest'

const durum = { uploadError: null, yuklenen: [] }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    storage: {
      from: (kova) => ({
        upload: (yol, file, opts) => {
          durum.yuklenen.push({ kova, yol, tur: file.type, opts })
          return Promise.resolve({ error: durum.uploadError })
        },
        getPublicUrl: (yol) => ({ data: { publicUrl: `https://ornek.supabase.co/storage/v1/object/public/${kova}/${yol}` } }),
      }),
    },
  },
}))

const { gorselYukle, EN_BUYUK_BOYUT } = await import('../lib/medya')

/** Tarayıcıdaki File nesnesinin testte yeten kadarı. */
function sahteDosya(type, size, name = 'foto') {
  return { type, size, name }
}

beforeEach(() => {
  durum.uploadError = null
  durum.yuklenen = []
})

describe('gorselYukle', () => {
  it('görsel olmayan dosyayı reddeder', async () => {
    const sonuc = await gorselYukle(sahteDosya('application/pdf', 1000))
    expect(sonuc.error).toMatch(/yalnız görsel/i)
    expect(durum.yuklenen).toHaveLength(0)
  })

  it('boyut sınırını aşan dosyayı reddeder', async () => {
    const sonuc = await gorselYukle(sahteDosya('image/png', EN_BUYUK_BOYUT + 1))
    expect(sonuc.error).toMatch(/çok büyük/i)
    expect(durum.yuklenen).toHaveLength(0)
  })

  it('dosya seçilmediğinde hata döner', async () => {
    expect((await gorselYukle(null)).error).toBeTruthy()
  })

  it('geçerli görseli yükleyip herkese açık adresi döner', async () => {
    const sonuc = await gorselYukle(sahteDosya('image/jpeg', 2048))
    expect(sonuc.error).toBeUndefined()
    expect(sonuc.url).toMatch(/\/medya\/ekip\/[0-9a-z-]+\.jpg$/)
    expect(durum.yuklenen[0].kova).toBe('medya')
  })

  it('kullanıcının dosya adını yola koymaz', async () => {
    // "../başka klasör/çok kötü ad.png" gibi bir ad yola sızmamalı.
    await gorselYukle(sahteDosya('image/png', 100, '../çok kötü ad.png'))
    expect(durum.yuklenen[0].yol).not.toMatch(/kötü|\.\./)
  })

  it('aynı ada iki kez yüklemede üzerine yazmaz', async () => {
    await gorselYukle(sahteDosya('image/png', 100))
    await gorselYukle(sahteDosya('image/png', 100))
    expect(durum.yuklenen[0].yol).not.toBe(durum.yuklenen[1].yol)
    expect(durum.yuklenen[0].opts.upsert).toBe(false)
  })

  it('oturum düştüğünde yeniden giriş ister', async () => {
    durum.uploadError = { statusCode: '401', message: 'jwt expired' }
    const sonuc = await gorselYukle(sahteDosya('image/png', 100))
    expect(sonuc.needsReauth).toBe(true)
  })
})
