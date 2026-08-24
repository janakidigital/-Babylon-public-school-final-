import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import { slugify } from '../lib/media'
import { resources, singletons } from './resourceConfig'

const blank = (config) => Object.fromEntries(config.fields.map(([key]) => [key, '']))

function Login({ onLogin }) {
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event) { event.preventDefault(); setLoading(true); setError(''); const form = new FormData(event.currentTarget); try { const response = await api('/users/login', { method: 'POST', body: { email: form.get('email'), password: form.get('password') } }); if (!['admin', 'superAdmin'].includes(response.data.user.role)) throw new Error('This account does not have admin access'); onLogin(response.data.user) } catch (err) { setError(err.message) } finally { setLoading(false) } }
  return <main className="admin-login"><form onSubmit={submit}><p className="eyebrow">BABYLON ADMIN</p><h1>Content management</h1><p>Sign in to manage the information shown across the school website.</p><label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" required /></label>{error && <p className="admin-error">{error}</p>}<button className="button primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'} <span>&rarr;</span></button><a href="/">Return to website</a></form></main>
}

function ResourceEditor({ resourceKey, onBack }) {
  const config = resources[resourceKey]; const [items, setItems] = useState([]); const [editing, setEditing] = useState(null); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(true)
  const formValues = useMemo(() => editing ? { ...blank(config), ...editing } : blank(config), [editing, config])
  const load = async () => { setLoading(true); try { const response = await api(config.endpoint); setItems(response.data || []) } catch (err) { setMessage(err.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [resourceKey])
  async function save(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const image = form.get('image');
    if (!image?.name) form.delete('image');
    if (form.has('slug') && !String(form.get('slug') || '').trim()) {
      form.set('slug', slugify(form.get('title') || form.get('name') || `item-${Date.now()}`));
    }
    const body = config.image ? form : Object.fromEntries(form.entries());
    try {
      await api(`${config.endpoint}${editing?._id ? `/${editing._id}` : ''}`, { method: editing?._id ? 'PUT' : 'POST', body });
      setEditing(null);
      setMessage(`${config.label} saved successfully.`);
      window.dispatchEvent(new CustomEvent('site-data-updated'));
      load();
    } catch (err) { setMessage(err.message) }
  }
  async function remove(id) { if (!window.confirm('Delete this item?')) return; try { await api(`${config.endpoint}/${id}`, { method: 'DELETE' }); setMessage('Item deleted.'); window.dispatchEvent(new CustomEvent('site-data-updated')); load() } catch (err) { setMessage(err.message) } }
  return <section className="admin-resource"><div className="admin-resource-head"><button className="admin-back" onClick={onBack}>&larr; Dashboard</button><div><p className="eyebrow">CONTENT EDITOR</p><h2>{config.label}</h2></div><button className="button primary" onClick={() => setEditing({})}>Add {config.label.slice(0, -1)}</button></div>{message && <p className="admin-message">{message}</p>}
    {editing !== null && <form className="admin-form" onSubmit={save}>{config.fields.map(([key, label, type = 'text']) => <label key={key}>{label}{type === 'textarea' ? <textarea name={key} defaultValue={formValues[key] || ''} required={['title', 'name', 'question', 'description', 'content'].includes(key)} /> : <input name={key} type={type} defaultValue={type === 'date' && formValues[key] ? String(formValues[key]).slice(0, 10) : formValues[key] || ''} required={['title', 'name', 'question', 'description', 'content'].includes(key)} />}</label>)}{config.image && <label>Image upload<input name="image" type="file" accept="image/*" /></label>}<div><button className="button primary">Save changes <span>&rarr;</span></button><button className="admin-cancel" type="button" onClick={() => setEditing(null)}>Cancel</button></div></form>}
    {loading ? <p>Loading {config.label.toLowerCase()}...</p> : <div className="admin-table">{items.length === 0 ? <p>No {config.label.toLowerCase()} yet.</p> : items.map((item) => <article key={item._id}><div>{item.image && <img src={item.image} alt="" />}<div><h3>{item.title || item.name || item.question}</h3><p>{item.shortDescription || item.description || item.designation || item.category || item.answer || 'No description'}</p></div></div><div className="admin-row-actions"><button onClick={() => setEditing(item)}>Edit</button><button className="delete" onClick={() => remove(item._id)}>Delete</button></div></article>)}</div>}</section>
}

function SingletonEditor({ singletonKey, onBack }) {
  const config = singletons[singletonKey]; const [data, setData] = useState(null); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(true)
  const load = async () => { setLoading(true); try { const response = await api(config.endpoint); setData(response.data || {}) } catch (err) { setMessage(err.message) } finally { setLoading(false) } }
  useEffect(() => { load() }, [singletonKey])
  async function save(event) { event.preventDefault(); const form = new FormData(event.currentTarget); const formDataObj = Object.fromEntries(form.entries()); const body = {}; Object.entries(config.schema).forEach(([section, fields]) => { if (section !== 'root') body[section] = {}; fields.forEach(([key]) => { if (section === 'root') body[key] = formDataObj[`${section}.${key}`]; else body[section][key] = formDataObj[`${section}.${key}`] }) }); try { await api(config.endpoint, { method: 'PUT', body }); setMessage(`${config.label} saved successfully.`); window.dispatchEvent(new CustomEvent('site-data-updated')) } catch (err) { setMessage(err.message) } }
  return <section className="admin-resource"><div className="admin-resource-head"><button className="admin-back" onClick={onBack}>&larr; Dashboard</button><div><p className="eyebrow">CONTENT EDITOR</p><h2>{config.label}</h2></div></div>{message && <p className="admin-message">{message}</p>}
    {loading ? <p>Loading {config.label.toLowerCase()}...</p> : <form className="admin-form" onSubmit={save}>{Object.entries(config.schema).map(([section, fields]) => <fieldset key={section} className="admin-fieldset"><legend>{section === 'root' ? 'General' : section}</legend>{fields.map(([key, label, type = 'text']) => <label key={key}>{label}{type === 'textarea' ? <textarea name={`${section}.${key}`} defaultValue={section === 'root' ? data?.[key] || '' : data?.[section]?.[key] || ''} /> : <input name={`${section}.${key}`} type={type} defaultValue={section === 'root' ? data?.[key] || '' : data?.[section]?.[key] || ''} />}</label>)}</fieldset>)}<div><button className="button primary">Save changes <span>&rarr;</span></button></div></form>}</section>
}

function Inbox({ endpoint, title, fields, onBack }) { const [items, setItems] = useState([]); useEffect(() => { api(endpoint).then((response) => setItems(response.data || [])).catch(() => setItems([])) }, [endpoint]); return <section className="admin-resource"><button className="admin-back" onClick={onBack}>&larr; Dashboard</button><p className="eyebrow">INBOX</p><h2>{title}</h2><div className="admin-table">{items.length === 0 ? <p>No submissions yet.</p> : items.map((item) => <article key={item._id}><div><h3>{item.name || item.fullName || item.email}</h3>{fields.map((field) => <p key={field}><b>{field}:</b> {item[field] || '—'}</p>)}</div><span className="status-chip">{item.status || 'New'}</span></article>)}</div></section> }

function CreateAdmin({ onBack }) {
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    const form = new FormData(event.currentTarget);
    try {
      await api('/users/admin', { method: 'POST', body: { name: form.get('name'), email: form.get('email'), password: form.get('password') } });
      setMessage('Admin account created successfully.');
      event.target.reset();
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return <section className="admin-resource"><div className="admin-resource-head"><button className="admin-back" onClick={onBack}>&larr; Dashboard</button><div><p className="eyebrow">SUPER ADMIN</p><h2>Create New Admin</h2></div></div>
    {message && <p className="admin-message">{message}</p>}
    <form className="admin-form" onSubmit={submit} style={{ maxWidth: '400px' }}>
      <label>Full Name<input name="name" type="text" required /></label>
      <label>Email Address<input name="email" type="email" required /></label>
      <label>Password<input name="password" type="password" required minLength="6" /></label>
      {error && <p className="admin-error">{error}</p>}
      <div><button className="button primary" disabled={loading}>{loading ? 'Creating...' : 'Create Admin'} <span>&rarr;</span></button></div>
    </form>
  </section>
}

export default function AdminPage() { const [user, setUser] = useState(null); const [view, setView] = useState(null); const [checking, setChecking] = useState(true)
  useEffect(() => { api('/users/profile').then((response) => { if (['admin', 'superAdmin'].includes(response.data.role)) setUser(response.data) }).catch(() => {}).finally(() => setChecking(false)) }, [])
  if (checking) return <main className="admin-login"><p>Checking admin access...</p></main>
  if (!user) return <Login onLogin={setUser} />
  if (view === 'create-admin' && user.role === 'superAdmin') return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><CreateAdmin onBack={() => setView(null)} /></main>
  if (resources[view]) return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><ResourceEditor resourceKey={view} onBack={() => setView(null)} /></main>
  if (singletons[view]) return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><SingletonEditor singletonKey={view} onBack={() => setView(null)} /></main>
  if (view === 'admissions') return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><Inbox endpoint="/admissions" title="Admission enquiries" fields={['email', 'phone', 'program', 'parentName']} onBack={() => setView(null)} /></main>
  if (view === 'contacts') return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><Inbox endpoint="/contacts" title="Contact messages" fields={['email', 'phone', 'subject', 'message']} onBack={() => setView(null)} /></main>
  if (view === 'career-apps') return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><Inbox endpoint="/career-applications" title="Career applications" fields={['email', 'phone', 'careerTitle', 'coverLetter']} onBack={() => setView(null)} /></main>
  return <main className="admin-shell"><AdminTop user={user} onLogout={() => setUser(null)} /><section className="admin-dashboard"><p className="eyebrow">DASHBOARD</p><h1>Welcome back, {user.name}.</h1><p>Manage the live content shown on the Babylon website. About and student-life copy stay on the public pages.</p><div className="admin-grid">{Object.entries(singletons).map(([key, config]) => <button key={key} onClick={() => setView(key)}><strong>{config.label}</strong><span>Manage page &rarr;</span></button>)}{Object.entries(resources).map(([key, config]) => <button key={key} onClick={() => setView(key)}><strong>{config.label}</strong><span>Manage content &rarr;</span></button>)}<button onClick={() => setView('admissions')}><strong>Admissions</strong><span>Review enquiries &rarr;</span></button><button onClick={() => setView('contacts')}><strong>Contact inbox</strong><span>Review messages &rarr;</span></button><button onClick={() => setView('career-apps')}><strong>Career applications</strong><span>Review applications &rarr;</span></button>{user.role === 'superAdmin' && <button onClick={() => setView('create-admin')}><strong>Admin Users</strong><span>Create admins &rarr;</span></button>}</div></section></main>
}

function AdminTop({ user, onLogout }) { async function logout() { await api('/users/logout', { method: 'POST' }).catch(() => {}); onLogout() } return <header className="admin-top"><a href="/">BABYLON <span>ADMIN</span></a><div>{user.name} <button onClick={logout}>Sign out</button></div></header> }
