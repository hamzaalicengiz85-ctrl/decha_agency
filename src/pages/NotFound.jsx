import Button from '../components/ui/Button'
import { usePageMeta } from '../lib/seo'

export default function NotFound() {
  usePageMeta({ title: '404 — Sayfa bulunamadı' })

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-display text-7xl font-semibold text-accent sm:text-8xl">404</p>
      <h1 className="mt-6 text-3xl font-bold">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-4 max-w-md text-fg-muted">
        Bağlantı hatalı olabilir ya da sayfa taşınmış olabilir. Ana sayfadan devam edebilirsiniz.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Button to="/">Ana sayfaya dön</Button>
        <Button to="/iletisim" variant="secondary">
          Bize ulaşın
        </Button>
      </div>
    </div>
  )
}
