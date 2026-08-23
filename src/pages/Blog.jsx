import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import PostCard from '../components/PostCard'
import { CardSkeleton, EmptyState } from '../components/ui/Loader'
import { useSupabaseData } from '../hooks/useSupabaseData'
import { usePageMeta } from '../lib/seo'
import { posts } from '../data/content'

export default function Blog() {
  usePageMeta({
    title: 'Blog',
    description: 'Tasarım, yazılım ve dijital pazarlama üzerine yazılarımız.',
  })

  const { data: postList, loading } = useSupabaseData('posts', {
    fallback: posts,
    order: { column: 'published_at', ascending: false },
  })

  return (
    <Section spacing="bottom-none">
      <SectionHeading
        code="04"
        eyebrow="Kayıt defteri"
        title="Öğrendiklerimizi paylaşıyoruz"
        as="h1"
        description="Tasarım, performans ve büyüme üzerine deneyimlerimizden notlar."
        align="center"
      />

      <div className="mt-12">
        {loading ? (
          <CardSkeleton count={3} />
        ) : postList.length === 0 ? (
          <EmptyState title="Henüz kayıt yok" description="Çok yakında ilk notumuzu paylaşacağız." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {postList.map((post) => (
              <PostCard key={post.id ?? post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
