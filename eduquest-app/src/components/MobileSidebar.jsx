// src/components/MobileSidebar.jsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Sword, TrendingUp, Trophy, User, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/challenges',  icon: Sword,           label: 'Challenges' },
  { to: '/progress',    icon: TrendingUp,      label: 'Progress' },
  { to: '/leaderboard', icon: Trophy,          label: 'Leaderboard' },
  { to: '/profile',     icon: User,            label: 'Profile' },
]

export default function MobileSidebar({ open, onClose }) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)'
      }} />
      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
        zIndex: 200, background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 4,
        animation: 'slideIn 0.25s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '0 8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>Edu<span className="glow-text">Quest</span></span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }} onClick={onClose}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '13px 16px', borderRadius: 12,
                background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}>
                <Icon size={20} />
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
    </>
  )
}
