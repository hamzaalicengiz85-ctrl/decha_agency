import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_SITE_URL = 'https://decha-agency.netlify.app'

/**
 * GitHub Pages'te site kök dizinde değil, depo adının altında yayınlanıyor
 * (…github.io/decha_agency/). Varlık adresleri ve rota tabanı bu ön eki
 * bilmek zorunda; ikisi de buradan besleniyor.
 */
function normalizeBase(value) {
  const raw = (value ?? '').trim()
  if (!raw || raw === '/') return '/'
  return `/${raw.replace(/^\/+|\/+$/g, '')}/`
}

/**
 * index.html'deki mutlak adresleri (canonical, og:url, og:image, JSON-LD)
 * tek bir yerden yazar. Özel alan adı bağlandığında Netlify'da
 * VITE_SITE_URL tanımlamak yetiyor; HTML'e elle dokunmak gerekmiyor.
 */
function siteUrlHtml(siteUrl, base) {
  // __SITE_URL__ taban ön ekini de içerir; index.html'de hep "__SITE_URL__/…"
  // biçiminde kullanıldığı için sondaki eğik çizgi burada atılıyor.
  const publicUrl = `${siteUrl}${base}`.replace(/\/+$/, '')

  return {
    name: 'decha-site-url',
    // 'pre': Vite'ın kendi HTML işleyicisi href'leri decodeURI'den geçiriyor;
    // yer tutucu ondan önce gerçek adresle değişmeli.
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replaceAll('__SITE_URL__', publicUrl).replaceAll('__BASE__', base),
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
 * GitHub Pages çıktısı.
 *
 * Pages'te sunucu tarafı yönlendirme yok: /hizmetler adresini doğrudan açan
 * ziyaretçi normalde 404 alır. İki katmanlı çözüm:
 *
 *  1. Bilinen her statik rota için `<rota>/index.html` yazılır. Pages bunu
 *     200 ile sunar; arama motoru da 404 değil gerçek sayfa görür. Kopyanın
 *     canonical ve og:url etiketleri o rotanın adresine çevrilir, yoksa her
 *     sayfa kendini ana sayfa ilan ederdi.
 *  2. Kalan her şey (blog/proje detayları) 404.html'e düşer; içerik yine
 *     çizilir çünkü dosya index.html'in aynısıdır. Yalnız HTTP durumu 404
 *     kalır — Pages'te bunu değiştirmenin yolu yok.
 *
 * .nojekyll: Pages varsayılan olarak Jekyll'den geçiriyor ve alt çizgiyle
 * başlayan dosyaları atıyor.
 */
function githubPagesFiles(publicUrl) {
  const retarget = (html, url) =>
    html
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)

  return {
    name: 'decha-github-pages',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const indexHtml = bundle['index.html']
      if (indexHtml?.source) {
        const html = String(indexHtml.source)
        this.emitFile({ type: 'asset', fileName: '404.html', source: html })

        for (const route of ROUTES) {
          if (route.path === '/') continue
          const slug = route.path.replace(/^\//, '')
          this.emitFile({
            type: 'asset',
            fileName: `${slug}/index.html`,
            source: retarget(html, `${publicUrl}/${slug}`),
          })
        }
      }
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' })
    },
  }
}

/**
 * Uygulama manifesti. İçindeki simge adresleri taban ön ekini içermek
 * zorunda: alt dizinde yayınlanınca "/icon-192.png" 404 döner.
 */
function webManifest(base) {
  return {
    name: 'decha-manifest',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'site.webmanifest',
        source: JSON.stringify(
          {
            name: 'Decha Agency',
            short_name: 'Decha',
            description: 'Dijital büyüme için tasarım ve yazılım.',
            lang: 'tr',
            start_url: base,
            scope: base,
            display: 'standalone',
            background_color: '#0e0a07',
            theme_color: '#0e0a07',
            icons: [
              { src: `${base}icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
              { src: `${base}icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
              { src: `${base}favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
            ],
          },
          null,
          2,
        ),
      })
    },
  }
}

/**
 * robots.txt ve sitemap.xml'i derleme anında üretir. İkisi de mutlak adres
 * içeriyor; elle tutulan kopyalar alan adı değişince sessizce yanlış kalırdı.
 */
function seoFiles(siteUrl, base) {
  const today = new Date().toISOString().slice(0, 10)

  return {
    name: 'decha-seo-files',
    apply: 'build',
    generateBundle() {
      const urls = ROUTES.map(
        (route) =>
          `  <url><loc>${siteUrl}${base}${route.path.replace(/^\//, '')}</loc>` +
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
          `Disallow: ${base}yonetim`,
          '',
          `Sitemap: ${siteUrl}${base}sitemap.xml`,
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  const base = normalizeBase(env.VITE_BASE_PATH)
  const publicUrl = `${siteUrl}${base}`.replace(/\/+$/, '')

  return {
  base,
  plugins: [
    react(),
    siteUrlHtml(siteUrl, base),
    seoFiles(siteUrl, base),
    webManifest(base),
    githubPagesFiles(publicUrl),
  ],
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
