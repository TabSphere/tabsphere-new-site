import { useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'
import { Key, User, Bell, Shield, Save, Check } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [pwError, setPwError] = useState('')

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    if (passwords.new !== passwords.confirm) { setPwError('Passwords do not match'); return }
    if (passwords.new.length < 6) { setPwError('Password must be at least 6 characters'); return }
    const { error } = await supabase.auth.updateUser({ password: passwords.new })
    if (error) { setPwError(error.message); return }
    setPasswords({ current: '', new: '', confirm: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your admin account</p>
      </div>

      {/* Profile */}
      <div className="glass rounded-xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><User className="w-4 h-4 text-orange-400" /> Profile</h3>
        <div className="space-y-3">
          <div><label className="block text-sm text-gray-400 mb-1">Email</label><input value={user?.email || ''} disabled className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm cursor-not-allowed" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Role</label><input value={user?.role || 'admin'} disabled className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-sm cursor-not-allowed capitalize" /></div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass rounded-xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-orange-400" /> Change Password</h3>
        {pwError && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{pwError}</div>}
        {saved && <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2"><Check className="w-4 h-4" /> Password updated</div>}
        <form onSubmit={changePassword} className="space-y-3">
          <div><label className="block text-sm text-gray-300 mb-1">New Password</label><input type="password" required value={passwords.new} onChange={e => setPasswords({ ...passwords, new: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
          <div><label className="block text-sm text-gray-300 mb-1">Confirm New Password</label><input type="password" required value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
          <button type="submit" className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2"><Save className="w-4 h-4" /> Update Password</button>
        </form>
      </div>

      {/* Supabase Config */}
      <div className="glass rounded-xl border border-white/5 p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-orange-400" /> Supabase Connection</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>URL: <code className="text-orange-400">keoyzkzhkvsjxpybszah.supabase.co</code></p>
          <p className="text-xs">Make sure you have set <code className="text-orange-400">VITE_SUPABASE_ANON_KEY</code> in your .env file.</p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="glass rounded-xl border border-white/5 p-6 opacity-50">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-400" /> Notifications</h3>
        <p className="text-sm text-gray-400">Email notification preferences coming soon.</p>
      </div>
    </div>
  )
}
