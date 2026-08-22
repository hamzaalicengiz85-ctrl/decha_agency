import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ContactForm from '../components/ContactForm'

function setup() {
  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ContactForm />
    </MemoryRouter>,
  )
}

describe('ContactForm', () => {
  it('boş formda doğrulama hatası gösterir', async () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /mesajı gönder/i }))

    await waitFor(() => {
      expect(screen.getByText('Lütfen adınızı girin.')).toBeInTheDocument()
    })
    expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument()
    expect(screen.getByText('Mesajınız en az 10 karakter olmalı.')).toBeInTheDocument()
  })

  it('geçersiz e-posta formatını yakalar', async () => {
    setup()
    fireEvent.change(screen.getByLabelText(/ad soyad/i), { target: { value: 'Ali Veli' } })
    fireEvent.change(screen.getByLabelText(/e-posta/i), { target: { value: 'gecersiz' } })
    fireEvent.change(screen.getByLabelText(/projeniz/i), {
      target: { value: 'Yeni bir web sitesi istiyoruz.' },
    })
    fireEvent.click(screen.getByRole('button', { name: /mesajı gönder/i }))

    await waitFor(() => {
      expect(screen.getByText('Geçerli bir e-posta adresi girin.')).toBeInTheDocument()
    })
    expect(screen.queryByText('Lütfen adınızı girin.')).not.toBeInTheDocument()
  })
})
