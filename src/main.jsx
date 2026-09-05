import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { SiteCopyProvider } from './lib/siteCopy'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('#root elementi bulunamadı. index.html kontrol edin.')
}

createRoot(container).render(
  <StrictMode>
    <ErrorBoundary>
      {/* GitHub Pages'te site depo adının altında duruyor; rotalar bu ön ekin
          altından başlamalı. Kök dizinde yayınlanırsa BASE_URL "/" olur ve
          hiçbir şey değişmez. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <SiteCopyProvider>
          <App />
        </SiteCopyProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
