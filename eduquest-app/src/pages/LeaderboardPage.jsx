// src/pages/LeaderboardPage.jsx — Week 7, 9
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import { Trophy, Zap, Crown } from 'lucide-react'

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)
  const [userRank, setUserRank] = useState(null)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc('get_leaderboard', { p_limit: 20 })
      setLeaders(data || [])
      const myEntry = (data || []).find(l => l.user_id === user.id)
      if (myEntry) setUserRank(myEntry.rank)
      setLoading(false)
    }
    load()
  }, [user])

  return (
    <Layout>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
            🏆 <span className="glow-text">Leaderboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Top learners ranked by XP</p>
        </motion.div>

        {/* Your rank */}
        {userRank && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="card" style={{ padding: 20, marginBottom: 24, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
            <p style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Crown size={16} /> You are ranked <span style={{ fontSize: '1.2rem' }}>#{userRank}</span> globally
            </p>
          </motion.div>
        )}

        {/* Top 3 podium */}
        {!loading && leaders.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginBottom: 32 }}>
            {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
              const heights = [130, 170, 110]
              const sizes = ['1rem', '1.2rem', '0.9rem']
              const isFirst = l?.rank === 1
              return (
                <motion.div key={l?.user_id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  style={{
                    flex: 1, background: isFirst ? 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.15))' : 'var(--bg-card)',
                    border: isFirst ? '1px solid rgba(99,102,241,0.4)' : '1px solid var(--border)',
                    borderRadius: 16, padding: '20px 16px',
                    textAlign: 'center', height: heights[i],
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    boxShadow: isFirst ? 'var(--glow)' : 'none'
                  }}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>{medals[l?.rank - 1] ?? '🏅'}</div>
                  <p style={{ fontWeight: 700, fontSize: sizes[i], marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l?.username}</p>
                  <p style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Zap size={13} fill="currentColor" />{l?.total_xp} XP
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>Lv {l?.level}</p>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Full list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            <span>Rank & Player</span>
            <span>XP · Level</span>
          </div>
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 60, margin: '8px 16px', borderRadius: 10 }} />
            ))
          ) : leaders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
              <Trophy size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No players yet. Be the first! 🚀</p>
            </div>
          ) : (
            leaders.map((l, i) => {
              const isMe = l.user_id === user.id
              return (
                <motion.div key={l.user_id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '14px 24px',
                    borderBottom: '1px solid var(--border)',
                    background: isMe ? 'rgba(99,102,241,0.07)' : 'transparent',
                    transition: 'background 0.2s'
                  }}>
                  {/* Rank */}
                  <div style={{ width: 40, textAlign: 'center', fontWeight: 800, fontSize: l.rank <= 3 ? '1.4rem' : '0.95rem', color: l.rank <= 3 ? undefined : 'var(--text-secondary)' }}>
                    {l.rank <= 3 ? medals[l.rank - 1] : `#${l.rank}`}
                  </div>
                  {/* Avatar */}
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12, fontSize: '0.9rem', fontWeight: 700, boxShadow: isMe ? 'var(--glow)' : 'none', flexShrink: 0 }}>
                    {l.username?.[0]?.toUpperCase()}
                  </div>
                  {/* Name */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: isMe ? 700 : 500, fontSize: '0.92rem' }}>
                      {l.username}
                      {isMe && <span style={{ marginLeft: 8, fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700, background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: 100 }}>You</span>}
                    </p>
                  </div>
                  {/* XP + Level */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', fontSize: '0.9rem' }}>
                      <Zap size={13} fill="currentColor" />{l.total_xp}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Lv {l.level}</p>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </Layout>
  )
}
