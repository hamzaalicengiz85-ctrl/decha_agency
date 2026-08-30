import { useEffect, useState } from 'react'
import AdminLogin from '../components/admin/AdminLogin'
import AdminShell from '../components/admin/AdminShell'
import { getSession, onAuthChange } from '../lib/adminAuth'
import { usePageMeta } from '../lib/seo'

/**
 * Yönetim paneli girişi (/yonetim).
 *
 * Bu kapı yalnızca arayüz düzeyindedir; asıl sınır RLS'tir. Buraya ulaşan
 * biri giriş formunu görür ve hiçbir şey yapamaz — istemci yalnızca anon
 * anahtarını taşır, yazma izni `authenticated` rolüne bağlıdır.
 */
export default function Admin() {
  usePageMeta({ title: 'Yönetim' })

  const [session, setSession] = useState(undefined) // undefined = henüz bilinmiyor
  const [reason, setReason] = useState('')

  useEffect(() => {
    let alive = true
    getSession().then((found) => {
      if (alive) setSession(found)
    })
    const unsubscribe = onAuthChange((next) => {
      if (!alive) return
      setSession(next)
      if (!next) setReason('Oturum kapandı, tekrar giriş yapın.')
    })
    return () => {
      alive = false
      unsubscribe()
    }
  }, [])

  // Oturum durumu okunana kadar hiçbir şey çizilmez; aksi hâlde her yenilemede
  // giriş formu bir an parlayıp kaybolur.
  if (session === undefined) return null

  if (!session) {
    return (
      <AdminLogin
        reason={reason}
        onSignedIn={(next) => {
          setReason('')
          setSession(next)
        }}
      />
    )
  }

  return (
    <AdminShell
      email={session.user?.email}
      onSignedOut={() => setSession(null)}
      onNeedsReauth={() => {
        setReason('Oturum süresi doldu, tekrar giriş yapın.')
        setSession(null)
      }}
    />
  )
}
