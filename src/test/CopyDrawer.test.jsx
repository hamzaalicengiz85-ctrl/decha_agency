import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const state = { upserts: [], error: null, listRow: null }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn((payload) => ({
        select: vi.fn(() => {
          state.upserts.push(payload)
          return Promise.resolve({ data: null, error: state.error })
        }),
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: state.listRow, error: null })),
        })),
      })),
    })),
  },
}))

const CopyDrawer = (await import('../components/admin/CopyDrawer')).default

beforeEach(() => {
  state.upserts = []
  state.error = null
  state.listRow = null
})

describe('CopyDrawer', () => {
  it('metin düzenlemesini site_copy tablosuna yazar', async () => {
    const applied = []
    render(
      <CopyDrawer
        picked={{ copyKey: 'home.hero.baslik', text: 'Eski başlık' }}
        inventory={[]}
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
        inventory={[]}
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
        inventory={[]}
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

  it('hiçbir şey seçili değilken sayfa metinleri listesini gösterir', () => {
    render(
      <CopyDrawer
        picked={null}
        inventory={[{ copyKey: 'home.hero.durum', text: 'Kayıt açık' }]}
      />,
    )
    expect(screen.getByText(/1 düzenlenebilir metin var/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kayıt açık' })).toBeInTheDocument()
  })

  it('yazma hatasını gösterir', async () => {
    state.error = { message: 'izin yok' }
    render(<CopyDrawer picked={{ copyKey: 'x', text: 'a' }} inventory={[]} />)
    fireEvent.click(screen.getByRole('button', { name: /kaydet/i }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/izin yok/i))
  })
})
