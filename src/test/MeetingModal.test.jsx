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

function shiftDate(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function fill(overrides = {}) {
  const values = {
    name: 'Ayşe Yılmaz',
    email: 'AYSE@Ornek.COM',
    date: shiftDate(7),
    time: '14:30',
    location: 'our_office',
    notes: '',
    ...overrides,
  }
  fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: values.name } })
  fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: values.email } })
  fireEvent.change(screen.getByLabelText(/tarih/i), { target: { value: values.date } })
  fireEvent.change(screen.getByLabelText(/saat/i), { target: { value: values.time } })
  fireEvent.change(screen.getByLabelText(/yer/i), { target: { value: values.location } })
  if (values.notes) {
    fireEvent.change(screen.getByLabelText(/açıklama/i), { target: { value: values.notes } })
  }
  return values
}

const submit = () => fireEvent.click(screen.getByRole('button', { name: /toplantıyı planla/i }))

beforeEach(() => {
  inserted.length = 0
  state.error = null
})

describe('MeetingModal', () => {
  it('kapalıyken hiçbir şey render etmez', () => {
    render(<MeetingModal open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('erişilebilir bir pencere olarak açılır', () => {
    render(<MeetingModal open onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('heading', { name: /toplantı planla/i })).toBeInTheDocument()
  })

  it('yer alanı üç seçenek sunar', () => {
    render(<MeetingModal open onClose={() => {}} />)
    const select = screen.getByLabelText(/yer/i)
    const labels = [...select.querySelectorAll('option')].map((o) => o.textContent)
    expect(labels).toEqual(['Seçiniz', 'Online', 'Müşterinin yeri', 'Bizim ofisimiz'])
  })

  it('boş formda zorunlu beş alan için hata gösterir', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    submit()

    await waitFor(() => expect(screen.getByText('Adınızı girin.')).toBeInTheDocument())
    expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument()
    expect(screen.getByText('Tarih seçin.')).toBeInTheDocument()
    expect(screen.getByText('Saat seçin.')).toBeInTheDocument()
    expect(screen.getByText('Toplantı yerini seçin.')).toBeInTheDocument()
    expect(inserted).toHaveLength(0)
  })

  it('açıklama zorunlu değildir', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fill({ notes: '' })
    submit()

    await waitFor(() => expect(inserted).toHaveLength(1))
    expect(inserted[0].payload.notes).toBeNull()
  })

  it('geçmiş tarihi reddeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fill({ date: shiftDate(-3) })
    submit()

    await waitFor(() => expect(screen.getByText('Geçmiş bir tarih seçilemez.')).toBeInTheDocument())
    expect(inserted).toHaveLength(0)
  })

  it('geçersiz e-postayı reddeder', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    fill({ email: 'gecersiz' })
    submit()

    await waitFor(() =>
      expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument(),
    )
    expect(inserted).toHaveLength(0)
  })

  it('geçerli talebi meeting_requests tablosuna yazar', async () => {
    render(<MeetingModal open onClose={() => {}} />)
    const values = fill({ name: '  Ayşe Yılmaz  ', notes: '  Yeni site projesi  ' })
    submit()

    await waitFor(() => expect(inserted).toHaveLength(1))
    expect(inserted[0].table).toBe('meeting_requests')
    expect(inserted[0].payload).toEqual({
      name: 'Ayşe Yılmaz',
      email: 'ayse@ornek.com',
      meeting_date: values.date,
      meeting_time: '14:30',
      location: 'our_office',
      notes: 'Yeni site projesi',
    })

    expect(await screen.findByText(/talep kaydedildi/i)).toBeInTheDocument()
    expect(screen.getByText('Bizim ofisimiz')).toBeInTheDocument()
  })

  it('veritabanı hatasında kullanıcıya hata gösterir', async () => {
    state.error = new Error('permission denied')
    render(<MeetingModal open onClose={() => {}} />)
    fill()
    submit()

    expect(await screen.findByText(/talep kaydedilemedi/i)).toBeInTheDocument()
  })

  it('Escape tuşu pencereyi kapatır', async () => {
    const onClose = vi.fn()
    render(<MeetingModal open onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })
})
