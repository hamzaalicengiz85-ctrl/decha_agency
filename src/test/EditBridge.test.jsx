import { describe, expect, it, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import EditBridge from '../edit/EditBridge'

/**
 * Köprünün sözleşmesi: yakalama fazında tıklamayı yutar, hedefi anahtara
 * çözer ve panele bildirir. jsdom `closest`, yakalama sırası ve
 * preventDefault'u gerçekçi uyguladığı için burada test edilebilir.
 */

function fixture() {
  return render(
    <>
      <EditBridge />
      <section data-section="home.hizmetler" data-section-label="Hizmet kataloğu">
        <a href="/projeler" id="link">
          <span data-copy-key="home.buton">Tüm arşiv</span>
        </a>
        <article data-rec="services:abc" data-rec-label="Web Tasarım">
          <h3 data-rec-field="title" id="field">
            Web Tasarım
          </h3>
        </article>
        <p data-list-key="sss.liste" data-list-index="0" data-list-field="q">
          Soru bir
        </p>
      </section>
      <section data-section="home.projeler" data-section-label="Projeler" data-section-hidden="1" />
      <details id="sss">
        <summary>Soru</summary>
        <p>Cevap</p>
      </details>
    </>,
  )
}

afterEach(() => {
  delete document.documentElement.dataset.edit
})

describe('EditBridge', () => {
  it('html üzerine data-edit koyar', () => {
    fixture()
    expect(document.documentElement.dataset.edit).toBe('1')
  })

  it('bağlantı içindeki metne tıklayınca gezinmeyi engeller', () => {
    fixture()
    const span = document.querySelector('[data-copy-key]')
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    span.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('bağlantı yerine metnin kendi anahtarını bildirir', () => {
    const posted = []
    vi.spyOn(window, 'postMessage').mockImplementation((message) => posted.push(message))
    fixture()

    document.querySelector('[data-copy-key]').dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )

    const pick = posted.find((message) => message.type === 'decha:pick')
    expect(pick.copyKey).toBe('home.buton')
    expect(pick.text).toBe('Tüm arşiv')
  })

  it('kayıt alanına tıklayınca kaydı da bildirir', () => {
    const posted = []
    vi.spyOn(window, 'postMessage').mockImplementation((message) => posted.push(message))
    fixture()

    document.getElementById('field').dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true }),
    )

    const pick = posted.find((message) => message.type === 'decha:pick')
    expect(pick.recField).toBe('title')
    expect(pick.rec).toBe('services:abc')
  })

  it('SSS akordeonlarını açar — preventDefault yerel açmayı da iptal ediyor', () => {
    fixture()
    expect(document.getElementById('sss').open).toBe(true)
  })

  it('sayfanın içerik ağacını bölümlere ayırarak çıkarır', () => {
    const posted = []
    vi.spyOn(window, 'postMessage').mockImplementation((message) => posted.push(message))
    fixture()

    const outline = posted.find((message) => message.type === 'decha:outline')
    const services = outline.sections.find((item) => item.id === 'home.hizmetler')

    expect(services.label).toBe('Hizmet kataloğu')
    expect(services.texts.map((item) => item.copyKey)).toContain('home.buton')
    // Kayıt kartı kendi penceresi; alanları altında.
    expect(services.records).toHaveLength(1)
    expect(services.records[0].label).toBe('Web Tasarım')
    expect(services.records[0].fields[0].recField).toBe('title')
    // Liste öğeleri kendi penceresinde gruplanır.
    expect(services.lists[0].key).toBe('sss.liste')
    expect(services.lists[0].items[0].fields[0].listField).toBe('q')
  })

  it('içeriği olmayan gizli bölümü de listeler — tekrar açılabilsin', () => {
    const posted = []
    vi.spyOn(window, 'postMessage').mockImplementation((message) => posted.push(message))
    fixture()

    const outline = posted.find((message) => message.type === 'decha:outline')
    const hidden = outline.sections.find((item) => item.id === 'home.projeler')
    expect(hidden.hidden).toBe(true)
  })
})
