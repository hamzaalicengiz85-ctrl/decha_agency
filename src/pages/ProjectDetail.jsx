import { Link, useParams } from 'react-router-dom'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import CTA from '../components/home/CTA'
import { Spinner } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { projects } from '../data/content'

export default function ProjectDetail() {
  const { slug } = useParams()
  const fallback = projects.filter((project) => project.slug === slug)

  const { data: project, loading } = useSupabaseData('projects', {
    fallback,
    filters: { slug },
    single: true,
  })

  usePageMeta({
    title: project?.title ?? 'Proje',
    description: project?.summary,
    image: project?.cover_url,
  })

  if (loading) {
    return (
      <div className="container py-32">
        <Spinner label="Proje yükleniyor" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-bold text-fg">Proje bulunamadı</h1>
        <p className="mt-4 text-fg-muted">Aradığınız proje kaldırılmış veya adresi değişmiş olabilir.</p>
        <Button to="/projeler" className="mt-8">
          Tüm projelere dön
        </Button>
      </div>
    )
  }

  const tags = Array.isArray(project.tags) ? project.tags : []
  const metrics = Array.isArray(project.metrics) ? project.metrics : []
  const related = projects.filter((item) => item.slug !== project.slug).slice(0, 3)

  return (
    <>
      <Section className="pb-8 pt-12">
        <Link
          to="/projeler"
          className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Projeler
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {project.category}
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-fg-muted">{project.summary}</p>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div className="glass p-5">
              <dt className="eyebrow">Müşteri</dt>
              <dd className="mt-2 font-semibold text-fg">{project.client}</dd>
            </div>
            <div className="glass p-5">
              <dt className="eyebrow">Yıl</dt>
              <dd className="mt-2 font-semibold text-fg">{project.year}</dd>
            </div>
          </dl>
        </div>
      </Section>

      <div className="container">
        <div className="overflow-hidden rounded-3xl border hairline">
          <img
            src={project.cover_url}
            alt={`${project.title} kapak görseli`}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">Proje hakkında</h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-fg-muted">
              {String(project.description ?? '')
                .split('\n')
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>

            {tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border hairline px-4 py-1.5 text-sm text-fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {metrics.length > 0 ? (
            <aside className="glass h-fit p-7">
              <h3 className="eyebrow">
                Sonuçlar
              </h3>
              <dl className="mt-6 space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-3xl font-semibold text-accent">
                      {metric.value}
                    </dd>
                    <dt className="mt-1 text-sm text-fg-muted">{metric.label}</dt>
                  </div>
                ))}
              </dl>
            </aside>
          ) : null}
        </div>
      </Section>

      {related.length > 0 ? (
        <Section className="bg-bg-soft/60 pt-0">
          <h2 className="text-2xl font-bold">Diğer projeler</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/projeler/${item.slug}`}
                className="glass glass-hover flex items-center gap-4 p-5"
              >
                <img
                  src={item.cover_url}
                  alt=""
                  loading="lazy"
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-fg">{item.title}</p>
                  <p className="mt-1 text-xs text-fg-subtle">{item.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <CTA />
    </>
  )
}
