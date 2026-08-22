import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom'da tanımlı olmayan / uygulanmayan API'lar için stub'lar
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

// jsdom window.scrollTo'yu "Not implemented" hatasıyla fırlatır.
window.scrollTo = vi.fn()
