// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { api } from '../../services/api'

// export default function LoginPage() {
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   async function submit(event) {
//     event.preventDefault()
//     setLoading(true)
//     setError('')
//     const form = new FormData(event.currentTarget)
//     try {
//       const response = await api('/users/login', {
//         method: 'POST',
//         body: { email: form.get('email'), password: form.get('password') }
//       })
//       const role = response.data.user.role
//       if (['admin', 'superAdmin'].includes(role)) {
//         navigate('/admin')
//       } else {
//         navigate('/dashboard')
//       }
//     } catch (err) {
//       setError(err.message || 'Login failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <section className="page-banner" style={{ backgroundColor: '#03244c', padding: '6rem 0 4rem' }}>
//         <div className="shell">
//           <p className="eyebrow light">ACCOUNT</p>
//           <h1 style={{ color: 'white' }}>Sign in</h1>
//         </div>
//       </section>
//       <section className="shell" style={{ padding: '4rem 0', maxWidth: '480px', margin: '0 auto' }}>
//         <form onSubmit={submit} style={{ background: '#f5f7fa', padding: '2rem', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
//           <label>Email
//             <input name="email" type="email" required />
//           </label>
//           <label>Password
//             <input name="password" type="password" required />
//           </label>
//           {error && <p className="admin-error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
//           <div style={{ marginTop: '2rem' }}>
//             <button className="button primary" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
//               {loading ? 'Signing in...' : 'Sign in'} <span>&rarr;</span>
//             </button>
//             <p style={{ textAlign: 'center' }}>
//               Don&apos;t have an account? <Link to="/signup" style={{ color: '#8b1f24', fontWeight: 'bold' }}>Sign up</Link>
//             </p>
//             <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
//               <Link to="/forgot-password">Forgot password?</Link>
//             </p>
//           </div>
//         </form>
//       </section>
//     </>
//   )
// }
