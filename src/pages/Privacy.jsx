import Section from '../components/ui/Section'
import SectionHeading from '../components/ui/SectionHeading'
import { breadcrumb, usePageMeta } from '../lib/seo'
import { SITE } from '../data/content'
import { Copy } from '../lib/siteCopy'
import { useCopy } from '../lib/siteCopyContext'

/**
 * KVKK aydınlatma metni ve çerez/depolama açıklaması.
 *
 * İletişim ve toplantı formları ad, e-posta ve telefon topluyor; 6698 sayılı
 * kanun bu toplamayı yapan sitede erişilebilir bir aydınlatma metni istiyor.
 * Formdaki onay kutusu da buraya bağlanıyor.
 */
export default function Privacy() {
  const email = useCopy('site.eposta', SITE.email)

  usePageMeta({
    title: 'Gizlilik ve KVKK Aydınlatma Metni',
    description:
      'Decha Agency olarak form üzerinden ilettiğiniz kişisel verileri hangi amaçla işlediğimizi, ne kadar sakladığımızı ve haklarınızı açıklıyoruz.',
    schema: breadcrumb([{ name: 'Gizlilik', path: '/gizlilik' }]),
  })

  return (
    <>
      <Section sectionId="gizlilik.giris" label="Sayfa başlığı" spacing="intro">
        <SectionHeading
          code="09"
          eyebrow="Kayıt ve veri politikası"
          eyebrowKey="gizlilik.eyebrow"
          title="Gizlilik ve KVKK aydınlatma metni"
          titleKey="gizlilik.baslik"
          as="h1"
          description="Bu sayfa, siteyi kullanırken bize ilettiğiniz bilgilerin ne olduğunu, neden işlendiğini ve ne kadar süreyle saklandığını açıklar."
          descriptionKey="gizlilik.aciklama"
          align="center"
        />
      </Section>

      <Section sectionId="gizlilik.metin" label="Politika metni" spacing="top-none">
        <div className="panel brackets mx-auto max-w-3xl space-y-9 p-7 sm:p-10">
          <section>
            <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-accent">
              <Copy k="gizlilik.veri.baslik">1 · Hangi verileri topluyoruz</Copy>
            </h2>
            <div className="mt-3 space-y-3 text-[14px] leading-relaxed text-fg-muted">
              <Copy as="p" k="gizlilik.veri.metin">
                Yalnızca sizin doldurduğunuz form alanlarını topluyoruz: ad soyad,
                e-posta adresi, isteğe bağlı telefon ve şirket bilgisi, seçtiğiniz
                hizmet ile bütçe aralığı ve mesajınız. Toplantı talebi
                gönderdiğinizde ayrıca seçtiğiniz tarih ve saat kaydedilir.
              </Copy>
              <Copy as="p" k="gizlilik.veri.metin2">
                Site ziyaretçi takibi, reklam pikseli veya üçüncü taraf analiz
                aracı kullanmaz. Sizi tanımlayan bir çerez yerleştirmiyoruz.
              </Copy>
            </div>
          </section>

          <section>
            <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-accent">
              <Copy k="gizlilik.amac.baslik">2 · Neden işliyoruz</Copy>
            </h2>
            <Copy
              as="p"
              k="gizlilik.amac.metin"
              className="mt-3 text-[14px] leading-relaxed text-fg-muted"
            >
              Verileriniz yalnızca talebinizi değerlendirmek, size dönüş yapmak ve
              teklif hazırlamak için işlenir. Pazarlama listesine eklenmez, satılmaz
              ve üçüncü kişilerle paylaşılmaz.
            </Copy>
          </section>

          <section>
            <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-accent">
              <Copy k="gizlilik.saklama.baslik">3 · Nerede ve ne kadar saklanıyor</Copy>
            </h2>
            <Copy
              as="p"
              k="gizlilik.saklama.metin"
              className="mt-3 text-[14px] leading-relaxed text-fg-muted"
            >
              Form kayıtları, altyapı sağlayıcımız Supabase üzerindeki veritabanında
              tutulur ve yalnızca yetkili ekip üyeleri erişebilir. Kayıtlar,
              görüşme sürecinin kapanmasından itibaren en fazla 2 yıl saklanır;
              süre dolduğunda silinir.
            </Copy>
          </section>

          <section>
            <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-accent">
              <Copy k="gizlilik.tarayici.baslik">4 · Tarayıcınızda tutulanlar</Copy>
            </h2>
            <Copy
              as="p"
              k="gizlilik.tarayici.metin"
              className="mt-3 text-[14px] leading-relaxed text-fg-muted"
            >
              Sitenin çalışması için tarayıcınızın yerel deposunda iki küçük kayıt
              tutulur: giriş animasyonunun tekrar tekrar oynamaması için bir işaret
              ve site metinlerinin hızlı açılması için bir önbellek. Bunlar
              cihazınızdan çıkmaz, kimliğinizi taşımaz ve tarayıcı verilerini
              temizlediğinizde kaybolur.
            </Copy>
          </section>

          <section>
            <h2 className="font-display text-[15px] font-bold uppercase tracking-[0.08em] text-accent">
              <Copy k="gizlilik.haklar.baslik">5 · Haklarınız</Copy>
            </h2>
            <Copy
              as="p"
              k="gizlilik.haklar.metin"
              className="mt-3 text-[14px] leading-relaxed text-fg-muted"
            >
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize
              erişme, düzeltilmesini, silinmesini ya da işlenmesinin durdurulmasını
              isteme hakkınız var. Talebinizi aşağıdaki adrese iletmeniz yeterli;
              en geç 30 gün içinde yanıtlıyoruz.
            </Copy>
            <p className="mt-4 border-t border-dashed border-accent/30 pt-4 font-mono text-[12.5px] text-fg">
              <a href={`mailto:${email}`} className="text-accent underline-offset-4 hover:underline">
                {email}
              </a>
            </p>
          </section>

          <p className="border-t border-accent/25 pt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-subtle">
            <Copy k="gizlilik.revizyon">Belge DA-KVKK-01 · Son güncelleme: 2026</Copy>
          </p>
        </div>
      </Section>
    </>
  )
}
