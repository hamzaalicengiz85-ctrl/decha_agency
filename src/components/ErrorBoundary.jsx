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
        <div className="panel max-w-lg p-10 text-center">
          <h1 className="font-display text-[20px] font-bold uppercase text-accent">Bir şeyler ters gitti</h1>
          <p className="mt-3 text-sm text-fg-muted">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilirsiniz.
          </p>
          {import.meta.env.DEV && this.state.error ? (
            <pre className="mt-6 overflow-x-auto rounded-none border border-danger/40 bg-danger/[0.08] p-4 text-left text-xs text-danger">
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-fg transition hover:brightness-110"
          >
            Sayfayı yenile
          </button>
        </div>
      </div>
    )
  }
}
