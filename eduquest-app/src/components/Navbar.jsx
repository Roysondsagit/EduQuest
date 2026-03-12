// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogOut, Zap, User, Menu } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar({ onMenuClick }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 16px',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left: hamburger (mobile) + logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          className="show-mobile"
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', padding: '6px', marginRight: 4, display: 'none' }}
        >
          <Menu size={22} />
        </button>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow)'
          }}>
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Edu<span className="glow-text">Quest</span>
          </span>
        </Link>
      </div>

      {/* Right: XP chip + theme + profile + sign out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {profile && (
          <div className="hide-mobile" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            borderRadius: 100, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600
          }}>
            <Zap size={14} color="var(--primary)" fill="var(--primary)" />
            <span className="glow-text">{profile.xp} XP</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>· Lv {profile.level}</span>
          </div>
        )}
        <ThemeSwitcher />
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: 'var(--glow)'
          }}>
            <User size={18} color="white" />
          </div>
        </Link>
        <button onClick={handleSignOut} className="btn btn-ghost" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
          <LogOut size={16} />
        </button>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
