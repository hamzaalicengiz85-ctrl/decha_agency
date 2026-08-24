/**
 * Ekran efektleri: tarama çizgileri, köşe karartması, cam yansıması ve
 * aşağı inen yayın bandı. Sabit katmanlar, içerik altlarında kayar.
 * Tamamı pointer-events: none — tıklama ve kaydırma içeriğe geçer.
 */
export default function ScreenFx() {
  return (
    <div aria-hidden="true">
      <div className="tv-sweep" />
      <div className="tv-overlay" />
    </div>
  )
}
