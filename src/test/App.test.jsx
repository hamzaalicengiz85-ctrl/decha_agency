import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

function renderAt(path) {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>,
  )
}

describe('App yönlendirme', () => {
  it('ana sayfayı render eder', async () => {
    renderAt('/')
    expect(
      await screen.findByRole('heading', { level: 1, name: /büyüten/i }),
    ).toBeInTheDocument()
  })

  it('bilinmeyen rotada 404 gösterir', async () => {
    renderAt('/olmayan-sayfa')
    expect(await screen.findByText('404')).toBeInTheDocument()
  })
})
