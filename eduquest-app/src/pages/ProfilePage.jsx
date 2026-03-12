// src/pages/ProfilePage.jsx — Week 9 / 10
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { User, Zap, Flame, Trophy, Edit2, Save, X } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, refreshProfile, signOut } = useAuth()
  const [editMode, setEditMode] = useState(false)
  const [username, setUsername] = useState('')
  const [saving, setSaving] = useState(false)
  const [rewards, setRewards] = useState([])
  const [stats, setStats] = useState({ completed: 0 })

  useEffect(() => {
    if (!user) return
    setUsername(profile?.username ?? '')
    const load = async () => {
      const [{ data: urData }, { data: progData }] = await Promise.all([
        supabase.from('user_rewards').select('*, rewards(reward_name, badge_icon, xp_required)').eq('user_id', user.id).order('unlocked_at'),
        supabase.from('user_progress').select('id').eq('user_id', user.id).eq('completed', true)
      ])
      setRewards(urData || [])
      setStats({ completed: progData?.length ?? 0 })
    }
    load()
  }, [user, profile])

  const handleSave = async () => {
    if (!username.trim() || username.trim().length < 3) {
      toast.error('Username must be at least 3 characters'); return
    }
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ username: username.trim() }).eq('id', user.id)
    setSaving(false)
    if (error) { toast.error('Failed to update: ' + error.message); return }
    await refreshProfile()
    setEditMode(false)
    toast.success('Username updated! ✅')
  }

  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0
  const nextLevelXP = [0,100,250,500,1000,2000,3500,5000,7500,10000]
  const nextXP = nextLevelXP[level] ?? 10000
  const prevXP = nextLevelXP[level - 1] ?? 0
  const levelPct = Math.min(100, ((xp - prevXP) / (nextXP - prevXP)) * 100)

  const statCards = [
    { icon: Zap,    color:'#6366f1', bg:'rgba(99,102,241,0.1)',  label:'Total XP',   value: xp },
    { icon: Trophy, color:'#f97316', bg:'rgba(249,115,22,0.1)',  label:'Level',      value: `Lv ${level}` },
    { icon: Flame,  color:'#ef4444', bg:'rgba(239,68,68,0.1)',   label:'Day Streak', value: `${streak} 🔥` },
    { icon: User,   color:'#22c55e', bg:'rgba(34,197,94,0.1)',   label:'Challenges', value: `${stats.completed}/30` },
  ]

  return (
    <Layout>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
            👤 <span className="glow-text">Profile</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your adventurer profile</p>
        </motion.div>

        {/* Profile Hero */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ padding: 32, marginBottom: 24, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div className="pulse-glow" style={{
              width: 90, height: 90, borderRadius: '50%',
              background: 'var(--gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 900, color: 'white', flexShrink: 0
            }}>
              {(profile?.username?.[0] ?? '?').toUpperCase()}
            </div>

            {/* Info */}
            <div style={{ flex: 1 }}>
              {editMode ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <input
                    className="input-field"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ maxWidth: 260, padding: '10px 14px' }}
                    placeholder="New username"
                    autoFocus
                  />
                  <button className="btn btn-primary" style={{ padding: '10px 16px' }} onClick={handleSave} disabled={saving}>
                    {saving ? '...' : <Save size={16} />}
                  </button>
                  <button className="btn btn-ghost" style={{ padding: '10px 14px' }} onClick={() => { setEditMode(false); setUsername(profile?.username ?? '') }}>
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{profile?.username}</h2>
                  <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={() => setEditMode(true)}>
                    <Edit2 size={14} />
                  </button>
                </div>
              )}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 12 }}>{user?.email}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(99,102,241,0.3)' }}>
                  Level {level} Adventurer
                </span>
                <span style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.25)' }}>
                  🔥 {streak} Day Streak
                </span>
                {rewards.length > 0 && (
                  <span style={{ background: 'rgba(234,179,8,0.12)', color: '#eab308', padding: '4px 12px', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, border: '1px solid rgba(234,179,8,0.25)' }}>
                    🏅 {rewards.length} Badge{rewards.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{xp} XP</span>
              <span>{nextXP} XP (Lv {level + 1})</span>
            </div>
            <div className="xp-bar-wrap" style={{ height: 12 }}>
              <div className="xp-bar-fill" style={{ width: `${levelPct}%`, height: '100%' }} />
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: 14, marginBottom: 24 }}>
          {statCards.map(({ icon: Icon, color, bg, label, value }, i) => (
            <motion.div key={label} className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
              style={{ padding: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color, fontFamily: "'Space Grotesk',sans-serif" }}>{value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginTop: 2 }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>🏅 Earned Badges</h3>
          {rewards.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 24, fontSize: '0.9rem' }}>Complete challenges to unlock badges! 🚀</p>
          ) : (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {rewards.map(ur => (
                <motion.div key={ur.id} whileHover={{ scale: 1.1, y: -4 }}
                  title={`${ur.rewards?.reward_name} — ${ur.rewards?.xp_required} XP required`}
                  style={{
                    textAlign: 'center', padding: '14px 18px',
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                    borderRadius: 14, cursor: 'default', transition: 'all 0.2s'
                  }}>
                  <div style={{ fontSize: '2rem', marginBottom: 6 }}>{ur.rewards?.badge_icon}</div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{ur.rewards?.reward_name}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Account Info */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} style={{ padding: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Account</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Email</span>
              <span style={{ fontSize: '0.88rem' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Member since</span>
              <span style={{ fontSize: '0.88rem' }}>{new Date(profile?.created_at ?? Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
          <button className="btn btn-ghost" style={{ marginTop: 16, width: '100%', justifyContent: 'center', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }} onClick={signOut}>
            Sign Out
          </button>
        </motion.div>
      </div>
    </Layout>
  )
}
