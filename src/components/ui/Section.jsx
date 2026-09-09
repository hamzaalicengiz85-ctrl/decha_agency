import { classNames } from '../../lib/format'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useSectionVisible, useSiteCopy } from '../../lib/siteCopyContext'

/**
 * DİKEY RİTİM
 *
 * Dikey boşluk `spacing` prop'u ile verilir — className üzerinden geçilen
 * pt-0 gibi sınıflar duyarlı varsayılanı ezemediği için masaüstünde
 * sessizce etkisiz kalıyordu.
 *
 * Önceki düzende her bölüm `py-20` idi: sayfa eşit aralıklı beş dilim gibi
 * okunuyordu, hiçbir yerde "yeni bir konu başlıyor" duygusu yoktu.
 *
 * İki kural:
 *
 * 1) BOŞLUK SONRAKİ BÖLÜME AİT. Üst dolgu alt dolgudan belirgin biçimde
 *    büyük: bölüm kendi başlığına yapışır, ayrılık başlığın ÖNÜNDE olur.
 *    Eşit dolguda başlık iki bölümün ortasında asılı kalıyordu.
 *
 * 2) BÖLÜMLER İKİLİ GRUPLANIR. `tight` bir önceki bölümün devamı demektir
 *    (hizmetler → projeler, süreç → referanslar); `loose` yeni bir hareket
 *    ya da sayfanın kapanışı. Sıra şöyle okunur: ara — bitişik — ARA —
 *    bitişik — ARA.
 */
const SPACING = {
  default: 'pb-10 pt-16 sm:pb-14 sm:pt-24',
  tight: 'pb-10 pt-8 sm:pb-14 sm:pt-10', // bir öncekinin devamı
  loose: 'pb-16 pt-24 sm:pb-24 sm:pt-36', // yeni hareket / kapanış
  intro: 'pb-6 pt-12 sm:pb-8 sm:pt-16', // sayfa başlığı bloğu
  'top-none': 'pb-14 sm:pb-20',
  'bottom-none': 'pt-14 sm:pt-20',
  none: '',
}

export default function Section({
  id,
  sectionId,
  label,
  spacing = 'default',
  className,
  containerClassName,
  children,
  reveal = true,
}) {
  const { ref, visible } = useScrollReveal()
  const { edit } = useSiteCopy()
  const published = useSectionVisible(sectionId)

  // Yayından kaldırılan bölüm genel sitede hiç çizilmez. Panelde ise soluk
  // görünür ki geri açılabilsin.
  if (!published && !edit) return null

  return (
    <section
      id={id}
      ref={reveal ? ref : undefined}
      data-section={sectionId}
      data-section-label={label}
      data-section-hidden={published ? undefined : '1'}
      className={classNames(
        SPACING[spacing] ?? SPACING.default,
        !published && edit && 'opacity-40',
        className,
      )}
    >
      <div
        className={classNames(
          'container',
          reveal && 'reveal',
          reveal && visible && 'is-in',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}
