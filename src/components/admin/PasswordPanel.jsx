import { useState } from 'react'
import Field from '../ui/Field'
import Button from '../ui/Button'
import { changePassword } from '../../lib/adminAuth'

export default function PasswordPanel() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [repeat, setRepeat] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | ok | error
  const [message, setMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (next !== repeat) {
      setStatus('error')
      setMessage('Yeni şifreler birbirini tutmuyor.')
      return
    }

    setStatus('loading')
    const result = await changePassword(current, next)
    if (result.error) {
      setStatus('error')
      setMessage(result.error)
      return
    }
    setStatus('ok')
    setMessage('Şifre değiştirildi.')
    setCurrent('')
    setNext('')
    setRepeat('')
  }

  return (
    <div className="max-w-md">
      <h2 className="font-display text-[19px] font-bold uppercase text-accent">Şifre değiştir</h2>
      <p className="mb-5 mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-fg-subtle">
        En az 8 karakter
      </p>

      <form onSubmit={handleSubmit} noValidate className="panel brackets space-y-4 p-5">
        <Field
          label="Mevcut şifre"
          required
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
        />
        <Field
          label="Yeni şifre"
          required
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
        />
        <Field
          label="Yeni şifre (tekrar)"
          required
          type="password"
          autoComplete="new-password"
          value={repeat}
          onChange={(event) => setRepeat(event.target.value)}
        />

        {message ? (
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className={
              status === 'error'
                ? 'border border-danger/50 bg-danger/10 p-3 font-mono text-[11px] text-danger'
                : 'border border-accent/40 bg-accent/[0.06] p-3 font-mono text-[11px] text-fg-muted'
            }
          >
            {message}
          </p>
        ) : null}

        <Button type="submit" size="sm" disabled={status === 'loading'}>
          {status === 'loading' ? 'Değiştiriliyor…' : 'Şifreyi değiştir'}
        </Button>
      </form>
    </div>
  )
}
