import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'
import { Copy } from '../lib/siteCopy'

/** Kayıt defteri girdisi — görsel yok, tipografik künye var. */
export default function PostCard({ post, index = 0, as: Heading = 'h3' }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    
      data-rec={`posts:${post.id ?? ''}`}
      data-rec-label={post.title}>
      <div className="flex items-center justify-between border-b border-line/40 bg-line/[0.10] px-4 py-2">
        <span className="font-mono text-label uppercase tracking-label text-fg-subtle">
          {post.category}
        </span>
        <time className="num font-mono text-label text-fg-subtle" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6">
        <span className="num font-display text-stat font-bold leading-none text-fg/20">
          {String(index + 1).padStart(2, '0')}
        </span>

        <Heading className="mt-4 font-display text-lead font-bold leading-snug text-fg">
          {post.title}
        </Heading>
        <p className="mt-3 flex-1 text-caption leading-relaxed text-fg-muted">{post.excerpt}</p>

        <span className="mt-5 flex items-center justify-between border-t border-dashed border-line/25 pt-3 font-mono text-label uppercase tracking-label text-accent">
          <Copy k="kart.yazi.baglanti">Kaydı oku</Copy>
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
