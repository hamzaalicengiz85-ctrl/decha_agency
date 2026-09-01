import { useState } from 'react'
import Field from '../ui/Field'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { signIn } from '../../lib/adminAuth'

/**
 * Yönetim girişi. Kullanıcı adı "admin"; arkada gerçek bir Supabase Auth
 * kullanıcısına bağlanır (src/lib/adminAuth.js).
 *
 * Şifre yöneticileri ve yapıştırma bilerek engellenmez (WCAG 2.2 —
 * Accessible Authentication).
 */
export default function AdminLogin({ onSignedIn, reason }) {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const result = await signIn(id, password)
    if (result.error) {
      setStatus('error')
      setMessage(result.error)
      return
    }
    setStatus('idle')
    setPassword('')
    onSignedIn?.(result.session)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form onSubmit={handleSubmit} noValidate className="panel brackets w-full max-w-sm p-7">
        <div className="mb-6 text-center">
          <Logo className="text-[26px]" />
          <h1 className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-accent/85">
            Yönetim Girişi
          </h1>
        </div>

        {reason ? (
          <p role="status" className="mb-5 border border-accent/40 bg-accent/[0.06] p-3 font-mono text-[11px] text-fg-muted">
            {reason}
          </p>
        ) : null}

        <Field
          label="Kullanıcı adı"
          required
          value={id}
          onChange={(event) => setId(event.target.value)}
          autoComplete="username"
          autoFocus
          className="mb-4"
        />

        <Field
          label="Şifre"
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className="mb-5"
        />

        {status === 'error' ? (
          <p role="alert" className="mb-4 border border-danger/50 bg-danger/10 p-3 font-mono text-[11px] text-danger">
            {message}
          </p>
        ) : null}

        {/* type="submit": Enter tuşuyla da giriş yapılabilsin. */}
        <Button type="submit" className="w-full justify-center" disabled={status === 'loading'}>
          {status === 'loading' ? 'Kontrol ediliyor…' : 'Giriş yap'}
        </Button>
      </form>
    </div>
  )
}
