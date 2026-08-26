// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { api } from '../../services/api'

// export default function SignupPage() {
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   async function submit(event) {
//     event.preventDefault()
//     setLoading(true)
//     setError('')
//     const form = new FormData(event.currentTarget)

//     const password = form.get('password')
//     const confirm = form.get('confirm')

//     if (password !== confirm) {
//       setError('Passwords do not match')
//       setLoading(false)
//       return
//     }

//     try {
//       await api('/users/register', {
//         method: 'POST',
//         body: { name: form.get('name'), email: form.get('email'), password }
//       })
//       navigate('/dashboard')
//     } catch (err) {
//       setError(err.message || 'Registration failed')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <section className="page-banner" style={{ backgroundColor: '#03244c', padding: '6rem 0 4rem' }}>
//         <div className="shell">
//           <p className="eyebrow light">JOIN US</p>
//           <h1 style={{ color: 'white' }}>Create an account</h1>
//         </div>
//       </section>

//       <section className="auth-page shell" style={{ maxWidth: '500px', margin: '4rem auto' }}>
//         <form onSubmit={submit} className="admin-form">
//           <label>Full name
//             <input name="name" type="text" placeholder="Your name" required minLength="2" />
//           </label>
//           <label>Email address
//             <input name="email" type="email" placeholder="name@email.com" required />
//           </label>
//           <label>Password
//             <input name="password" type="password" required minLength="6" />
//           </label>
//           <label>Confirm Password
//             <input name="confirm" type="password" required minLength="6" />
//           </label>
//           {error && <p className="admin-error" style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
//           <div style={{ marginTop: '2rem' }}>
//             <button className="button primary" disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
//               {loading ? 'Creating account...' : 'Create account'} <span>&rarr;</span>
//             </button>
//             <p style={{ textAlign: 'center' }}>
//               Already have an account? <Link to="/login" style={{ color: '#8b1f24', fontWeight: 'bold' }}>Log in</Link>
//             </p>
//           </div>
//         </form>
//       </section>
//     </>
//   )
// }
