// src/pages/ProgressPage.jsx — Week 9
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { TrendingUp, Flame, Award, CheckCircle } from 'lucide-react'

const DIFFICULTY_COLORS = { Easy: '#22c55e', Medium: '#eab308', Hard: '#ef4444' }

function ProgressRing({ pct, size = 120, label, value, color }) {
  const r = size / 2 - 8
  const circ = 2 * Math.PI * r
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color || 'var(--primary)'} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={circ - (Math.min(pct, 100) / 100) * circ}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color || 'var(--primary)'})`, transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
        </svg>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: color || 'var(--primary)', fontFamily: "'Space Grotesk',sans-serif" }}>{value}</div>
        </div>
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'center' }}>{label}</p>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>⚡ {payload[0].value} XP</p>
      </div>
    )
  }
  return null
}

export default function ProgressPage() {
  const { user, profile } = useAuth()
  const [completions, setCompletions] = useState([])
  const [diffDist, setDiffDist] = useState([])
  const [allRewards, setAllRewards] = useState([])
  const [userRewardIds, setUserRewardIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [{ data: prog }, { data: rewards }, { data: urData }] = await Promise.all([
        supabase.from('user_progress')
          .select('completion_date, challenges(xp_reward, difficulty)')
          .eq('user_id', user.id).eq('completed', true)
          .order('completion_date', { ascending: true }),
        supabase.from('rewards').select('*').order('xp_required'),
        supabase.from('user_rewards').select('reward_id').eq('user_id', user.id)
      ])

      // Build XP-over-time chart data (cumulative, grouped by date)
      const xpByDay = {}
      let cumXP = 0
      ;(prog || []).forEach(p => {
        const day = new Date(p.completion_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const earned = p.challenges?.xp_reward ?? 0
        if (!xpByDay[day]) xpByDay[day] = { date: day, xp: 0 }
        xpByDay[day].xp += earned
      })
      // Make cumulative
      let running = 0
      const chartData = Object.values(xpByDay).map(d => { running += d.xp; return { date: d.date, xp: running } })
      setCompletions(chartData)

      // Difficulty distribution
      const dist = {}
      ;(prog || []).forEach(p => { const d = p.challenges?.difficulty ?? 'Easy'; dist[d] = (dist[d] ?? 0) + 1 })
      setDiffDist(Object.entries(dist).map(([name, value]) => ({ name, value })))

      setAllRewards(rewards || [])
      setUserRewardIds(new Set((urData || []).map(u => u.reward_id)))
      setLoading(false)
    }
    load()
  }, [user])

  const level = profile?.level ?? 1
  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0
  const nextLevelXP = [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000]
  const prevXP = nextLevelXP[level - 1] ?? 0
  const nextXP = nextLevelXP[level] ?? 10000
  const levelPct = Math.min(100, ((xp - prevXP) / (nextXP - prevXP)) * 100)
  const totalChallenges = 30
  const completedCount = completions.length > 0 ? (diffDist.reduce((s, d) => s + d.value, 0)) : 0
  const completionPct = Math.round((completedCount / totalChallenges) * 100)

  return (
    <Layout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
            📊 <span className="glow-text">Progress Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Your learning journey visualized</p>
        </motion.div>

        {/* Top Stats Rings */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 24 }}>At a Glance</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
            <ProgressRing pct={levelPct} value={`Lv${level}`} label="Level Progress" color="var(--primary)" />
            <ProgressRing pct={completionPct} value={`${completionPct}%`} label="Challenges Done" color="#22c55e" />
            <ProgressRing pct={Math.min(100, (streak / 30) * 100)} value={`${streak}🔥`} label="Day Streak" color="#ef4444" />
            <ProgressRing pct={Math.min(100, (xp / 10000) * 100)} value={`${xp}`} label="Total XP" color="#eab308" />
          </div>
        </motion.div>

        {/* XP Over Time Chart */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={18} color="var(--primary)" /> XP Progress Over Time
          </h3>
          {loading ? (
            <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
          ) : completions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>
              Complete challenges to see your XP chart! 📈
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={completions}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="xp" stroke="var(--primary)" strokeWidth={2.5}
                  fill="url(#xpGradient)" dot={{ fill: 'var(--primary)', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Difficulty Pie + Rewards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,400px),1fr))', gap: 24 }}>
          {/* Pie chart */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} color="#22c55e" /> Challenges by Difficulty
            </h3>
            {diffDist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>No completions yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={diffDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {diffDist.map((entry) => (
                      <Cell key={entry.name} fill={DIFFICULTY_COLORS[entry.name] ?? '#6366f1'} />
                    ))}
                  </Pie>
                  <Legend formatter={v => <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{v}</span>} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Rewards grid */}
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={18} color="#f97316" /> Badge Collection
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {allRewards.map(r => {
                const unlocked = userRewardIds.has(r.id)
                return (
                  <div key={r.id} title={`${r.reward_name} — ${r.xp_required} XP`}
                    style={{
                      textAlign: 'center', padding: '10px 4px', borderRadius: 10,
                      background: unlocked ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.03)',
                      border: unlocked ? '1px solid rgba(99,102,241,0.3)' : '1px solid var(--border)',
                      opacity: unlocked ? 1 : 0.35, transition: 'all 0.2s',
                      cursor: 'default'
                    }}>
                    <div style={{ fontSize: '1.5rem' }}>{r.badge_icon}</div>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.3 }}>{r.reward_name}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* XP bar */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ padding: 28, marginTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontWeight: 700 }}>Level {level} → Level {level + 1}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{xp} / {nextXP} XP</span>
          </div>
          <div className="xp-bar-wrap" style={{ height: 16 }}>
            <div className="xp-bar-fill" style={{ width: `${levelPct}%`, height: '100%' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: 8 }}>
            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{nextXP - xp} XP</span> remaining to next level
          </p>
        </motion.div>
      </div>
    </Layout>
  )
}
