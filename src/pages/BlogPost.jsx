import { Link, useParams } from 'react-router-dom'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import CTA from '../components/home/CTA'
import { Spinner } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { formatDate } from '../lib/format'
import { posts } from '../data/content'

export default function BlogPost() {
  const { slug } = useParams()
  const fallback = posts.filter((post) => post.slug === slug)

  const { data: post, loading } = useSupabaseData('posts', {
    fallback,
    filters: { slug },
    single: true,
  })

  usePageMeta({
    title: post?.title ?? 'Blog',
    description: post?.excerpt,
    image: post?.cover_url,
  })

  if (loading) {
    return (
      <div className="container py-32">
        <Spinner label="Yazı yükleniyor" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-bold text-white">Yazı bulunamadı</h1>
        <p className="mt-4 text-slate-400">Aradığınız yazı kaldırılmış veya adresi değişmiş olabilir.</p>
        <Button to="/blog" className="mt-8">
          Blog’a dön
        </Button>
      </div>
    )
  }

  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 2)

  return (
    <>
      <Section className="pb-8 pt-12">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Blog
          </Link>

          <div className="mt-8 flex items-center gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-brand-500/10 px-3 py-1 font-medium text-brand-300">
              {post.category}
            </span>
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            {post.author ? <span>· {post.author}</span> : null}
          </div>

          <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h1>
          <p className="mt-5 text-lg text-slate-400">{post.excerpt}</p>
        </div>
      </Section>

      <div className="container">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10">
          <img
            src={post.cover_url}
            alt={post.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>

      <Section>
        <article className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-slate-300">
          {String(post.content ?? '')
            .split('\n')
            .filter((paragraph) => paragraph.trim())
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </article>

        {others.length > 0 ? (
          <div className="mx-auto mt-16 max-w-3xl border-t border-white/10 pt-10">
            <h2 className="text-xl font-bold">Bunlar da ilginizi çekebilir</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="surface surface-hover p-5">
                  <p className="text-xs text-brand-300">{item.category}</p>
                  <p className="mt-2 font-semibold leading-snug text-white">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </Section>

      <CTA />
    </>
  )
}
