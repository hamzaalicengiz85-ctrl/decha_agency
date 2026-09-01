import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OutlineTree from '../components/admin/OutlineTree'

const sections = [
  {
    key: 'home.hizmetler',
    id: 'home.hizmetler',
    label: 'Hizmet kataloğu',
    hidden: false,
    texts: [{ copyKey: 'home.hizmetler.baslik', text: 'Uçtan uca dijital çözümler' }],
    lists: [
      {
        key: 'sss.liste',
        items: [
          {
            index: '0',
            fields: [{ listKey: 'sss.liste', listIndex: '0', listField: 'q', text: 'Soru bir' }],
          },
        ],
      },
    ],
    records: [
      {
        rec: 'services:abc',
        label: 'Web Tasarım',
        fields: [{ rec: 'services:abc', recField: 'title', text: 'Web Tasarım' }],
      },
    ],
  },
  {
    key: 'home.projeler',
    id: 'home.projeler',
    label: 'Projeler',
    hidden: true,
    texts: [],
    lists: [],
    records: [],
  },
]

describe('OutlineTree', () => {
  it('bölümü açınca içindeki metin, liste ve kayıt pencerelerini gösterir', () => {
    render(<OutlineTree sections={sections} onSelect={() => {}} onToggleSection={() => {}} />)

    // Kapalıyken yalnızca bölüm başlıkları görünür.
    expect(screen.queryByText('Uçtan uca dijital çözümler')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /hizmet kataloğu/i }))
    expect(screen.getByRole('button', { name: 'Uçtan uca dijital çözümler' })).toBeInTheDocument()
    // Kayıt kendi penceresi; açılınca alanları listelenir.
    fireEvent.click(screen.getByRole('button', { name: /web tasarım/i }))
    expect(screen.getByRole('button', { name: 'Kaydın tüm alanları' })).toBeInTheDocument()
  })

  it('yaprağa tıklayınca düzenleyiciye aynı yükü verir', () => {
    const picks = []
    render(<OutlineTree sections={sections} onSelect={(item) => picks.push(item)} />)

    fireEvent.click(screen.getByRole('button', { name: /hizmet kataloğu/i }))
    fireEvent.click(screen.getByRole('button', { name: /sık sorulan sorular/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Soru bir' }))
    fireEvent.click(screen.getByRole('button', { name: 'q: Soru bir' }))

    expect(picks[0]).toMatchObject({ listKey: 'sss.liste', listIndex: '0', listField: 'q' })
  })

  it('bölümün yayın durumunu gösterir ve değiştirmeyi bildirir', () => {
    const toggled = []
    render(<OutlineTree sections={sections} onToggleSection={(item) => toggled.push(item.id)} />)

    expect(screen.getByTitle('Bölümü yayından kaldır')).toHaveTextContent('Online')
    fireEvent.click(screen.getByTitle('Bölümü yayına al')) // gizli bölüm
    expect(toggled).toEqual(['home.projeler'])
  })
})
