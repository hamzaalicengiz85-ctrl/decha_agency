import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

const state = { configured: true, copy: [], lists: [], copyError: null, listError: null, calls: 0 }

vi.mock('../lib/supabase', () => ({
  get isSupabaseConfigured() {
    return state.configured
  },
  supabase: {
    from: vi.fn((table) => ({
      select: vi.fn(() => {
        state.calls += 1
        return table === 'site_copy'
          ? Promise.resolve({ data: state.copy, error: state.copyError })
          : Promise.resolve({ data: state.lists, error: state.listError })
      }),
    })),
  },
}))

const { SiteCopyProvider, Copy } = await import('../lib/siteCopy')

beforeEach(() => {
  state.configured = true
  state.copy = []
  state.lists = []
  state.copyError = null
  state.listError = null
  state.calls = 0
  window.localStorage.clear()
})

function renderCopy(ui) {
  return render(<SiteCopyProvider edit={false}>{ui}</SiteCopyProvider>)
}

describe('Copy', () => {
  it('kayıt yokken koddaki varsayılanı gösterir', async () => {
    renderCopy(<Copy k="home.baslik">Varsayılan başlık</Copy>)
    expect(screen.getByText('Varsayılan başlık')).toBeInTheDocument()
  })

  it('kayıt varsa üzerine yazar', async () => {
    state.copy = [{ key: 'home.baslik', value: 'Panelden gelen' }]
    renderCopy(<Copy k="home.baslik">Varsayılan başlık</Copy>)
    expect(await screen.findByText('Panelden gelen')).toBeInTheDocument()
  })

  it('boş kayıt varsayılana döner — yanlışlıkla boşaltılan metin kaybolmasın', async () => {
    state.copy = [{ key: 'home.baslik', value: '   ' }]
    renderCopy(<Copy k="home.baslik">Varsayılan başlık</Copy>)
    await waitFor(() => expect(screen.getByText('Varsayılan başlık')).toBeInTheDocument())
  })

  it('normal modda fazladan DOM düğümü eklemez', () => {
    const { container } = renderCopy(
      <p>
        <Copy k="x">Metin</Copy>
      </p>,
    )
    expect(container.querySelectorAll('[data-copy-key]')).toHaveLength(0)
    expect(container.querySelector('p').children).toHaveLength(0)
  })

  it('düzenleme modunda anahtar taşıyan bir kutuya sarar', () => {
    const { container } = render(
      <SiteCopyProvider edit>
        <p>
          <Copy k="home.baslik">Metin</Copy>
        </p>
      </SiteCopyProvider>,
    )
    expect(container.querySelector('[data-copy-key="home.baslik"]')).toBeInTheDocument()
  })
})

describe('SiteCopyProvider', () => {
  it('Supabase yapılandırılmamışsa hiç sorgu yapmaz', async () => {
    state.configured = false
    renderCopy(<Copy k="home.baslik">Varsayılan</Copy>)
    await waitFor(() => expect(screen.getByText('Varsayılan')).toBeInTheDocument())
    expect(state.calls).toBe(0)
  })

  it('bir sorgu düşse de diğeri uygulanır', async () => {
    state.copy = [{ key: 'home.baslik', value: 'Geldi' }]
    state.listError = new Error('liste okunamadı')
    state.lists = null
    renderCopy(<Copy k="home.baslik">Varsayılan</Copy>)
    expect(await screen.findByText('Geldi')).toBeInTheDocument()
  })

  it('iki sorgu da düşerse varsayılanla açılmaya devam eder', async () => {
    state.copy = null
    state.lists = null
    state.copyError = new Error('yok')
    state.listError = new Error('yok')
    renderCopy(<Copy k="home.baslik">Varsayılan</Copy>)
    await waitFor(() => expect(screen.getByText('Varsayılan')).toBeInTheDocument())
  })
})
