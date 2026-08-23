/**
 * Televizyon kasası — tüm siteyi çevreler.
 *
 * Katmanlar (sabit, içerik altlarında kayar):
 *   tv-glass    tüp camı: kağıt yüzey, ızgara, doku
 *   tv-sweep    yayın taraması bandı
 *   tv-overlay  cam yansıması + tarama çizgileri + köşe karartması
 *   tv-bezel    döküm kasa (ortası maskeyle oyulmuş)
 *   tv-lip      cam ile kasa arasındaki gölgeli geçiş
 *   tv-hardware vidalar, havalandırma, kadranlar, güç ledi
 *
 * Hepsi pointer-events: none — tıklama ve kaydırma içeriğe geçer.
 */
export default function TvShell() {
  return (
    <div aria-hidden="true">
      <div className="tv-glass" />
      <div className="tv-sweep" />
      <div className="tv-overlay" />
      <div className="tv-bezel" />
      <div className="tv-bezel-texture" />
      <div className="tv-lip" />

      <div className="tv-hardware">
        {/* Vidalar — kasanın yuvarlatılmış köşesinden içeri kaçırıldı,
            aksi halde malzemenin bittiği yere denk gelip kesiliyor. */}
        <span className="screw absolute left-4 top-[1px] md:left-10 md:top-[5.5px]" />
        <span className="screw absolute right-4 top-[1px] md:right-10 md:top-[5.5px]" />

        {/* Alt kontrol paneli */}
        <div className="absolute inset-x-0 bottom-0 flex h-[34px] items-center gap-3 px-4 md:h-[54px] md:gap-5 md:px-10">
          <span className="screw hidden shrink-0 md:block" />
          <span className="led shrink-0" />
          <span className="vents h-2 flex-1 rounded-[2px] md:h-2.5" />
          <span className="hidden h-5 w-5 rounded-full border border-black/50 bg-[rgb(150_130_116)] shadow-inner md:block" />
          <span className="hidden h-5 w-5 rounded-full border border-black/50 bg-[rgb(118_100_88)] shadow-inner md:block" />
          <span className="h-3.5 w-3.5 rounded-full border border-black/50 bg-[rgb(132_112_98)] shadow-inner md:hidden" />
        </div>
      </div>

      <div className="tv-boot" />
    </div>
  )
}
