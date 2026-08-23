import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

export default function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="panel panel-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-line/20 bg-line/[0.05] px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-ink">
          {post.category}
        </span>
        <time className="num font-mono text-[10px] text-fg-subtle" dateTime={post.published_at}>
          {formatDate(post.published_at)}
        </time>
      </div>

      <div className="p-3">
        <div className="crt-screen screen-paper aspect-[16/9] bg-bg-soft">
          <img
            src={post.cover_url}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover opacity-95 transition duration-500 group-hover:opacity-100"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-5">
        <h3 className="font-display text-[15px] font-bold uppercase leading-snug text-fg">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-fg-muted">{post.excerpt}</p>
        <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-ink">
          Kaydı oku →
        </span>
      </div>
    </Link>
  )
}
