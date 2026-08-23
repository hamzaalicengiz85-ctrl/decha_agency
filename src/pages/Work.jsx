import { useMemo, useState } from 'react'
import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import CTA from '../components/home/CTA'
import { CardSkeleton, EmptyState } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { projects } from '../data/content'
import { classNames } from '../lib/format'

export default function Work() {
  usePageMeta({
    title: 'Projeler',
    description: 'Decha Agency tarafından hayata geçirilen web, mobil ve marka projeleri.',
  })

  const [activeCategory, setActiveCategory] = useState('Tümü')

  const { data: projectList, loading } = useSupabaseData('projects', {
    fallback: projects,
    order: { column: 'order_no', ascending: true },
  })

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projectList.map((p) => p.category).filter(Boolean)))
    return ['Tümü', ...unique]
  }, [projectList])

  const filtered = useMemo(
    () =>
      activeCategory === 'Tümü'
        ? projectList
        : projectList.filter((project) => project.category === activeCategory),
    [projectList, activeCategory],
  )

  return (
    <>
      <Section spacing="intro">
        <SectionHeading
          code="02"
          eyebrow="Arşiv kayıtları"
          title="Yaptığımız işler kendini anlatsın"
          as="h1"
          description="Farklı sektörlerden markalar için tasarladığımız ve geliştirdiğimiz dosyalardan bir seçki."
          align="center"
        />
      </Section>

      <Section spacing="top-none">
        {/* Dolap sekmesi filtreleri */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 border-y border-accent/35 py-5">
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
            Sınıflandırma:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={classNames(
                'min-h-[36px] border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-150',
                activeCategory === category
                  ? 'border-accent bg-accent text-accent-fg'
                  : 'border-accent/35 text-accent hover:bg-accent hover:text-accent-fg',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <CardSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Bu sınıfta kayıt yok"
              description="Başka bir sınıflandırma seçmeyi deneyin."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectCard key={project.id ?? project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <CTA />
    </>
  )
}
