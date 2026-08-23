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
        <h1 className="font-display text-headline font-bold uppercase text-accent">Yazı bulunamadı</h1>
        <p className="mt-4 text-fg-muted">Aradığınız yazı kaldırılmış veya adresi değişmiş olabilir.</p>
        <Button to="/blog" className="mt-8">
          Blog’a dön
        </Button>
      </div>
    )
  }

  const others = posts.filter((item) => item.slug !== post.slug).slice(0, 2)

  return (
    <>
      <Section spacing="intro">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
            Blog
          </Link>

          <div className="mt-8 flex items-center gap-3 text-xs text-fg-subtle">
            <span className="border border-accent/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              {post.category}
            </span>
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            {post.author ? <span>· {post.author}</span> : null}
          </div>

          <h1 className="mt-5 font-display text-headline font-bold uppercase leading-tight">{post.title}</h1>
          <p className="mt-5 text-[15px] leading-relaxed text-fg-muted">{post.excerpt}</p>
        </div>
      </Section>

      <div className="container">
        <div className="dotted-rule mx-auto max-w-3xl" aria-hidden="true" />
      </div>

      <Section>
        <article className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-fg-muted">
          {String(post.content ?? '')
            .split('\n')
            .filter((paragraph) => paragraph.trim())
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </article>

        {others.length > 0 ? (
          <div className="mx-auto mt-16 max-w-3xl border-t border-accent/30 pt-10">
            <h2 className="font-display text-[18px] font-bold uppercase">Bunlar da ilginizi çekebilir</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="panel panel-hover p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{item.category}</p>
                  <p className="mt-2 font-display text-[13px] font-bold uppercase leading-snug text-accent">{item.title}</p>
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
