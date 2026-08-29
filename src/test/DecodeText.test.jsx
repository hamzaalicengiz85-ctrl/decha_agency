import { render, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DecodeText from '../components/ui/DecodeText'

const WORDS = ['büyüten', 'yükselten', 'dönüştüren']
const INTERVAL = 5000
const DECODE_MS = 720 // bileşendeki çözülme süresi
const FRAME_MS = 55 // bileşendeki kare süresi

function mockReducedMotion(reduce) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: reduce,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

/** Ekranda görünen (aria-hidden) katmandaki metin. */
function shown(container) {
  return container.querySelector('.text-accent-fg').textContent
}

function setup({ reduce = false } = {}) {
  mockReducedMotion(reduce)
  vi.useFakeTimers()
  const view = render(<DecodeText words={WORDS} interval={INTERVAL} />)
  act(() => {
    vi.advanceTimersByTime(DECODE_MS + 100)
  })
  return view
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('DecodeText', () => {
  it('ilk kelimeyle başlar', () => {
    const { container } = setup()
    expect(shown(container)).toBe(WORDS[0])
  })

  it('ekran okuyucuya sabit metin sunar, animasyonlu katmanı gizler', () => {
    const { container } = setup()
    // Erişilebilir ad hesabına giren tek metin ilk kelime olmalı.
    const visibleToAT = [...container.querySelectorAll('span')]
      .filter((el) => el.getAttribute('aria-hidden') !== 'true' && !el.querySelector('span'))
      .map((el) => el.textContent)
    expect(visibleToAT).toEqual([WORDS[0]])
    expect(container.querySelector('.text-accent-fg')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('.bg-accent')).toHaveAttribute('aria-hidden', 'true')
  })

  it('her aralıkta bir sonraki kelimeye geçer ve başa döner', () => {
    const { container } = setup()

    for (const expected of [WORDS[1], WORDS[2], WORDS[0]]) {
      // Önce sıradaki kelimeye geçilir (React yeniden render eder ve çözülme
      // efektini kurar), ardından çözülme süresi ilerletilir. Tek adımda
      // ilerletilirse yeni efekt hiç tik almadan zaman tükenir.
      act(() => {
        vi.advanceTimersByTime(INTERVAL)
      })
      act(() => {
        vi.advanceTimersByTime(DECODE_MS + 100)
      })
      expect(shown(container)).toBe(expected)
    }
  })

  it('karışma boyunca hedef kelimenin harflerini birebir korur', () => {
    // Bu, turuncu kutunun kelimeye tam oturmasının dayanağı: karışan metin
    // hedefin permütasyonu olduğu için toplam genişlik hiç değişmez.
    const { container } = setup()
    const sorted = (value) => [...value].sort().join('')

    act(() => {
      vi.advanceTimersByTime(INTERVAL)
    })

    for (let elapsed = 0; elapsed < DECODE_MS; elapsed += FRAME_MS) {
      act(() => {
        vi.advanceTimersByTime(FRAME_MS)
      })
      const frame = shown(container)
      expect(frame).toHaveLength(WORDS[1].length)
      expect(sorted(frame)).toBe(sorted(WORDS[1]))
    }
  })

  it('kelime değişir değişmez metni de tazeler', () => {
    // Kutu genişliği boyama öncesi hesaplandığı için metin bir kare geride
    // kalırsa eski kelime kutunun dışına taşar. Metin, ilk tik beklenmeden
    // yeni kelimeye geçmeli.
    const { container } = setup()

    act(() => {
      vi.advanceTimersByTime(INTERVAL)
    })

    const sorted = (value) => [...value].sort().join('')
    expect(sorted(shown(container))).toBe(sorted(WORDS[1]))
  })

  it('hareket azaltma açıkken kelime hiç değişmez', () => {
    const { container } = setup({ reduce: true })

    act(() => {
      vi.advanceTimersByTime(INTERVAL * 3)
    })
    expect(shown(container)).toBe(WORDS[0])
  })
})
