import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import ClientMarquee from '../components/home/ClientMarquee'
import Process from '../components/home/Process'
import CTA from '../components/home/CTA'
import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import Crt from '../components/ui/Crt'
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
            code="01"
            eyebrow="Hizmet kataloğu"
            title="Uçtan uca dijital çözümler"
            description="Fikir aşamasından yayına ve büyümeye kadar ihtiyacınız olan her şey tek ekipte."
          />
          <Button to="/hizmetler" variant="outline" size="sm" className="self-start md:self-auto">
            Tüm katalog
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-10">
          {servicesLoading ? (
            <CardSkeleton count={6} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {serviceList.map((service, index) => (
                <ServiceCard key={service.id ?? service.slug} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Arşiv monitörü */}
      <Section>
        <Crt label="Arşiv · Kanal 02" channel="SEÇİLİ İŞLER">
          <div className="px-5 py-12 sm:px-9 sm:py-16">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                code="02"
                eyebrow="Kayıtlı dosyalar"
                title="Sonuç üreten projeler"
                description="Her projede önce hedefi, sonra tasarımı konuşuruz."
              />
              <Button to="/projeler" variant="outline" size="sm" className="self-start md:self-auto">
                Tüm arşiv
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="mt-10">
              {projectsLoading ? (
                <CardSkeleton count={3} />
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {projectList.map((project) => (
                    <ProjectCard key={project.id ?? project.slug} project={project} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Crt>
      </Section>

      <Process />

      <Section>
        <SectionHeading
          code="04"
          eyebrow="Tutanaklar"
          title="Müşterilerimiz ne diyor?"
          align="center"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonialList.map((testimonial) => (
            <TestimonialCard key={testimonial.id ?? testimonial.name} testimonial={testimonial} />
          ))}
        </div>
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
          Referanslarımızla görüşmek ister misiniz?{' '}
          <Link to="/iletisim" className="link-underline text-accent-ink">
            Bize yazın
          </Link>
        </p>
      </Section>

      <CTA />
    </>
  )
}
