import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import ClientMarquee from '../components/home/ClientMarquee'
import Process from '../components/home/Process'
import CTA from '../components/home/CTA'
import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import TestimonialCard from '../components/TestimonialCard'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { CardSkeleton } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { services, projects, testimonials } from '../data/content'

export default function Home() {
  usePageMeta({
    title: 'Dijital Tasarım & Yazılım Ajansı',
    description:
      'Decha Agency; web tasarımı, yazılım geliştirme, marka kimliği ve dijital pazarlama ile markanızı büyütür.',
  })

  const { data: serviceList, loading: servicesLoading } = useSupabaseData('services', {
    fallback: services,
    order: { column: 'order_no', ascending: true },
    limit: 6,
  })

  const { data: projectList, loading: projectsLoading } = useSupabaseData('projects', {
    fallback: projects.filter((project) => project.featured),
    filters: { featured: true },
    order: { column: 'order_no', ascending: true },
    limit: 3,
  })

  const { data: testimonialList } = useSupabaseData('testimonials', {
    fallback: testimonials,
    order: { column: 'order_no', ascending: true },
    limit: 3,
  })

  return (
    <>
      <Hero />
      <ClientMarquee />

      <Section id="hizmetler">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Hizmetler"
            title="Uçtan uca dijital çözümler"
            description="Fikir aşamasından yayına ve büyümeye kadar ihtiyacınız olan her şey tek ekipte."
          />
          <Button to="/hizmetler" variant="ghost" className="self-start md:self-auto">
            Tüm hizmetler
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12">
          {servicesLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serviceList.map((service) => (
                <ServiceCard key={service.id ?? service.slug} service={service} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section className="bg-bg-soft/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Seçili işler"
            title="Sonuç üreten projeler"
            description="Her projede önce hedefi, sonra tasarımı konuşuruz. İşte bunun karşılığı."
          />
          <Button to="/projeler" variant="ghost" className="self-start md:self-auto">
            Tüm projeler
            <Icon name="arrow" className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-12">
          {projectsLoading ? (
            <CardSkeleton count={3} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projectList.map((project) => (
                <ProjectCard key={project.id ?? project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Process />

      <Section>
        <SectionHeading
          eyebrow="Referanslar"
          title="Müşterilerimiz ne diyor?"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonialList.map((testimonial) => (
            <TestimonialCard key={testimonial.id ?? testimonial.name} testimonial={testimonial} />
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-fg-subtle">
          Referanslarımızla görüşmek ister misiniz?{' '}
          <Link to="/iletisim" className="link-underline font-semibold text-accent">
            Bize yazın
          </Link>
        </p>
      </Section>

      <CTA />
    </>
  )
}
