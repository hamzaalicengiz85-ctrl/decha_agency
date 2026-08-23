import Button from '../components/ui/Button'
import Crt from '../components/ui/Crt'
import Stamp from '../components/ui/Stamp'
import { usePageMeta } from '../lib/seo'

export default function NotFound() {
  usePageMeta({ title: '404 — Kayıt bulunamadı' })

  return (
    <div className="container py-14">
      <Crt label="Hata · Kanal 404" channel="KAYIT YOK">
        <div className="flex min-h-[52vh] flex-col items-center justify-center px-6 py-16 text-center">
          <Stamp>Dosya kapalı</Stamp>
          <p className="phosphor num mt-8 font-display text-6xl font-bold text-accent sm:text-7xl">
            404
          </p>
          <h1 className="mt-5 font-display text-headline font-bold uppercase">
            Aradığınız kayıt bulunamadı
          </h1>
          <p className="mt-4 max-w-md font-mono text-[13px] leading-relaxed text-fg-muted">
            Bağlantı hatalı olabilir ya da dosya arşivden kaldırılmış olabilir.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/">Ana kayda dön</Button>
            <Button to="/iletisim" variant="panel">
              Büroya danış
            </Button>
          </div>
        </div>
      </Crt>
    </div>
  )
}
