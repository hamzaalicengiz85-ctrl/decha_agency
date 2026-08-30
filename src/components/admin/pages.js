/**
 * Panelin sol kenarındaki sayfa kategorileri. Her biri sitenin gerçek bir
 * rotasını gösterir; önizleme o adresi `?edit=1` ile açar.
 *
 * Detay rotaları bir kayıt gerektirdiği için örnek slug ile açılır; hangi
 * kaydın gösterileceği önizleme başlığından değiştirilebilir.
 */
export const PAGES = [
  { key: 'home', label: 'Ana Sayfa', path: '/' },
  { key: 'services', label: 'Hizmetler', path: '/hizmetler' },
  { key: 'work', label: 'Projeler', path: '/projeler' },
  { key: 'projectDetail', label: 'Proje Detayı', path: '/projeler/:slug', table: 'projects' },
  { key: 'about', label: 'Hakkımızda', path: '/hakkimizda' },
  { key: 'blog', label: 'Blog', path: '/blog' },
  { key: 'blogPost', label: 'Blog Yazısı', path: '/blog/:slug', table: 'posts' },
  { key: 'contact', label: 'İletişim', path: '/iletisim' },
]

export function pageUrl(page, slug) {
  const path = page.path.includes(':slug') ? page.path.replace(':slug', slug ?? '') : page.path
  return `${path}?edit=1`
}
