import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import Icon from '../ui/Icon'
import RecordPanel from './RecordPanel'
import InboxPanel from './InboxPanel'
import PasswordPanel from './PasswordPanel'
import { signOut } from '../../lib/adminAuth'

const SECTIONS = [
  { key: 'services', label: 'Hizmetler', kind: 'record' },
  { key: 'projects', label: 'Projeler', kind: 'record' },
  { key: 'posts', label: 'Blog yazıları', kind: 'record' },
  { key: 'testimonials', label: 'Referanslar', kind: 'record' },
  { key: 'contact_messages', label: 'İletişim mesajları', kind: 'inbox' },
  { key: 'meeting_requests', label: 'Toplantı talepleri', kind: 'inbox' },
  { key: 'password', label: 'Şifre', kind: 'password' },
]

export default function AdminShell({ email, onSignedOut, onNeedsReauth }) {
  const [active, setActive] = useState(SECTIONS[0].key)
  const section = SECTIONS.find((item) => item.key === active) ?? SECTIONS[0]

  async function handleSignOut() {
    await signOut()
    onSignedOut?.()
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-60 shrink-0 flex-col border-r border-accent/35">
        <div className="border-b border-accent/35 p-5">
          <Logo className="text-[22px]" />
          <p className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-accent/70">
            Yönetim
          </p>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            {SECTIONS.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => setActive(item.key)}
                  aria-current={item.key === active ? 'page' : undefined}
                  className={[
                    'w-full px-3 py-2 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition',
                    item.key === active
                      ? 'bg-accent text-accent-fg'
                      : 'text-fg-muted hover:bg-accent/10 hover:text-accent',
                  ].join(' ')}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-accent/35 p-3">
          <p className="mb-2 truncate px-1 font-mono text-[10px] text-fg-subtle">{email}</p>
          <Link
            to="/"
            className="mb-1 block px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-muted transition hover:text-accent"
          >
            <Icon name="arrow" className="mr-1.5 inline h-3 w-3 rotate-180" />
            Siteye dön
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full px-3 py-2 text-left font-mono text-[10.5px] uppercase tracking-[0.14em] text-danger transition hover:underline"
          >
            Çıkış yap
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-3xl">
          {section.kind === 'record' ? (
            <RecordPanel key={section.key} typeKey={section.key} onNeedsReauth={onNeedsReauth} />
          ) : null}
          {section.kind === 'inbox' ? <InboxPanel key={section.key} table={section.key} /> : null}
          {section.kind === 'password' ? <PasswordPanel /> : null}
        </div>
      </main>
    </div>
  )
}
