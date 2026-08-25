import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const inserted = []
const state = { error: null }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table) => ({
      insert: (payload) => {
        inserted.push({ table, payload })
        return Promise.resolve({ data: null, error: state.error })
      },
    }),
  },
}))

const { default: MeetingModal } = await import('../components/MeetingModal')

function futureDate(days = 7) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function pastDate(days = 7) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function fill({ date, time, location }) {
  if (date !== undefined) fireEvent.change(screen.getByLabelText(/tarih/i), { target: { value: date } })
  if (time !== undefined) fireEvent.change(screen.getByLabelText(/saat/i), { target: { value: time } })
  if (location !== undefined)
    fireEvent.change(screen.getByLabelText(/yer/i), { target: { value: location } })
}

beforeEach(() => {
  inserted.length = 0
  state.error = null
})

describe('MeetingModal', () => {
  it('kapalıyken hiçbir şey render etmez', () => {
    render(<MeetingModal open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('açıkken erişilebilir bir pencere olarak açılır', () => {
    render(<MeetingModal open onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('heading', { name: /toplantı planla/i })).toBeInTheDocument()
  })

  it('boş formda üç alan için de hata gösterir', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

    await waitFor(() => expect(screen.getByText('Tarih seçin.')).toBeInTheDocument())
    expect(screen.getByText('Saat seçin.')).toBeInTheDocument()
    expect(screen.getByText('Toplantı yerini yazın.')).toBeInTheDocument()
    expect(inserted).toHaveLength(0)
  })

  it('geçmiş tarihi reddeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fill({ date: pastDate(), time: '14:30', location: 'Levent ofis' })
    fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

    await waitFor(() => expect(screen.getByText('Geçmiş bir tarih seçilemez.')).toBeInTheDocument())
    expect(inserted).toHaveLength(0)
  })

  it('geçerli talebi meeting_requests tablosuna yazar', async () => {
    const date = futureDate()
    render(<MeetingModal open onClose={() => {}} />)
    fill({ date, time: '14:30', location: '  Levent ofis  ' })
    fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

    await waitFor(() => expect(inserted).toHaveLength(1))
    expect(inserted[0].table).toBe('meeting_requests')
    expect(inserted[0].payload).toEqual({
      meeting_date: date,
      meeting_time: '14:30',
      location: 'Levent ofis',
    })

    expect(await screen.findByText(/talep kaydedildi/i)).toBeInTheDocument()
  })

  it('veritabanı hatasında kullanıcıya hata gösterir', async () => {
    state.error = new Error('permission denied')
    render(<MeetingModal open onClose={() => {}} />)
    fill({ date: futureDate(), time: '10:00', location: 'Çevrimiçi' })
    fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

    expect(await screen.findByText(/talep kaydedilemedi/i)).toBeInTheDocument()
  })

  it('Escape tuşu pencereyi kapatır', async () => {
    const onClose = vi.fn()
    render(<MeetingModal open onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
