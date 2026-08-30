import { render, screen, act, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Intro, { DECODE_MS, REVEAL_MS } from '../components/layout/Intro'

const STORAGE_KEY = 'decha:intro-seen'

function mockReducedMotion(reduce) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduce,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

afterEach(() => {
  window.sessionStorage.clear()
  document.body.style.overflow = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Intro', () => {
  it('ilk açılışta görünür ve kaydırmayı kilitler', () => {
    mockReducedMotion(false)
    render(<Intro />)

    expect(screen.getByRole('button', { name: /geç/i })).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('aynı oturumda ikinci kez gösterilmez', () => {
    mockReducedMotion(false)
    const first = render(<Intro />)
    expect(screen.getByRole('button', { name: /geç/i })).toBeInTheDocument()
    first.unmount()

    const { container } = render(<Intro />)
    expect(container).toBeEmptyDOMElement()
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBe('1')
  })

  it('hareket azaltma açıkken hiç gösterilmez', () => {
    mockReducedMotion(true)
    const { container } = render(<Intro />)

    expect(container).toBeEmptyDOMElement()
    // Gösterilmediği için kaydırma da kilitlenmemeli.
    expect(document.body.style.overflow).toBe('')
  })

  it('kendiliğinden kapanır ve kaydırmayı serbest bırakır', () => {
    mockReducedMotion(false)
    vi.useFakeTimers()
    const { container } = render(<Intro />)

    // İki adım: önce süpürme fazına geçilir (React yeniden render eder ve
    // kalkış zamanlayıcısını kurar), sonra süpürme süresi ilerletilir.
    act(() => {
      vi.advanceTimersByTime(DECODE_MS + 200)
    })
    act(() => {
      vi.advanceTimersByTime(REVEAL_MS + 100)
    })
    expect(container).toBeEmptyDOMElement()
    expect(document.body.style.overflow).toBe('')
  })

  it('Geç düğmesi paneli süpürme fazına alır', () => {
    mockReducedMotion(false)
    const { container } = render(<Intro />)

    fireEvent.click(screen.getByRole('button', { name: /geç/i }))
    expect(container.querySelector('.intro')).toHaveAttribute('data-phase', 'reveal')
  })

  it('Escape tuşu paneli süpürme fazına alır', () => {
    mockReducedMotion(false)
    const { container } = render(<Intro />)

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(container.querySelector('.intro')).toHaveAttribute('data-phase', 'reveal')
  })
})
