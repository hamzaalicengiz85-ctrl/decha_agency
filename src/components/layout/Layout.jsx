import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import TvShell from './TvShell'
import { Spinner } from '../ui/Loader'

export default function Layout() {
  return (
    <>
      <TvShell />
      <ScrollToTop />

      {/* Ekranın içi: sayfa burada akar */}
      <div className="relative z-10 flex min-h-screen flex-col px-[var(--bz-x)] pb-[var(--bz-b)] pt-[var(--bz-t)]">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-8 focus:top-8 focus:z-[80] focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-medium focus:uppercase focus:text-accent-fg"
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
