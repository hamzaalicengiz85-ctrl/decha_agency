import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

/**
 * İçerik tabloları boşken ziyaretçi bomboş bir bölüm değil, "çok yakında"
 * mesajı görmeli. Yedek içeriğe düşmediğimiz için bu kutular tek uyarıdır.
 */
const state = { rows: [] }

vi.mock('../lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: () => {
      const chain = {
        select: () => chain,
        eq: () => chain,
        order: () => chain,
        limit: () => chain,
        then: (resolve) => resolve({ data: state.rows, error: null }),
      }
      return chain
    },
  },
}))

const { default: Home } = await import('../pages/Home')
const { default: Services } = await import('../pages/Services')
const { default: Work } = await import('../pages/Work')
const { default: Blog } = await import('../pages/Blog')

function draw(Page) {
  return render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  state.rows = []
})

describe('İçerik yokken "çok yakında" mesajı', () => {
  it('ana sayfada hizmet, proje ve referans bölümlerinde çıkar', async () => {
    draw(Home)
    await waitFor(() => expect(screen.getAllByText('Çok yakında sizlerle')).toHaveLength(3))
    expect(screen.getByText('Hizmet kataloğumuz hazırlanıyor.')).toBeInTheDocument()
    expect(screen.getByText('Müşteri görüşlerimiz yakında burada olacak.')).toBeInTheDocument()
    // Boş bölüm "Arşiv" değil "Hazırlanıyor" der; ikisi karışırsa site bozuk görünür.
    expect(screen.getAllByText('Hazırlanıyor')).toHaveLength(3)
  })

  it('hizmetler sayfasında çıkar', async () => {
    draw(Services)
    await waitFor(() => expect(screen.getByText('Çok yakında sizlerle')).toBeInTheDocument())
  })

  it('blog sayfasında çıkar', async () => {
    draw(Blog)
    await waitFor(() => expect(screen.getByText('Çok yakında sizlerle')).toBeInTheDocument())
  })

  it('projeler sayfasında çıkar ve filtre satırı gizlenir', async () => {
    draw(Work)
    await waitFor(() => expect(screen.getByText('Çok yakında sizlerle')).toBeInTheDocument())
    // Tek başına "Tümü" düğmesi göstermenin anlamı yok.
    expect(screen.getByText('Sınıflandırma:').closest('div')).not.toBeVisible()
  })

  it('proje varken filtre boş dönerse farklı mesaj verir', async () => {
    state.rows = [
      { id: '1', slug: 'a', title: 'A Projesi', category: 'Web', year: 2025, summary: 's', tags: [], metrics: [] },
    ]
    draw(Work)

    await waitFor(() => expect(screen.getByText('A Projesi')).toBeInTheDocument())
    // Kayıt var: "çok yakında" değil, filtre uyarısı gösterilmeli.
    expect(screen.queryByText('Çok yakında sizlerle')).not.toBeInTheDocument()
    expect(screen.getByText('Sınıflandırma:').closest('div')).toBeVisible()
  })
})
