import { render, screen, act, fireEvent } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Intro, { DECODE_MS, LOCK_MS, REVEAL_MS, SHORT_REVEAL_MS, HOLD_MS } from '../components/layout/Intro'

const SESSION_KEY = 'decha:intro-session'
const VISITOR_KEY = 'decha:intro-seen'

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
  window.localStorage.clear()
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
    expect(window.sessionStorage.getItem(SESSION_KEY)).toBe('1')
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

    // Aşama aşama: her geçişte React yeniden render edip bir sonraki
    // zamanlayıcıyı kuruyor, tek adımda ilerletilirse zincir kopar.
    act(() => {
      vi.advanceTimersByTime(DECODE_MS + 200)
    })
    expect(container.querySelector('.intro')).toHaveAttribute('data-phase', 'lock')

    act(() => {
      vi.advanceTimersByTime(LOCK_MS + 50)
    })
    expect(container.querySelector('.intro')).toHaveAttribute('data-phase', 'reveal')

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

  it('ilk ziyarette tam, sonraki ziyarette kısa biçimde açılır', () => {
    mockReducedMotion(false)

    const first = render(<Intro />)
    expect(first.container.querySelector('.intro')).toHaveAttribute('data-mode', 'full')
    expect(first.container.querySelector('.intro')).toHaveAttribute('data-phase', 'decode')
    first.unmount()

    // Yeni oturum, aynı ziyaretçi: localStorage izi duruyor.
    window.sessionStorage.clear()
    const second = render(<Intro />)
    expect(second.container.querySelector('.intro')).toHaveAttribute('data-mode', 'short')
    expect(second.container.querySelector('.intro')).toHaveAttribute('data-phase', 'hold')
    expect(window.localStorage.getItem(VISITOR_KEY)).toBe('1')
  })

  it('kısa biçim daha erken kapanır', () => {
    mockReducedMotion(false)
    window.localStorage.setItem(VISITOR_KEY, '1')
    vi.useFakeTimers()
    const { container } = render(<Intro />)

    act(() => {
      vi.advanceTimersByTime(HOLD_MS + 20)
    })
    expect(container.querySelector('.intro')).toHaveAttribute('data-phase', 'reveal')

    act(() => {
      vi.advanceTimersByTime(SHORT_REVEAL_MS + 20)
    })
    expect(container).toBeEmptyDOMElement()
  })

  it('her açılışta bir dosya numarası gösterir', () => {
    mockReducedMotion(false)
    render(<Intro />)

    expect(screen.getByText(/Dosya No:\s*\d{4}-[A-Z]/)).toBeInTheDocument()
  })
})
