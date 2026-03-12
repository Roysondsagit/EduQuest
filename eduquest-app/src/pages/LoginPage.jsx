// src/pages/LoginPage.jsx — Week 6
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, LogIn } from 'lucide-react'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    const { error: err } = await signIn(form.email, form.password)
    setLoading(false)
    if (err) { setError(err.message); return }
    toast.success('Welcome back, adventurer! ⚡')
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)', padding:24 }}>
      {/* Glow blobs */}
      <div style={{ position:'fixed', top:'20%', left:'5%', width:350, height:350, borderRadius:'50%', background:'rgba(99,102,241,0.1)', filter:'blur(100px)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'15%', right:'5%', width:300, height:300, borderRadius:'50%', background:'rgba(139,92,246,0.08)', filter:'blur(80px)', pointerEvents:'none' }} />

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ width:'100%', maxWidth:440, zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div className="float" style={{ width:56, height:56, borderRadius:16, background:'var(--gradient)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--glow)' }}>
              <Zap size={28} color="white" fill="white" />
            </div>
            <span style={{ fontSize:'1.5rem', fontWeight:800 }}>Edu<span className="glow-text">Quest</span></span>
          </Link>
          <p style={{ color:'var(--text-secondary)', marginTop:8, fontSize:'0.95rem' }}>Sign in to continue your quest</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:24 }}>Welcome Back</h2>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:12, marginBottom:20, color:'#f87171', fontSize:'0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', marginBottom:6, fontSize:'0.85rem', fontWeight:600, color:'var(--text-secondary)' }}>Email</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)', pointerEvents:'none' }} />
                <input id="login-email" type="email" className="input-field" style={{ paddingLeft:40 }} placeholder="you@example.com"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label style={{ display:'block', marginBottom:6, fontSize:'0.85rem', fontWeight:600, color:'var(--text-secondary)' }}>Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)', pointerEvents:'none' }} />
                <input id="login-password" type="password" className="input-field" style={{ paddingLeft:40 }} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary" style={{ marginTop:8, padding:'14px', fontSize:'1rem' }} disabled={loading}>
              {loading ? (
                <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', animation:'spin 0.8s linear infinite' }} />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, color:'var(--text-secondary)', fontSize:'0.9rem' }}>
            Don't have an account? <Link to="/signup" style={{ color:'var(--primary)', fontWeight:600, textDecoration:'none' }}>Create one →</Link>
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </motion.div>
    </div>
  )
}
