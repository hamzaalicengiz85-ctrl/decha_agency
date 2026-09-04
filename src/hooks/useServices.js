import { useSupabaseData } from './useSupabaseData'
import { services as servicesFallback } from '../data/content'

/**
 * Hizmet listesi. Footer ve iletişim formu her sayfada render edildiği için
 * ortak bir sarmalayıcı: aynı sorgu iki yerde ayrı ayrı yazılmasın.
 *
 * Daha önce ikisi de statik listeyi okuyordu; panelden eklenen bir hizmet
 * footer'da ve form seçiminde hiç görünmüyordu.
 */
export function useServices(options = {}) {
  return useSupabaseData('services', {
    fallback: servicesFallback,
    // Boş sonuçta yedeğe düşme: panelden silinen son hizmet geri gelmiş görünürdü.
    fallbackOnEmpty: false,
    order: { column: 'order_no', ascending: true },
    ...options,
  })
}
