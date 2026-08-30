import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import ScreenFx from './ScreenFx'
import Intro from './Intro'
import Rail from './Rail'
import Hud from './Hud'
import { Spinner } from '../ui/Loader'

export default function Layout() {
  return (
    <>
      {/* Sekme sırasında en başta dursun: "Geç" düğmesine ilk Tab ile ulaşılır. */}
      <Intro />

      <ScreenFx />
      <Rail />
      <Hud />
      <ScrollToTop />

      <div className="relative z-10 flex min-h-screen flex-col pl-[var(--rail-w)] pb-[calc(var(--hud-h)+8px)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[80] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-medium focus:uppercase focus:text-accent-fg"
        >
          İçeriğe geç
        </a>

        <Navbar />

        <main id="main" className="flex-1 pt-14 sm:pt-16">
          <Suspense
            fallback={
              <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>

        <Footer />
      </div>
    </>
  )
}
