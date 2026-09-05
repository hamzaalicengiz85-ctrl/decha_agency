import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import Process from '../components/home/Process'
import CTA from '../components/home/CTA'
import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import TestimonialCard from '../components/TestimonialCard'
import Button from '../components/ui/Button'
import Icon from '../components/ui/Icon'
import { CardSkeleton, EmptyState } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { services, projects, testimonials } from '../data/content'
import { Copy } from '../lib/siteCopy'
import { useCopy } from '../lib/siteCopyContext'

export default function Home() {
  // Tablo boşken bölüm bomboş kalmasın: yedeğe düşmüyoruz, o yüzden
  // "kayıt yok" mesajı gerekiyor.
  const emptyServices = useCopy('home.hizmetler.bos', 'Çok yakında sizlerle')
  const emptyServicesDesc = useCopy('home.hizmetler.bos.aciklama', 'Hizmet kataloğumuz hazırlanıyor.')
  const emptyProjects = useCopy('home.projeler.bos', 'Çok yakında sizlerle')
  const emptyProjectsDesc = useCopy('home.projeler.bos.aciklama', 'İlk dosyalarımızı kısa süre içinde paylaşacağız.')
  const emptyTestimonials = useCopy('home.referanslar.bos', 'Çok yakında sizlerle')
  const emptyTestimonialsDesc = useCopy('home.referanslar.bos.aciklama', 'Müşteri görüşlerimiz yakında burada olacak.')

  usePageMeta({
    title: 'Dijital Tasarım & Yazılım Ajansı',
    description:
      'Decha Agency; web tasarımı, yazılım geliştirme, marka kimliği ve dijital pazarlama ile markanızı büyütür.',
  })

  const { data: serviceList, loading: servicesLoading } = useSupabaseData('services', {
    fallback: services,
    // Boş sonuçta yedeğe düşme: panelden silinen son kayıt geri gelmiş görünürdü.
    fallbackOnEmpty: false,
    order: { column: 'order_no', ascending: true },
    limit: 6,
  })

  const { data: projectList, loading: projectsLoading } = useSupabaseData('projects', {
    fallback: projects.filter((project) => project.featured),
    // Boş sonuçta yedeğe düşme: panelden silinen son kayıt geri gelmiş görünürdü.
    fallbackOnEmpty: false,
    filters: { featured: true },
    order: { column: 'order_no', ascending: true },
    limit: 3,
  })

  const { data: testimonialList } = useSupabaseData('testimonials', {
    fallback: testimonials,
    // Boş sonuçta yedeğe düşme: panelden silinen son kayıt geri gelmiş görünürdü.
    fallbackOnEmpty: false,
    order: { column: 'order_no', ascending: true },
    limit: 3,
  })

  return (
    <>
      <Hero />

      <Section
        sectionId="home.hizmetler"
        label="Hizmet kataloğu" id="hizmetler">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            code="01"
            eyebrow="Hizmet kataloğu"
            eyebrowKey="home.hizmetler.eyebrow"
            title="Uçtan uca dijital çözümler"
            titleKey="home.hizmetler.baslik"
            description="Fikir aşamasından yayına ve büyümeye kadar ihtiyacınız olan her şey tek ekipte."
            descriptionKey="home.hizmetler.aciklama"
          />
          <Button to="/hizmetler" variant="outline" size="sm" className="self-start md:self-auto">
            <Copy k="home.hizmetler.buton">Tüm katalog</Copy>
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-10">
          {servicesLoading ? (
            <CardSkeleton count={6} />
          ) : serviceList.length === 0 ? (
            <EmptyState title={emptyServices} description={emptyServicesDesc} eyebrow="Hazırlanıyor" />
          ) : (
            <div className="stagger grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {serviceList.map((service, index) => (
                <ServiceCard key={service.id ?? service.slug} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section
        sectionId="home.projeler"
        label="Öne çıkan projeler">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionHeading
                code="02"
                eyebrow="Kayıtlı dosyalar"
                eyebrowKey="home.projeler.eyebrow"
                title="Sonuç üreten projeler"
                titleKey="home.projeler.baslik"
                description="Her projede önce hedefi, sonra tasarımı konuşuruz."
                descriptionKey="home.projeler.aciklama"
              />
          <Button to="/projeler" variant="outline" size="sm" className="self-start md:self-auto">
            <Copy k="home.projeler.buton">Tüm arşiv</Copy>
            <Icon name="arrow" className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mt-10">
          {projectsLoading ? (
            <CardSkeleton count={3} />
          ) : projectList.length === 0 ? (
            <EmptyState title={emptyProjects} description={emptyProjectsDesc} eyebrow="Hazırlanıyor" />
          ) : (
            <div className="stagger grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projectList.map((project) => (
                <ProjectCard key={project.id ?? project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </Section>

      <Process />

      <Section
        sectionId="home.referanslar"
        label="Referanslar">
        <SectionHeading
          code="04"
          eyebrow="Tutanaklar"
          eyebrowKey="home.referanslar.eyebrow"
          title="Müşterilerimiz ne diyor?"
          titleKey="home.referanslar.baslik"
          align="center"
        />
        {testimonialList.length === 0 ? (
          <div className="mt-10">
            <EmptyState title={emptyTestimonials} description={emptyTestimonialsDesc} eyebrow="Hazırlanıyor" />
          </div>
        ) : (
          <div className="stagger mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonialList.map((testimonial) => (
              <TestimonialCard key={testimonial.id ?? testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        )}
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
          <Copy k="home.referanslar.davet">Referanslarımızla görüşmek ister misiniz?</Copy>{' '}
          <Link to="/iletisim" className="link-underline text-accent">
            <Copy k="home.referanslar.baglanti">Bize yazın</Copy>
          </Link>
        </p>
      </Section>

      <CTA />
    </>
  )
}
