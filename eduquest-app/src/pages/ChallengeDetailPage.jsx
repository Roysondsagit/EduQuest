// src/pages/ChallengeDetailPage.jsx — Week 8
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { Zap, CheckCircle, ArrowLeft, Sword, BookOpen, Star } from 'lucide-react'

// Numeric multipliers for math — avoids NaN from parseFloat('1×')
const DIFF_MULT_NUM  = { Easy: 1, Medium: 1.5, Hard: 2 }
const DIFF_MULT_DISP = { Easy: '1×', Medium: '1.5×', Hard: '2×' }

function LevelUpOverlay({ newLevel, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          style={{
            textAlign: 'center', padding: '60px 80px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 32,
            boxShadow: '0 0 80px rgba(99,102,241,0.4)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ fontSize: '5rem', marginBottom: 16 }}
          >⬆️</motion.div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>LEVEL UP!</h2>
          <div className="glow-text" style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1, fontFamily: "'Space Grotesk',sans-serif" }}>
            {newLevel}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, marginBottom: 24 }}>
            You reached Level {newLevel}! Keep going! 🚀
          </p>
          <button className="btn btn-primary" onClick={onClose} style={{ padding: '12px 32px' }}>
            Awesome! Continue ⚡
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ChallengeDetailPage() {
  const { id } = useParams()
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [course, setCourse] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [levelUp, setLevelUp] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const [{ data: ch }, { data: prog }] = await Promise.all([
        supabase.from('challenges').select('*, courses(*)').eq('id', id).single(),
        supabase.from('user_progress').select('completed').eq('user_id', user.id).eq('challenge_id', id).maybeSingle()
      ])
      setChallenge(ch)
      setCourse(ch?.courses)
      setCompleted(prog?.completed === true)
      setLoading(false)
    }
    load()
  }, [id, user])

  const handleComplete = async () => {
    if (completed || completing) return
    setCompleting(true)
    const { data, error } = await supabase.rpc('complete_challenge', {
      p_user_id: user.id,
      p_challenge_id: id
    })
    setCompleting(false)
    if (error) { toast.error('Error: ' + error.message); return }

    setResult(data)
    setCompleted(true)

    const prevLevel = profile?.level ?? 1
    if (data?.new_level && data.new_level > prevLevel) {
      setLevelUp(data.new_level)
    }

    toast.success(`🎉 +${data?.xp_earned ?? 0} XP earned!`, { duration: 4000 })
    await refreshProfile()
  }

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  )

  const diff = challenge?.difficulty ?? 'Easy'
  const baseXP = challenge?.xp_reward ?? 0
  const finalXP = Math.round(baseXP * (DIFF_MULT_NUM[diff] ?? 1))

  return (
    <Layout>
      {levelUp && <LevelUpOverlay newLevel={levelUp} onClose={() => setLevelUp(null)} />}

      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <button className="btn btn-ghost" style={{ marginBottom: 24, fontSize: '0.9rem' }} onClick={() => navigate('/challenges')}>
          <ArrowLeft size={16} /> Back to Challenges
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header Card */}
          <div className="card" style={{ padding: 36, marginBottom: 20, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <BookOpen size={14} />
              <span>{course?.title}</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px' }}>
              {challenge?.title}
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`badge-pill badge-${diff.toLowerCase()}`}>{diff}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                <Zap size={14} fill="currentColor" />
                {baseXP} base XP ({DIFF_MULT_DISP[diff]} multiplier = {finalXP} XP)
              </span>
            </div>
          </div>

          {/* Description Card */}
          <div className="card" style={{ padding: 32, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Sword size={18} color="var(--primary)" /> Challenge Description
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1rem' }}>
              {challenge?.description}
            </p>
          </div>

          {/* Rewards Card */}
          <div className="card" style={{ padding: 32, marginBottom: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              <Star size={18} color="#eab308" /> Rewards
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 12 }}>
              {[
                { icon: '⚡', label: 'XP Earned',  value: `+${finalXP} XP` },
                { icon: '🎯', label: 'Difficulty',  value: diff },
                { icon: '🔥', label: 'Streak',      value: '+1 Day' }
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center', padding: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Result Banner — shown after completion */}
          {result && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: 20, marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
              <CheckCircle size={28} color="#22c55e" />
              <div>
                <p style={{ fontWeight: 700, color: '#22c55e' }}>Challenge Completed! 🎉</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  You earned <strong style={{ color: 'var(--primary)' }}>+{result.xp_earned} XP</strong>
                  {' · '}Total: {result.total_xp} XP · Level {result.new_level}
                </p>
              </div>
            </motion.div>
          )}

          {/* CTA Button */}
          {completed ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '20px 0', color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>
              <CheckCircle size={24} /> Challenge Already Completed!
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99,102,241,0.6)' }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary"
              style={{ width: '100%', padding: 18, fontSize: '1.1rem', letterSpacing: '0.3px' }}
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? (
                <><div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite' }} /> Completing...</>
              ) : (
                <><Sword size={20} /> Mark as Complete &amp; Claim XP</>
              )}
            </motion.button>
          )}
        </motion.div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </Layout>
  )
}
