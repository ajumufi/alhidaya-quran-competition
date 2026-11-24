import React, { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { LogIn, LogOut, Download, RefreshCw, ExternalLink, Search } from 'lucide-react'
import './admin.css'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
const db = url && key ? createClient(url, key) : null

export default function Admin() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rows, setRows] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  async function load() {
    if (!db) return
    setBusy(true)
    setError('')
    const { data, error: loadError } = await db
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (loadError) {
      setError(loadError.message)
      setRows([])
      setBusy(false)
      return
    }

    const withPhotos = await Promise.all((data || []).map(async row => {
      if (!row.photo_path) return { ...row, photo_url: null }
      const { data: photoData } = await db.storage
        .from('participant-photos')
        .createSignedUrl(row.photo_path, 300)
      return { ...row, photo_url: photoData?.signedUrl || null }
    }))

    setRows(withPhotos)
    setBusy(false)
  }

  async function login(e) {
    e.preventDefault()
    if (!db) {
      setError('Supabase is not configured.')
      return
    }
    setBusy(true)
    setError('')
    const { data, error: loginError } = await db.auth.signInWithPassword({ email, password })
    if (loginError) {
      setError(loginError.message)
      setBusy(false)
      return
    }
    setSession(data.session)
    await load()
  }

  async function logout() {
    if (db) await db.auth.signOut()
    setSession(null)
    setRows([])
    setPassword('')
  }

  function exportCsv() {
    const headers = [
      'Registration Number', 'Name', 'Phone', 'WhatsApp', 'Email',
      'State', 'District', 'Institution', 'Category', 'Submitted'
    ]
    const values = filteredRows.map(r => [
      r.registration_code, r.full_name, r.phone, r.whatsapp, r.email,
      r.state, r.district, r.institution, r.category, r.created_at
    ])
    const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`
    const csv = [headers, ...values].map(row => row.map(quote).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const objectUrl = URL.createObjectURL(blob)
    link.href = objectUrl
    link.download = 'al-hidaya-registrations.csv'
    link.click()
    URL.revokeObjectURL(objectUrl)
  }

  const filteredRows = rows.filter(row => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [
      row.registration_code, row.full_name, row.phone, row.whatsapp,
      row.institution, row.state, row.district, row.category
    ].some(value => String(value || '').toLowerCase().includes(q))
  })

  if (!session) {
    return (
      <main className="adminWrap">
        <form className="adminLogin" onSubmit={login}>
          <span className="adminKicker">AL HIDAYA · ORGANISER ACCESS</span>
          <h1>Admin sign in</h1>
          <p>Sign in with the organiser account created in Supabase Authentication.</p>
          {error && <div className="adminError">{error}</div>}
          <label>
            Email
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </label>
          <button disabled={busy}>
            <LogIn size={16} /> {busy ? 'Signing in…' : 'Sign in'}
          </button>
          <a href="/">← Back to public website</a>
        </form>
      </main>
    )
  }

  return (
    <main className="adminPage">
      <header>
        <div>
          <span className="adminKicker">AL HIDAYA · ORGANISER PANEL</span>
          <h1>Registrations</h1>
        </div>
        <div className="adminActions">
          <button onClick={load} disabled={busy}><RefreshCw size={15} /> Refresh</button>
          <button onClick={exportCsv}><Download size={15} /> Export CSV</button>
          <button onClick={logout}><LogOut size={15} /> Sign out</button>
        </div>
      </header>

      {error && <div className="adminError">{error}</div>}

      <div className="adminStats">
        <div><small>TOTAL REGISTRATIONS</small><b>{rows.length}</b></div>
      </div>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '20px 0' }}>
        <Search size={18} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search name, registration number, phone, institution..."
          style={{ flex: 1, minWidth: 0, padding: '12px 14px', borderRadius: 8, border: '1px solid #ccd5d8' }}
        />
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Registration Number</th>
              <th>Participant</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Institution / Category</th>
              <th>Aadhaar</th>
              <th>Photo</th>
              <th>Submitted</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <tr key={row.id}>
                <td><b>{row.registration_code || 'Not assigned'}</b></td>
                <td><b>{row.full_name}</b></td>
                <td>
                  {row.phone}
                  <small>{row.whatsapp}</small>
                  <small>{row.email || '—'}</small>
                </td>
                <td>{row.state}<small>{row.district}</small></td>
                <td>{row.institution}<small>{row.category}</small></td>
                <td>•••• •••• {String(row.aadhaar_number || '').slice(-4) || '—'}</td>
                <td>
                  {row.photo_url
                    ? <a href={row.photo_url} target="_blank" rel="noreferrer">View photo <ExternalLink size={13} /></a>
                    : '—'}
                </td>
                <td>{row.created_at ? new Date(row.created_at).toLocaleString('en-IN') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredRows.length && (
          <p className="emptyState">{busy ? 'Loading registrations…' : 'No registrations found.'}</p>
        )}
      </div>

      <p className="adminFoot">
        Keep this page private. Aadhaar numbers are masked in this panel and are not included in CSV exports.
      </p>
    </main>
  )
}
