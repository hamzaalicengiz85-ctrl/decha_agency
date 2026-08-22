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
    const unique = Array.from(new Set(projectList.map((project) => project.category).filter(Boolean)))
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
      <Section className="pb-10 pt-16 sm:pt-20">
        <SectionHeading
          eyebrow="Projeler"
          title="Yaptığımız işler kendini anlatsın"
          as="h1"
          description="Farklı sektörlerden markalar için tasarladığımız ve geliştirdiğimiz projelerden bir seçki."
          align="center"
        />
      </Section>

      <Section className="pt-0">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={classNames(
                'rounded-full border px-5 py-2 text-sm font-medium transition',
                activeCategory === category
                  ? 'border-brand-500 bg-brand-500/15 text-white'
                  : 'border-white/10 text-slate-400 hover:border-white/25 hover:text-white',
              )}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <CardSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Bu kategoride proje yok"
              description="Başka bir kategori seçmeyi deneyin."
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
