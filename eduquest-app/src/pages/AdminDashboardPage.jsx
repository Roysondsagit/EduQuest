// src/pages/AdminDashboardPage.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, ShieldCheck, UserX, UserCheck, Shield, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Layout from '../components/Layout'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) {
      toast.error('Failed to load users: ' + error.message)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleAdmin = async (userId, currentStatus) => {
    if (userId === currentUser.id) {
      toast.error("You cannot change your own admin status here."); return
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to update status: ' + error.message)
    } else {
      toast.success(`User ${!currentStatus ? 'promoted to Admin' : 'demoted'} successfully!`)
      fetchUsers()
    }
  }

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldAlert color="#ef4444" size={32} />
            <span className="glow-text">Admin Panel</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage platform users and view statistics</p>
        </motion.div>

        {/* Highlight Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 32 }}>
          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ padding: 24, background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} color="#6366f1" />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Total Users</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{users.length}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ padding: 24, background: 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(249,115,22,0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} color="#ef4444" />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>Total Admins</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{users.filter(u => u.is_admin).length}</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>User Management</h2>
            <button className="btn btn-ghost" onClick={fetchUsers} disabled={loading} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              {loading ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 24px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>Joined</th>
                  <th style={{ padding: '16px 24px', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'inline-block', width: 24, height: 24, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: 'white' }}>
                            {u.username?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div style={{ fontWeight: 600 }}>{u.username}</div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{u.email}</td>
                      <td style={{ padding: '16px 24px' }}>
                        {u.is_admin ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(239,68,68,0.3)' }}>
                            <ShieldCheck size={14} /> Admin
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <UserCheck size={14} /> Member
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button 
                          className="btn btn-ghost" 
                          style={{ 
                            padding: '6px 14px', 
                            fontSize: '0.8rem',
                            color: u.is_admin ? 'var(--text-primary)' : '#ef4444',
                            opacity: u.id === currentUser.id ? 0.3 : 1
                          }}
                          disabled={u.id === currentUser.id}
                          onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                        >
                          {u.is_admin ? 'Demote' : 'Promote to Admin'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  )
}
