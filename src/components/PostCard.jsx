import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

export default function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="glass glass-hover group flex h-full flex-col overflow-hidden p-2"
    >
      <div className="aspect-[16/9] overflow-hidden rounded-[13px] bg-bg-elev">
        <img
          src={post.cover_url}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-[900ms] ease-smooth group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {post.category}
          </span>
          <time className="num text-[11px] text-fg-subtle" dateTime={post.published_at}>
            {formatDate(post.published_at)}
          </time>
        </div>
        <h3 className="mt-4 text-base font-semibold leading-snug text-fg">{post.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
          Yazıyı oku
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  )
}
