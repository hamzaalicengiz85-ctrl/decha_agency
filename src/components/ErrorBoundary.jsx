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
        <div className="surface max-w-lg p-10 text-center">
          <h1 className="text-2xl font-bold text-white">Bir şeyler ters gitti</h1>
          <p className="mt-3 text-sm text-slate-400">
            Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyebilirsiniz.
          </p>
          {import.meta.env.DEV && this.state.error ? (
            <pre className="mt-6 overflow-x-auto rounded-xl bg-black/40 p-4 text-left text-xs text-rose-300">
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-400"
          >
            Sayfayı yenile
          </button>
        </div>
      </div>
    )
  }
}
