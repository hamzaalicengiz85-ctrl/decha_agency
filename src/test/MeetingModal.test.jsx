import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const inserted = []
const state = { error: null, takenRows: [] }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table) => {
      if (table === 'meeting_slots_taken') {
        const chain = {
          select: () => chain,
          eq: () => Promise.resolve({ data: state.takenRows, error: null }),
        }
        return chain
      }
      return {
        insert: (payload) => {
          inserted.push({ table, payload })
          return Promise.resolve({ data: null, error: state.error })
        },
      }
    },
  },
}))

const { default: MeetingModal } = await import('../components/MeetingModal')

/** Belirli bir hafta içi gün (Salı) — tatil değil. */
const WEEKDAY = '2026-09-15'
const SATURDAY = '2026-09-12'
const HOLIDAY = '2026-10-29'

function fillIdentity() {
  fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: 'Ayşe Yılmaz' } })
  fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: 'ayse@ornek.com' } })
  fireEvent.change(screen.getByLabelText(/yer/i), { target: { value: 'our_office' } })
}

const setDate = (value) =>
  fireEvent.change(screen.getByLabelText(/tarih/i), { target: { value } })

const submit = () => fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

beforeEach(() => {
  inserted.length = 0
  state.error = null
  state.takenRows = []
})

describe('MeetingModal — saat tablosu', () => {
  it('tarih seçilmeden saat tablosu gösterilmez', () => {
    render(<MeetingModal open onClose={() => {}} />)
    expect(screen.getByText(/önce uygun bir tarih seçin/i)).toBeInTheDocument()
  })

  it('uygun tarihte dokuz tam saat listeler', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    setDate(WEEKDAY)

    await waitFor(() => expect(screen.getByRole('button', { name: '09:00' })).toBeInTheDocument())
    const slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']
    slots.forEach((slot) => {
      expect(screen.getByRole('button', { name: slot })).toBeInTheDocument()
    })
    // Çalışma saati dışı
    expect(screen.queryByRole('button', { name: '08:00' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '18:00' })).not.toBeInTheDocument()
  })

  it('dolu saatler devre dışı bırakılır', async () => {
    state.takenRows = [{ meeting_time: '14:00:00' }, { meeting_time: '15:00:00' }]
    render(<MeetingModal open onClose={() => {}} />)
    setDate(WEEKDAY)

    await waitFor(() => expect(screen.getByRole('button', { name: '14:00' })).toBeDisabled())
    expect(screen.getByRole('button', { name: '15:00' })).toBeDisabled()
    expect(screen.getByRole('button', { name: '10:00' })).toBeEnabled()
  })

  it('saat seçimi aria-pressed ile işaretlenir', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    setDate(WEEKDAY)
    await waitFor(() => expect(screen.getByRole('button', { name: '11:00' })).toBeEnabled())

    fireEvent.click(screen.getByRole('button', { name: '11:00' }))
    expect(screen.getByRole('button', { name: '11:00' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('gün değişince seçili saat sıfırlanır', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    setDate(WEEKDAY)
    await waitFor(() => expect(screen.getByRole('button', { name: '11:00' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: '11:00' }))

    setDate('2026-09-16')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: '11:00' })).toHaveAttribute('aria-pressed', 'false'),
    )
  })
})

describe('MeetingModal — tarih kuralları', () => {
  it('hafta sonunu reddeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(SATURDAY)
    submit()

    await waitFor(() => expect(screen.getByText(/hafta sonu randevu alınamaz/i)).toBeInTheDocument())
    expect(inserted).toHaveLength(0)
  })

  it('resmî tatili adıyla reddeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(HOLIDAY)
    submit()

    await waitFor(() =>
      expect(screen.getByText(/Cumhuriyet Bayramı nedeniyle kapalıyız/i)).toBeInTheDocument(),
    )
    expect(inserted).toHaveLength(0)
  })
})

describe('MeetingModal — gönderim', () => {
  it('geçerli talebi doğru yükle kaydeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(WEEKDAY)
    await waitFor(() => expect(screen.getByRole('button', { name: '14:00' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: '14:00' }))
    submit()

    await waitFor(() => expect(inserted).toHaveLength(1))
    expect(inserted[0].table).toBe('meeting_requests')
    expect(inserted[0].payload).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@ornek.com',
      meeting_date: WEEKDAY,
      meeting_time: '14:00',
      location: 'our_office',
      notes: null,
    })
    expect(await screen.findByText('Decha Ofis')).toBeInTheDocument()
  })

  it('saat seçilmeden gönderilemez', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(WEEKDAY)
    await waitFor(() => expect(screen.getByRole('button', { name: '09:00' })).toBeInTheDocument())
    submit()

    await waitFor(() => expect(screen.getByText('Saat seçin.')).toBeInTheDocument())
    expect(inserted).toHaveLength(0)
  })

  it('alan düzeltilince önceki hata mesajı kaybolur', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(SATURDAY)
    submit()
    await waitFor(() =>
      expect(screen.getByText('İşaretli alanları kontrol edin.')).toBeInTheDocument(),
    )

    setDate(WEEKDAY)
    await waitFor(() =>
      expect(screen.queryByText('İşaretli alanları kontrol edin.')).not.toBeInTheDocument(),
    )
  })

  it('slot kapılmışsa (23505) anlaşılır mesaj gösterir ve seçimi düşürür', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fillIdentity()
    setDate(WEEKDAY)
    await waitFor(() => expect(screen.getByRole('button', { name: '14:00' })).toBeEnabled())
    fireEvent.click(screen.getByRole('button', { name: '14:00' }))

    const conflict = new Error('duplicate key')
    conflict.code = '23505'
    state.error = conflict
    submit()

    await waitFor(() => expect(screen.getByText(/bu saat az önce doldu/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: '14:00' })).toHaveAttribute('aria-pressed', 'false')
  })
})
