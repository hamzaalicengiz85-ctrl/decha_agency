import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

const { default: ContactForm } = await import('../components/ContactForm')

function fillValidForm() {
  fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: '  Ayşe Yılmaz  ' } })
  fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: 'AYSE@Ornek.COM' } })
  fireEvent.change(screen.getByLabelText(/telefon/i), { target: { value: '0212 000 00 00' } })
  fireEvent.change(screen.getByLabelText(/projeniz/i), {
    target: { value: 'Kurumsal sitemizi yenilemek istiyoruz.' },
  })
  fireEvent.click(screen.getByRole('checkbox'))
}

beforeEach(() => {
  inserted.length = 0
  state.error = null
})

describe('ContactForm — Supabase gönderimi', () => {
  it('geçerli formu contact_messages tablosuna yazar', async () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: /mesajı gönder/i }))

    await waitFor(() => expect(inserted).toHaveLength(1))

    expect(inserted[0].table).toBe('contact_messages')
    // boşluklar kırpılır, e-posta küçük harfe çevrilir, boş alanlar null gider
    expect(inserted[0].payload).toMatchObject({
      name: 'Ayşe Yılmaz',
      email: 'ayse@ornek.com',
      phone: '0212 000 00 00',
      company: null,
      service: null,
      budget: null,
      message: 'Kurumsal sitemizi yenilemek istiyoruz.',
    })

    expect(await screen.findByText(/Mesajınız bize ulaştı/i)).toBeInTheDocument()
    // başarıdan sonra form temizlenir
    expect(screen.getByLabelText(/ad soyad/i)).toHaveValue('')
  })

  it('veritabanı hatasında kullanıcıya hata mesajı gösterir', async () => {
    state.error = new Error('permission denied')

    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    fillValidForm()
    fireEvent.click(screen.getByRole('button', { name: /mesajı gönder/i }))

    expect(await screen.findByText(/Mesaj gönderilemedi/i)).toBeInTheDocument()
  })

  it('bal küpü doluysa hiçbir şey yazmaz', async () => {
    // Gerçek kullanıcı bu alanı göremez; dolduysa gönderen bir bottur.
    // Bota yakalandığını söylememek için ekranda başarı gösterilir.
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>,
    )
    fillValidForm()
    fireEvent.change(document.getElementById('website'), { target: { value: 'http://spam' } })
    fireEvent.click(screen.getByRole('button', { name: /mesajı gönder/i }))

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/ulaştı/i))
    expect(inserted).toHaveLength(0)
  })
})
