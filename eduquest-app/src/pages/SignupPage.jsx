// src/pages/SignupPage.jsx — Week 6
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, User, UserPlus } from 'lucide-react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (pw) => {
    if (pw.length < 8) return 'Password must be at least 8 characters.'
    if (!/[A-Z]/.test(pw)) return 'Password must contain at least one uppercase letter.'
    if (!/[0-9]/.test(pw)) return 'Password must contain at least one number.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.username || !form.password || !form.confirm) {
      setError('Please fill in all fields.'); return
    }
    if (form.username.length < 3) { setError('Username must be at least 3 characters.'); return }
    const pwErr = validatePassword(form.password)
    if (pwErr) { setError(pwErr); return }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }

    setLoading(true)
    const { error: err } = await signUp(form.email, form.password, form.username)
    setLoading(false)
    if (err) { setError(err.message); return }
    toast.success('Account created! Your quest begins now 🚀')
    navigate('/dashboard')
  }

  const Field = ({ id, label, icon: Icon, type, placeholder, field }) => (
    <div>
      <label style={{ display:'block', marginBottom:6, fontSize:'0.85rem', fontWeight:600, color:'var(--text-secondary)' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <Icon size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)', pointerEvents:'none' }} />
        <input id={id} type={type} className="input-field" style={{ paddingLeft:40 }} placeholder={placeholder}
          value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)', padding:24 }}>
      <div style={{ position:'fixed', top:'10%', right:'10%', width:350, height:350, borderRadius:'50%', background:'rgba(99,102,241,0.1)', filter:'blur(100px)' }} />
      <div style={{ position:'fixed', bottom:'10%', left:'5%', width:250, height:250, borderRadius:'50%', background:'rgba(139,92,246,0.08)', filter:'blur(80px)' }} />

      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        style={{ width:'100%', maxWidth:460, zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <Link to="/" style={{ textDecoration:'none', display:'inline-flex', flexDirection:'column', alignItems:'center', gap:12 }}>
            <div className="float" style={{ width:56, height:56, borderRadius:16, background:'var(--gradient)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--glow)' }}>
              <Zap size={28} color="white" fill="white" />
            </div>
            <span style={{ fontSize:'1.5rem', fontWeight:800 }}>Edu<span className="glow-text">Quest</span></span>
          </Link>
          <p style={{ color:'var(--text-secondary)', marginTop:8, fontSize:'0.95rem' }}>Begin your learning adventure</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:24 }}>Create Account</h2>

          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:12, marginBottom:20, color:'#f87171', fontSize:'0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Field id="signup-email"    label="Email"            icon={Mail} type="email"    placeholder="you@example.com" field="email" />
            <Field id="signup-username" label="Username"         icon={User} type="text"    placeholder="CoolLearner42"   field="username" />
            <Field id="signup-password" label="Password"         icon={Lock} type="password" placeholder="Min 8 chars, 1 uppercase, 1 number" field="password" />
            <Field id="signup-confirm"  label="Confirm Password" icon={Lock} type="password" placeholder="Repeat password" field="confirm" />

            {/* Password requirements */}
            <div style={{ fontSize:'0.75rem', color:'var(--text-secondary)', lineHeight:1.8 }}>
              Password requirements:
              {['At least 8 characters','One uppercase letter','One number'].map(r => (
                <div key={r} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:'var(--primary)' }}>·</span> {r}
                </div>
              ))}
            </div>

            <button id="signup-submit" type="submit" className="btn btn-primary" style={{ marginTop:4, padding:14, fontSize:'1rem' }} disabled={loading}>
              {loading ? (
                <div style={{ width:20, height:20, borderRadius:'50%', border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'white', animation:'spin 0.8s linear infinite' }} />
              ) : (
                <><UserPlus size={18} /> Create Account</>
              )}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, color:'var(--text-secondary)', fontSize:'0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--primary)', fontWeight:600, textDecoration:'none' }}>Sign in →</Link>
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </motion.div>
    </div>
  )
}
