import { Component } from 'react'

/** Beklenmeyen render hatalarında beyaz ekran yerine anlamlı bir ekran gösterir. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass max-w-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-fg">Bir şeyler ters gitti</h1>
          <p className="mt-3 text-sm text-fg-muted">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilirsiniz.
          </p>
          {import.meta.env.DEV && this.state.error ? (
            <pre className="mt-6 overflow-x-auto rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4 text-left text-xs text-red-500">
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-fg transition hover:brightness-110"
          >
            Sayfayı yenile
          </button>
        </div>
      </div>
    )
  }
}
