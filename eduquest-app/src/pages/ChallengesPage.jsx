// src/pages/ChallengesPage.jsx — Week 8
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import { BookOpen, Filter, Zap, CheckCircle, ChevronRight } from 'lucide-react'

export default function ChallengesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [challenges, setChallenges] = useState([])
  const [progress, setProgress] = useState({})
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [{ data: coursesData }, { data: challengesData }, { data: progressData }] = await Promise.all([
        supabase.from('courses').select('*').order('difficulty'),
        supabase.from('challenges').select('*').order('order_index'),
        supabase.from('user_progress').select('challenge_id, completed').eq('user_id', user.id).eq('completed', true)
      ])
      setCourses(coursesData || [])
      setChallenges(challengesData || [])
      const pmap = {}
      ;(progressData || []).forEach(p => { pmap[p.challenge_id] = true })
      setProgress(pmap)
      setLoading(false)
    }
    load()
  }, [user])

  const filtered = filter === 'All' ? challenges : challenges.filter(c => c.difficulty === filter)

  const courseMap = {}
  courses.forEach(c => { courseMap[c.id] = c })

  return (
    <Layout>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:'2rem', fontWeight:800, marginBottom:4 }}>
            ⚔️ <span className="glow-text">Challenges</span>
          </h1>
          <p style={{ color:'var(--text-secondary)' }}>Complete challenges to earn XP and level up</p>
        </motion.div>

        {/* Filter */}
        <div style={{ display:'flex', gap:8, marginBottom:28, flexWrap:'wrap' }}>
          {['All','Easy','Medium','Hard'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className="btn"
              style={{
                padding:'8px 18px', fontSize:'0.85rem',
                background: filter === f ? 'var(--gradient)' : 'var(--bg-card)',
                color: filter === f ? 'white' : 'var(--text-secondary)',
                border: filter === f ? 'none' : '1px solid var(--border)',
                boxShadow: filter === f ? 'var(--glow)' : 'none'
              }}>
              {f}
            </button>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, color:'var(--text-secondary)', fontSize:'0.85rem' }}>
            <CheckCircle size={14} color="#22c55e" />
            {Object.keys(progress).length} / {challenges.length} completed
          </div>
        </div>

        {/* Courses */}
        {loading ? (
          [...Array(3)].map((_,i) => <div key={i} className="skeleton" style={{ height:200, borderRadius:16, marginBottom:20 }} />)
        ) : (
          courses.map((course, ci) => {
            const courseChallenges = filtered.filter(c => c.course_id === course.id)
            if (!courseChallenges.length) return null
            const courseCompleted = courseChallenges.filter(c => progress[c.id]).length
            return (
              <motion.div key={course.id} className="card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:ci*0.1 }}
                style={{ padding:24, marginBottom:20 }}>
                {/* Course header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                      <BookOpen size={18} color="var(--primary)" />
                      <h3 style={{ fontWeight:700, fontSize:'1.05rem' }}>{course.title}</h3>
                      <span className={`badge-pill badge-${course.difficulty.toLowerCase()}`}>{course.difficulty}</span>
                    </div>
                    <p style={{ color:'var(--text-secondary)', fontSize:'0.85rem' }}>{course.description}</p>
                  </div>
                  <div style={{ textAlign:'center', minWidth:80 }}>
                    <div style={{ fontSize:'1.4rem', fontWeight:800 }} className="glow-text">{courseCompleted}/{courseChallenges.length}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)' }}>done</div>
                  </div>
                </div>

                {/* XP bar for course */}
                <div className="xp-bar-wrap" style={{ height:4, marginBottom:16 }}>
                  <div className="xp-bar-fill" style={{ width:`${courseChallenges.length ? (courseCompleted/courseChallenges.length)*100 : 0}%`, height:'100%' }} />
                </div>

                {/* Challenge grid */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
                  {courseChallenges.map(ch => (
                    <Link key={ch.id} to={`/challenges/${ch.id}`} style={{ textDecoration:'none' }}>
                      <div style={{
                        padding:'14px 16px', borderRadius:12,
                        background: progress[ch.id] ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.03)',
                        border: progress[ch.id] ? '1px solid rgba(34,197,94,0.25)' : '1px solid var(--border)',
                        display:'flex', alignItems:'center', justifyContent:'space-between',
                        cursor:'pointer', transition:'all 0.2s ease'
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--primary)';e.currentTarget.style.background='rgba(99,102,241,0.08)'}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=progress[ch.id]?'rgba(34,197,94,0.25)':'var(--border)';e.currentTarget.style.background=progress[ch.id]?'rgba(34,197,94,0.06)':'rgba(255,255,255,0.03)'}}
                      >
                        <div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                            {progress[ch.id] ? <CheckCircle size={14} color="#22c55e" /> : <div style={{ width:14, height:14, borderRadius:'50%', border:'2px solid var(--border)' }} />}
                            <span style={{ fontWeight:600, fontSize:'0.88rem', color: progress[ch.id] ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{ch.title}</span>
                          </div>
                          <div style={{ display:'flex', gap:8 }}>
                            <span className={`badge-pill badge-${ch.difficulty.toLowerCase()}`}>{ch.difficulty}</span>
                            <span style={{ display:'flex', alignItems:'center', gap:3, fontSize:'0.75rem', color:'var(--primary)', fontWeight:600 }}>
                              <Zap size={11} fill="currentColor" />+{ch.xp_reward} XP
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} color="var(--text-secondary)" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </Layout>
  )
}
