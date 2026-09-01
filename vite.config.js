import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_SITE_URL = 'https://decha-agency.netlify.app'

/**
 * index.html'deki mutlak adresleri (canonical, og:url, og:image, JSON-LD)
 * tek bir yerden yazar. Özel alan adı bağlandığında Netlify'da
 * VITE_SITE_URL tanımlamak yetiyor; HTML'e elle dokunmak gerekmiyor.
 */
function siteUrlHtml(siteUrl) {
  return {
    name: 'decha-site-url',
    // 'pre': Vite'ın kendi HTML işleyicisi href'leri decodeURI'den geçiriyor;
    // yer tutucu ondan önce gerçek adresle değişmeli.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', siteUrl),
    },
  }
}

/**
 * Statik rotalar. Proje ve blog detayları Supabase'den geldiği için burada
 * sayılmaz — içerikleri yayın anında bilinmiyor.
 */
const ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/hizmetler', priority: '0.9', changefreq: 'monthly' },
  { path: '/projeler', priority: '0.9', changefreq: 'weekly' },
  { path: '/hakkimizda', priority: '0.7', changefreq: 'yearly' },
  { path: '/blog', priority: '0.7', changefreq: 'weekly' },
  { path: '/iletisim', priority: '0.8', changefreq: 'yearly' },
  { path: '/gizlilik', priority: '0.3', changefreq: 'yearly' },
]

/**
 * robots.txt ve sitemap.xml'i derleme anında üretir. İkisi de mutlak adres
 * içeriyor; elle tutulan kopyalar alan adı değişince sessizce yanlış kalırdı.
 */
function seoFiles(siteUrl) {
  const today = new Date().toISOString().slice(0, 10)

  return {
    name: 'decha-seo-files',
    apply: 'build',
    generateBundle() {
      const urls = ROUTES.map(
        (route) =>
          `  <url><loc>${siteUrl}${route.path}</loc>` +
          `<lastmod>${today}</lastmod>` +
          `<changefreq>${route.changefreq}</changefreq>` +
          `<priority>${route.priority}</priority></url>`,
      ).join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Allow: /',
          '',
          '# Yönetim paneli dizine girmemeli.',
          'Disallow: /yonetim',
          '',
          `Sitemap: ${siteUrl}/sitemap.xml`,
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')

  return {
  plugins: [react(), siteUrlHtml(siteUrl), seoFiles(siteUrl)],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, 'src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
  }
})
