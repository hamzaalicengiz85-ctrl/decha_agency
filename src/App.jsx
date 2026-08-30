import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

// Ana sayfa dışındaki rotalar tembel yüklenir: ilk açılış paketi küçük kalır.
const Services = lazy(() => import('./pages/Services'))
const Work = lazy(() => import('./pages/Work'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))
// Yönetim paneli site kabuğunun dışında: menü, footer ve giriş animasyonu yok.
const Admin = lazy(() => import('./pages/Admin'))

function AdminSuspense() {
  return (
    <Suspense fallback={null}>
      <Admin />
    </Suspense>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Layout'un dışında kardeş rota. React Router sabit segmenti Layout
          içindeki path="*" NotFound'dan önce sıralar, çakışma olmaz. */}
      <Route path="yonetim" element={<AdminSuspense />} />

      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hizmetler" element={<Services />} />
        <Route path="projeler" element={<Work />} />
        <Route path="projeler/:slug" element={<ProjectDetail />} />
        <Route path="hakkimizda" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="iletisim" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
