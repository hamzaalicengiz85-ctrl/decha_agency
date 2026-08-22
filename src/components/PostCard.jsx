import { Link } from 'react-router-dom'
import { formatDate } from '../lib/format'

export default function PostCard({ post }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group surface surface-hover flex h-full flex-col overflow-hidden"
    >
      <div className="aspect-[16/9] overflow-hidden bg-ink-800">
        <img
          src={post.cover_url}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="rounded-full bg-brand-500/10 px-3 py-1 font-medium text-brand-300">
            {post.category}
          </span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
        <h3 className="mt-4 text-lg font-bold leading-snug text-white group-hover:text-brand-200">
          {post.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
        <span className="mt-5 text-sm font-semibold text-brand-300">Yazıyı oku →</span>
      </div>
    </Link>
  )
}
