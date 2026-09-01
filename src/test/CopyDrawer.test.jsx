import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const state = { upserts: [], updates: [], error: null, listRow: null, record: null }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn((table) => ({
      upsert: vi.fn((payload) => ({
        select: vi.fn(() => {
          state.upserts.push(payload)
          return Promise.resolve({ data: null, error: state.error })
        }),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() =>
            Promise.resolve({ data: table === 'site_lists' ? state.listRow : state.record, error: null }),
          ),
        })),
      })),
      update: vi.fn((payload) => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => {
            state.updates.push({ table, payload })
            return Promise.resolve({ data: null, error: state.error })
          }),
        })),
      })),
    })),
  },
}))

const CopyDrawer = (await import('../components/admin/CopyDrawer')).default

beforeEach(() => {
  state.upserts = []
  state.updates = []
  state.error = null
  state.listRow = null
  state.record = null
})

describe('CopyDrawer', () => {
  it('metin düzenlemesini site_copy tablosuna yazar', async () => {
    const applied = []
    render(
      <CopyDrawer
        picked={{ copyKey: 'home.hero.baslik', text: 'Eski başlık' }}
        onApplied={(payload) => applied.push(payload)}
      />,
    )

    const box = screen.getByLabelText('Metin')
    expect(box).toHaveValue('Eski başlık')
    fireEvent.change(box, { target: { value: 'Yeni başlık' } })
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => expect(state.upserts).toHaveLength(1))
    expect(state.upserts[0]).toMatchObject({ key: 'home.hero.baslik', value: 'Yeni başlık' })
    // Önizleme yenilenmeden tazelensin diye anlık uygulama da gitmeli.
    expect(applied[0]).toMatchObject({ key: 'home.hero.baslik', value: 'Yeni başlık' })
  })

  it('liste öğesinde yalnızca seçilen alanı değiştirir', async () => {
    // Kritik: ekranda görünmeyen alanlar (ilke simgesi) korunmalı.
    state.listRow = {
      items: [
        { icon: 'compass', title: 'Önce hedef', text: 'Eski metin' },
        { icon: 'shield', title: 'Şeffaflık', text: 'Diğer' },
      ],
    }

    render(
      <CopyDrawer
        picked={{ listKey: 'hakkimizda.ilkeler', listIndex: '0', listField: 'text', text: 'Eski metin' }}
      />,
    )

    const box = await screen.findByLabelText('Metin')
    fireEvent.change(box, { target: { value: 'Yeni metin' } })
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => expect(state.upserts).toHaveLength(1))
    const saved = state.upserts[0].items
    expect(saved[0]).toEqual({ icon: 'compass', title: 'Önce hedef', text: 'Yeni metin' })
    expect(saved[1]).toEqual({ icon: 'shield', title: 'Şeffaflık', text: 'Diğer' })
  })

  it('kayıt yoksa koddaki varsayılan listeden başlar', async () => {
    state.listRow = null // site_lists'te satır yok
    render(
      <CopyDrawer
        picked={{ listKey: 'hakkimizda.ekip', listIndex: '1', listField: 'role', text: 'Teknoloji Direktörü' }}
      />,
    )

    fireEvent.change(await screen.findByLabelText('Metin'), { target: { value: 'CTO' } })
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => expect(state.upserts).toHaveLength(1))
    const saved = state.upserts[0].items
    expect(saved).toHaveLength(4) // varsayılan ekip listesi
    expect(saved[1].role).toBe('CTO')
    expect(saved[1].name).toBe('Cem Arslan') // diğer alan korundu
  })

  it('hiçbir şey seçili değilken yönlendirme gösterir', () => {
    render(<CopyDrawer picked={null} />)
    expect(screen.getByText(/içerik ağacından bir öğe seçin/i)).toBeInTheDocument()
  })

  it('yazma hatasını gösterir', async () => {
    state.error = { message: 'izin yok' }
    render(<CopyDrawer picked={{ copyKey: 'x', text: 'a' }} />)
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/izin yok/i))
  })

  it('kayıt kartına tıklayınca kaydı aynı yerde düzenletir', async () => {
    // Kullanıcıyı kenar menüsüne göndermek yerine çekmecede açılmalı.
    state.record = { id: 'abc', title: 'Web Tasarım', slug: 'web-tasarim', features: [] }

    render(
      <CopyDrawer picked={{ rec: 'services:abc' }} />,
    )

    const titleField = await screen.findByLabelText(/başlık/i)
    expect(titleField).toHaveValue('Web Tasarım')

    fireEvent.change(titleField, { target: { value: 'Web Tasarımı' } })
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))

    await waitFor(() => expect(state.updates).toHaveLength(1))
    expect(state.updates[0].table).toBe('services')
    expect(state.updates[0].payload.title).toBe('Web Tasarımı')
  })
})
