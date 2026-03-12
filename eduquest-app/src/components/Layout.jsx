// src/components/Layout.jsx
import { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileSidebar from './MobileSidebar'
import { Menu } from 'lucide-react'

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="animated-bg" style={{ minHeight: '100vh' }}>
      <Navbar onMenuClick={() => setMobileOpen(true)} />
      {/* Desktop sidebar */}
      <div className="hide-mobile">
        <Sidebar />
      </div>
      {/* Mobile sidebar drawer */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main style={{
        marginLeft: 'clamp(0px, 220px, 220px)',
        marginTop: 64,
        padding: 'clamp(16px, 3vw, 32px)',
        minHeight: 'calc(100vh - 64px)',
      }}
        className="main-content"
      >
        {children}
      </main>
      <style>{`
        @media (max-width: 768px) {
          .main-content { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
