import Button from '../components/ui/Button'
import Stamp from '../components/ui/Stamp'
import { usePageMeta } from '../lib/seo'
import { Copy } from '../lib/siteCopy'

export default function NotFound() {
  usePageMeta({ title: '404 — Kayıt bulunamadı' })

  return (
    <div className="container py-14">
      <div className="flex min-h-[52vh] flex-col items-center justify-center px-6 py-16 text-center">
          <Stamp><Copy k="404.damga">Dosya kapalı</Copy></Stamp>
          <p className="phosphor num mt-8 font-display text-6xl font-bold text-accent sm:text-7xl">
            404
          </p>
          <h1 className="mt-5 font-display text-headline font-bold uppercase text-accent">
            <Copy k="404.baslik">Aradığınız kayıt bulunamadı</Copy>
          </h1>
          <p className="mt-4 max-w-md font-mono text-[13px] leading-relaxed text-fg-muted">
            Bağlantı hatalı olabilir ya da dosya arşivden kaldırılmış olabilir.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/"><Copy k="404.buton1">Ana kayda dön</Copy></Button>
            <Button to="/iletisim" variant="panel">
              <Copy k="404.buton2">Büroya danış</Copy>
            </Button>
          </div>
      </div>
    </div>
  )
}
