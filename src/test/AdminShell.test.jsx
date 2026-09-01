import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

const state = { rows: {}, error: null }

vi.mock('../lib/supabase', () => {
  const builder = (table) => {
    const chain = {
      select: vi.fn(() => chain),
      order: vi.fn(() => chain),
      then: (resolve, reject) =>
        Promise.resolve({ data: state.rows[table] ?? [], error: state.error }).then(resolve, reject),
    }
    return chain
  }
  return {
    isSupabaseConfigured: true,
    supabase: {
      from: vi.fn((table) => builder(table)),
      auth: { signOut: vi.fn(() => Promise.resolve({ error: null })) },
    },
  }
})

const AdminShell = (await import('../components/admin/AdminShell')).default

beforeEach(() => {
  state.rows = {}
  state.error = null
})

/** Kenar çubuğu — sayfa sekmeleriyle aynı adlar kullanıldığı için kapsamlı sorgu. */
function sidebar() {
  return within(screen.getByRole('navigation'))
}

function renderShell() {
  return render(
    <MemoryRouter>
      <AdminShell email="admin@ornek.com" />
    </MemoryRouter>,
  )
}

describe('AdminShell', () => {
  it('kenar çubuğunda tüm bölümler var', () => {
    renderShell()
    for (const label of ['Sayfalar', 'Hizmetler', 'Projeler', 'Blog yazıları', 'Referanslar', 'Şifre']) {
      expect(sidebar().getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('görsel düzenleme varsayılan bölüm', () => {
    renderShell()
    expect(screen.getByTitle('Sayfa önizlemesi')).toBeInTheDocument()
  })

  it('boş tabloda demo içerik uyarısı verir', async () => {
    // Kritik: panel yerel demo içeriğini asla göstermemeli, yoksa olmayan
    // kaydın üstüne yazılır.
    renderShell()
    fireEvent.click(sidebar().getByRole('button', { name: 'Hizmetler' }))
    expect(await screen.findByText(/yerel demo içeriğini gösteriyor/i)).toBeInTheDocument()
  })

  it('kayıtları listeler', async () => {
    state.rows.services = [{ id: '1', title: 'Web Tasarım', slug: 'web-tasarim' }]
    renderShell()
    fireEvent.click(sidebar().getByRole('button', { name: 'Hizmetler' }))
    expect(await screen.findByText('Web Tasarım')).toBeInTheDocument()
  })

  it('kategori değiştirilebilir', async () => {
    renderShell()
    fireEvent.click(sidebar().getByRole('button', { name: 'Şifre' }))
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /şifre değiştir/i })).toBeInTheDocument(),
    )
    expect(screen.getByLabelText(/mevcut şifre/i)).toBeInTheDocument()
  })

  it('yeni kayıt formu açılır ve zorunlu alanları doğrular', async () => {
    renderShell()
    fireEvent.click(sidebar().getByRole('button', { name: 'Hizmetler' }))
    fireEvent.click(await screen.findByRole('button', { name: /hizmet ekle/i }))

    const submit = await screen.findByRole('button', { name: /oluştur/i })
    fireEvent.click(submit)

    await waitFor(() => expect(screen.getAllByText('Bu alan zorunlu.').length).toBeGreaterThan(0))
  })

  it('okuma hatasını gösterir, sessizce yutmaz', async () => {
    state.error = new Error('izin yok')
    renderShell()
    fireEvent.click(sidebar().getByRole('button', { name: 'Hizmetler' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/izin yok/i)
  })
})
