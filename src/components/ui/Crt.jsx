import { classNames } from '../../lib/format'

/**
 * Tüplü televizyon kasası.
 *
 * Gövde (döküm kahve) → tüp camı → içerik. `tone="phosphor"` ekranın
 * içindeki tüm token'ları koyu fosfor setine çevirir; içerideki kartlar,
 * formlar ve metinler ayrı bir varyanta ihtiyaç duymadan uyum sağlar.
 *
 * @param {'phosphor'|'paper'} tone   Ekran tipi
 * @param {string} label             Künye plakasındaki ad
 * @param {string} channel           Sağ üstteki kanal/dosya numarası
 * @param {boolean} sweep            Ekranda inen tarama bandı
 */
export default function Crt({
  tone = 'phosphor',
  label,
  channel,
  sweep = true,
  className,
  screenClassName,
  children,
}) {
  return (
    <div className={classNames('crt', className)}>
      {/* Köşe vidaları */}
      <span className="screw absolute left-2.5 top-2.5 sm:left-3 sm:top-3" aria-hidden="true" />
      <span className="screw absolute right-2.5 top-2.5 sm:right-3 sm:top-3" aria-hidden="true" />
      <span className="screw absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3" aria-hidden="true" />
      <span className="screw absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3" aria-hidden="true" />

      {/* Üst künye şeridi */}
      {(label || channel) && (
        <div className="relative z-10 mb-3 flex items-center justify-between gap-3 px-6 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="led" aria-hidden="true" />
            {label ? (
              <span className="plate px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em]">
                {label}
              </span>
            ) : null}
          </div>
          {channel ? (
            <span className="num font-mono text-[10px] uppercase tracking-[0.2em] text-[rgb(217_195_165_/_0.55)]">
              {channel}
            </span>
          ) : null}
        </div>
      )}

      <div
        className={classNames(
          'crt-screen',
          tone === 'phosphor' ? 'screen-phosphor' : 'screen-paper',
          screenClassName,
        )}
      >
        {sweep ? <span className="crt-sweep" aria-hidden="true" /> : null}
        <div className="crt-content">{children}</div>
      </div>

      {/* Alt kontrol paneli: havalandırma + kadran */}
      <div className="relative z-10 mt-3 flex items-center gap-3 px-6 sm:px-7">
        <span className="vents h-2 flex-1 rounded-[2px]" aria-hidden="true" />
        <span
          className="h-3.5 w-3.5 rounded-full border border-black/40 bg-[rgb(150_130_116)] shadow-inner"
          aria-hidden="true"
        />
        <span
          className="h-3.5 w-3.5 rounded-full border border-black/40 bg-[rgb(120_102_90)] shadow-inner"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
