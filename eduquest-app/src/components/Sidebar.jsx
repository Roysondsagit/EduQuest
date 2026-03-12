// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sword, TrendingUp, Trophy, User, BookOpen } from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/challenges',  icon: Sword,           label: 'Challenges' },
  { to: '/progress',    icon: TrendingUp,      label: 'Progress' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard' },
  { to: '/profile',     icon: User,            label: 'Profile' },
]

export default function Sidebar() {
  return (
    <aside style={{
      position: 'fixed', top: 64, left: 0, bottom: 0,
      width: 220, padding: '24px 12px',
      background: 'rgba(10,10,15,0.9)',
      borderRight: '1px solid var(--border)',
      backdropFilter: 'blur(20px)',
      display: 'flex', flexDirection: 'column', gap: 4,
      zIndex: 90
    }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: 1, color: 'var(--text-secondary)', padding: '4px 12px 8px', textTransform: 'uppercase' }}>Navigate</p>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12,
              background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              boxShadow: isActive ? 'var(--glow)' : 'none'
            }}
            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-primary)' } }}
            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='var(--text-secondary)' } }}
            >
              <Icon size={18} />
              {label}
            </div>
          )}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          🔥 Keep your streak alive!<br />
          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Complete a challenge today.</span>
        </p>
      </div>
    </aside>
  )
}
