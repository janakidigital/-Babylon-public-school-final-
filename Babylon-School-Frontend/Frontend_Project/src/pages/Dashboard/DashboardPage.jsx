// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { api } from '../../services/api'

// export default function DashboardPage() {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const navigate = useNavigate()

//   useEffect(() => {
//     api('/users/profile')
//       .then(res => setUser(res.data))
//       .catch(() => navigate('/'))          // ← changed from '/login' to '/'
//       .finally(() => setLoading(false))
//   }, [navigate])

//   async function logout() {
//     await api('/users/logout', { method: 'POST' }).catch(() => {})
//     navigate('/')
//   }

//   if (loading) return <main className="admin-login"><p>Loading profile...</p></main>
//   if (!user) return null

//   return (
//     <>
//       <section className="page-banner" style={{ backgroundColor: '#03244c', padding: '6rem 0 4rem' }}>
//         <div className="shell">
//           <p className="eyebrow light">DASHBOARD</p>
//           <h1 style={{ color: 'white' }}>Welcome back, {user.name}</h1>
//         </div>
//       </section>

//       <section className="shell" style={{ padding: '4rem 0', maxWidth: '600px', margin: '0 auto' }}>
//         <div style={{ background: '#f5f7fa', padding: '2rem', borderRadius: '8px', border: '1px solid #e1e4e8' }}>
//           <h2 style={{ marginTop: 0 }}>Profile Details</h2>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Account Type:</strong> {user.role === 'user' ? 'Student / Parent' : user.role}</p>

//           {['admin', 'superAdmin'].includes(user.role) && (
//             <p style={{ marginTop: '1rem' }}>
//               <a href="/admin" className="button primary">Open Admin Panel</a>
//             </p>
//           )}

//           <button className="button primary" onClick={logout} style={{ marginTop: '2rem' }}>
//             Sign out
//           </button>
//         </div>
//       </section>
//     </>
//   )
// }