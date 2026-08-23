import { Link, useParams } from 'react-router-dom'
import Section from '../components/ui/Section'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import CTA from '../components/home/CTA'
import { Spinner } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { projects } from '../data/content'
import { fileCode, initials } from '../lib/initials'

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
        <h1 className="font-display text-headline font-bold uppercase text-fg">Proje bulunamadı</h1>
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
      <Section spacing="intro">
        <Link
          to="/projeler"
          className="inline-flex items-center gap-2 text-sm text-fg-muted transition hover:text-fg"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Projeler
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <span className="border border-accent/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-ink">
              {project.category}
            </span>
            <h1 className="mt-5 font-display text-display font-bold uppercase leading-tight">
              {project.title}
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">{project.summary}</p>
          </div>

          <dl className="grid grid-cols-2 gap-4">
            <div className="panel p-5">
              <dt className="eyebrow">Müşteri</dt>
              <dd className="mt-2 font-bold text-fg">{project.client}</dd>
            </div>
            <div className="panel p-5">
              <dt className="eyebrow">Yıl</dt>
              <dd className="mt-2 font-bold text-fg">{project.year}</dd>
            </div>
          </dl>
        </div>
      </Section>

      {/* Künye şeridi: fotoğraf yerine dosya kimliği */}
      <div className="container">
        <div className="panel relative flex items-center justify-between gap-6 overflow-hidden px-6 py-8 sm:px-10 sm:py-12">
          <span
            className="absolute inset-0 opacity-60"
            aria-hidden="true"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, rgb(var(--c-line) / 0.05) 0 1px, transparent 1px 8px)',
            }}
          />
          <span className="relative font-display text-[3.4rem] font-bold leading-none text-fg/85 sm:text-[5rem]">
            {initials(project.client || project.title)}
          </span>
          <div className="relative text-right">
            <p className="eyebrow">Dosya kodu</p>
            <p className="num mt-1 font-mono text-[13px] text-fg">
              {fileCode(project.slug, project.year)}
            </p>
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="font-display text-[20px] font-bold uppercase">Proje hakkında</h2>
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
                    className="border border-line/25 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-subtle"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {metrics.length > 0 ? (
            <aside className="panel h-fit p-7">
              <h3 className="eyebrow">
                Sonuçlar
              </h3>
              <dl className="mt-6 space-y-6">
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-3xl font-bold text-accent-ink">
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
        <Section spacing="top-none" className="bg-bg-soft/60">
          <h2 className="font-display text-[20px] font-bold uppercase">Diğer projeler</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to={`/projeler/${item.slug}`}
                className="panel panel-hover flex items-center gap-4 p-5"
              >
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center border border-line/25 font-display text-[15px] font-bold text-fg"
                  aria-hidden="true"
                >
                  {initials(item.client || item.title)}
                </span>
                <div>
                  <p className="font-bold text-fg">{item.title}</p>
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
