import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

/** Kayıt defteri girdisi — görsel yok, tipografik künye var. */
export default function PostCard({ post, index = 0 }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-line/25 bg-line/[0.06] px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
          {post.category}
        </span>
        <time className="num font-mono text-[10px] text-fg-subtle" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6">
        <span className="num font-display text-3xl font-bold leading-none text-fg/15">
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3 className="mt-4 font-display text-[15px] font-bold uppercase leading-snug text-fg">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-fg-muted">{post.excerpt}</p>

        <span className="mt-5 flex items-center justify-between border-t border-dashed border-line/25 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink">
          Kaydı oku
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  )
}
