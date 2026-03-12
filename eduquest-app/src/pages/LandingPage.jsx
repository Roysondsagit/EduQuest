// src/pages/LandingPage.jsx — Week 6 deliverable (public landing)
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Trophy, Flame, Star, BookOpen, ArrowRight } from 'lucide-react'

const features = [
  { icon: Zap,      color: '#eab308', title: 'XP & Levels',    desc: 'Earn XP for every challenge you complete and level up your profile.' },
  { icon: Trophy,   color: '#f97316', title: 'Leaderboard',    desc: 'Compete globally and see how you rank against other learners.' },
  { icon: Flame,    color: '#ef4444', title: 'Daily Streaks',  desc: 'Log in daily to maintain your streak and unlock bonuses.' },
  { icon: Star,     color: '#8b5cf6', title: 'Reward Badges',  desc: 'Unlock achievement badges as you hit XP milestones.' },
  { icon: BookOpen, color: '#22c55e', title: '30+ Challenges', desc: 'Structured learning paths from beginner to advanced.' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      {/* HERO */}
      <div style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', textAlign: 'center', padding: '40px 24px'
      }}>
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:'15%', left:'10%', width:400, height:400, borderRadius:'50%', background:'rgba(99,102,241,0.12)', filter:'blur(100px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'8%', width:300, height:300, borderRadius:'50%', background:'rgba(139,92,246,0.1)', filter:'blur(80px)', pointerEvents:'none' }} />

        {/* Nav bar */}
        <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, backdropFilter:'blur(20px)', background:'rgba(10,10,15,0.7)', borderBottom:'1px solid var(--border)', padding:'0 32px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'var(--gradient)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--glow)' }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <span style={{ fontSize:'1.15rem', fontWeight:800 }}>Edu<span className="glow-text">Quest</span></span>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <Link to="/login"  className="btn btn-ghost"  style={{ padding:'9px 20px', fontSize:'0.9rem' }}>Login</Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding:'9px 20px', fontSize:'0.9rem' }}>Get Started</Link>
          </div>
        </div>

        {/* Hero Content */}
        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.12)', border:'1px solid rgba(99,102,241,0.3)', borderRadius:100, padding:'6px 16px', marginBottom:28, fontSize:'0.8rem', fontWeight:600, color:'var(--primary)' }}>
            <Zap size={13} fill="currentColor" /> Gamified Learning Platform
          </div>
          <h1 style={{ fontSize:'clamp(2.8rem,8vw,5.5rem)', fontWeight:900, lineHeight:1.1, marginBottom:24, letterSpacing:'-2px', fontFamily:"'Space Grotesk',sans-serif" }}>
            Level Up Your<br />
            <span className="glow-text">Learning Journey</span>
          </h1>
          <p style={{ fontSize:'clamp(1rem,2.5vw,1.25rem)', color:'var(--text-secondary)', maxWidth:600, margin:'0 auto 40px', lineHeight:1.7 }}>
            Transform boring studying into an epic quest. Earn XP, unlock badges, climb leaderboards, and build unstoppable learning streaks.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize:'1rem', padding:'14px 32px' }}>
              Start Your Quest <ArrowRight size={18} />
            </Link>
            <Link to="/login"  className="btn btn-ghost"  style={{ fontSize:'1rem', padding:'14px 32px' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.6 }}
          style={{ display:'flex', gap:40, marginTop:60, justifyContent:'center', flexWrap:'wrap' }}
        >
          {[['30+','Challenges'],['10','Reward Badges'],['∞','Learning Streaks'],['7','Color Themes']].map(([num, label]) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'2rem', fontWeight:900, fontFamily:"'Space Grotesk',sans-serif" }} className="glow-text">{num}</div>
              <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* FEATURES */}
      <div style={{ padding:'80px 40px', maxWidth:1100, margin:'0 auto' }}>
        <h2 style={{ textAlign:'center', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:800, marginBottom:16, letterSpacing:'-1px' }}>
          Why <span className="glow-text">EduQuest?</span>
        </h2>
        <p style={{ textAlign:'center', color:'var(--text-secondary)', marginBottom:56, fontSize:'1.05rem' }}>
          Because learning should feel like an adventure, not a chore.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:24 }}>
          {features.map(({ icon: Icon, color, title, desc }, i) => (
            <motion.div key={title} className="card" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              style={{ padding:28 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontWeight:700, marginBottom:8, fontSize:'1.05rem' }}>{title}</h3>
              <p style={{ color:'var(--text-secondary)', lineHeight:1.6, fontSize:'0.9rem' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign:'center', padding:'80px 24px 120px' }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
          style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:24, padding:'60px 40px', maxWidth:700, margin:'0 auto', boxShadow:'0 0 80px rgba(99,102,241,0.15)' }}>
          <h2 style={{ fontSize:'2.2rem', fontWeight:800, marginBottom:16 }}>Ready to start your quest?</h2>
          <p style={{ color:'var(--text-secondary)', marginBottom:32, fontSize:'1.05rem' }}>Join EduQuest and turn your learning into an unforgettable adventure.</p>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize:'1.05rem', padding:'15px 40px' }}>
            Create Free Account <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
