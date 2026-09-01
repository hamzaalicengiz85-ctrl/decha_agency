import { describe, expect, it, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}))

const Footer = (await import('../components/layout/Footer')).default

function renderFooter() {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Footer />} />
        <Route path="/yonetim" element={<p>Yönetim ekranı</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Gizli yönetim girişi', () => {
  it('telif satırına üç kez tıklayınca panele gider', () => {
    renderFooter()
    const line = screen.getByText(/Tüm kayıtlar saklıdır/i)

    fireEvent.click(line, { detail: 3 })

    expect(screen.getByText('Yönetim ekranı')).toBeInTheDocument()
  })

  it('bir ve iki tıklamada hiçbir şey olmaz', () => {
    renderFooter()
    const line = screen.getByText(/Tüm kayıtlar saklıdır/i)

    fireEvent.click(line, { detail: 1 })
    fireEvent.click(line, { detail: 2 })

    expect(screen.queryByText('Yönetim ekranı')).not.toBeInTheDocument()
  })
})
