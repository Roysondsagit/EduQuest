// src/pages/DashboardPage.jsx — Weeks 7, 9
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import { Zap, Flame, Trophy, Sword, Star, ArrowRight, CheckCircle } from 'lucide-react'

function XPRing({ xp, level }) {
  const nextLevelXP = [0,100,250,500,1000,2000,3500,5000,7500,10000]
  const prevXP = nextLevelXP[level - 1] ?? 0
  const nextXP = nextLevelXP[level] ?? 10000
  const pct = Math.min(100, ((xp - prevXP) / (nextXP - prevXP)) * 100) || 0
  const r = 48, circ = 2 * Math.PI * r
  return (
    <div className="ring-container" style={{ width:120, height:120 }}>
      <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--primary)" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" style={{ filter:'drop-shadow(0 0 6px var(--primary))', transition:'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="ring-text" style={{ flexDirection:'column', display:'flex', alignItems:'center' }}>
        <span style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }} className="glow-text">Lv{level}</span>
        <span style={{ fontSize:'0.65rem', color:'var(--text-secondary)' }}>{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile, refreshProfile } = useAuth()
  const [recentProgress, setRecentProgress] = useState([])
  const [userRewards, setUserRewards] = useState([])
  const [stats, setStats] = useState({ completed: 0, total: 30 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [{ data: progress }, { data: rewards }, { data: totalProg }] = await Promise.all([
        supabase.from('user_progress').select('*, challenges(title,xp_reward,difficulty)').eq('user_id', user.id).eq('completed', true).order('completion_date', { ascending:false }).limit(5),
        supabase.from('user_rewards').select('*, rewards(reward_name, badge_icon, xp_required)').eq('user_id', user.id).order('unlocked_at', { ascending:false }).limit(6),
        supabase.from('user_progress').select('id').eq('user_id', user.id).eq('completed', true)
      ])
      setRecentProgress(progress || [])
      setUserRewards(rewards || [])
      setStats({ completed: totalProg?.length ?? 0, total: 30 })
      setLoading(false)
    }
    load()
    refreshProfile()
  }, [user])

  const nextLevelXP = [0,100,250,500,1000,2000,3500,5000,7500,10000]
  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0
  const nextXP = nextLevelXP[level] ?? 10000
  const xpPct = nextLevelXP[level] ? Math.min(100, ((xp - (nextLevelXP[level-1] ?? 0)) / (nextXP - (nextLevelXP[level-1] ?? 0))) * 100) : 100

  const cards = [
    { icon: Zap,    color:'#6366f1', label:'Total XP',   value: xp,               unit:' XP', glow:'rgba(99,102,241,0.3)' },
    { icon: Star,   color:'#f97316', label:'Level',      value: level,            unit:'',    glow:'rgba(249,115,22,0.3)' },
    { icon: Flame,  color:'#ef4444', label:'Day Streak', value: profile?.streak ?? 0, unit:' 🔥', glow:'rgba(239,68,68,0.3)' },
    { icon: Trophy, color:'#22c55e', label:'Completed',  value: stats.completed,  unit:`/${stats.total}`, glow:'rgba(34,197,94,0.3)' },
  ]

  return (
    <Layout>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        {/* Header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:4 }}>
            Hey, <span className="glow-text">{profile?.username ?? 'Adventurer'}</span> 👋
          </h1>
          <p style={{ color:'var(--text-secondary)' }}>Ready to level up today?</p>
        </motion.div>

        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:32 }}>
          {cards.map(({ icon:Icon, color, label, value, unit, glow }, i) => (
            <motion.div key={label} className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
              style={{ padding:24, borderColor:`rgba(${glow.match(/\d+/g).slice(0,3).join(',')},0.2)` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:500 }}>{label}</span>
              </div>
              <div style={{ fontSize:'2rem', fontWeight:900, fontFamily:"'Space Grotesk',sans-serif", lineHeight:1 }}>
                {loading ? <div className="skeleton" style={{ width:60, height:28, borderRadius:6 }} /> : <span style={{ color }}>{value}</span>}
                {!loading && <span style={{ fontSize:'1rem', color:'var(--text-secondary)', fontWeight:500 }}>{unit}</span>}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,520px),1fr))', gap:24 }}>
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* XP Progress */}
            <motion.div className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ padding:28 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontWeight:700 }}>Level Progress</h3>
                <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{xp} / {nextXP} XP</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:24 }}>
                <XPRing xp={xp} level={level} />
                <div style={{ flex:1 }}>
                  <div className="xp-bar-wrap" style={{ height:12, marginBottom:12 }}>
                    <div className="xp-bar-fill" style={{ width:`${xpPct}%`, height:'100%' }} />
                  </div>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>
                    <span style={{ color:'var(--primary)', fontWeight:700 }}>{nextXP - xp} XP</span> until Level {level + 1}
                  </p>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.8rem', marginTop:4 }}>
                    Keep completing challenges to level up! ⚡
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Recent Completions */}
            <motion.div className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }} style={{ padding:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ fontWeight:700 }}>Recent Completions</h3>
                <Link to="/challenges" style={{ color:'var(--primary)', fontSize:'0.85rem', textDecoration:'none', display:'flex', alignItems:'center', gap:4, fontWeight:600 }}>
                  All Challenges <ArrowRight size={14} />
                </Link>
              </div>
              {loading ? (
                [...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{ height:52, borderRadius:10, marginBottom:8 }} />)
              ) : recentProgress.length === 0 ? (
                <div style={{ textAlign:'center', padding:32, color:'var(--text-secondary)' }}>
                  <Sword size={32} style={{ margin:'0 auto 12px', opacity:0.4 }} />
                  <p>No challenges completed yet.</p>
                  <Link to="/challenges" className="btn btn-primary" style={{ marginTop:16, fontSize:'0.9rem', padding:'10px 20px' }}>Start Exploring</Link>
                </div>
              ) : recentProgress.map((p) => (
                <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid var(--border)' }}>
                  <CheckCircle size={18} color="#22c55e" />
                  <div style={{ flex:1 }}>
                    <p style={{ fontWeight:600, fontSize:'0.9rem' }}>{p.challenges?.title}</p>
                    <p style={{ color:'var(--text-secondary)', fontSize:'0.75rem' }}>{new Date(p.completion_date).toLocaleDateString()}</p>
                  </div>
                  <span style={{ color:'var(--primary)', fontWeight:700, fontSize:'0.85rem' }}>+{p.challenges?.xp_reward} XP</span>
                  <span className={`badge-pill badge-${(p.challenges?.difficulty ?? 'easy').toLowerCase()}`}>{p.challenges?.difficulty}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* Badges */}
            <motion.div className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }} style={{ padding:24 }}>
              <h3 style={{ fontWeight:700, marginBottom:16 }}>🏅 Badges Earned</h3>
              {loading ? (
                <div className="skeleton" style={{ height:100, borderRadius:10 }} />
              ) : userRewards.length === 0 ? (
                <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', textAlign:'center', padding:16 }}>Complete challenges to earn badges!</p>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                  {userRewards.map(ur => (
                    <div key={ur.id} style={{ textAlign:'center', padding:10, background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid var(--border)' }}>
                      <div style={{ fontSize:'1.8rem', marginBottom:4 }}>{ur.rewards?.badge_icon}</div>
                      <p style={{ fontSize:'0.65rem', color:'var(--text-secondary)', fontWeight:500 }}>{ur.rewards?.reward_name}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Quick Action */}
            <motion.div className="card glow-border" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
              style={{ padding:24, background:'rgba(99,102,241,0.05)' }}>
              <h3 style={{ fontWeight:700, marginBottom:8 }}>⚡ Daily Challenge</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem', marginBottom:16 }}>Start a challenge to keep your streak alive!</p>
              <Link to="/challenges" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                <Sword size={16} /> Pick a Challenge
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
