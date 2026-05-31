import { useClientAuth } from './ClientAuthContext'
import { NavLink, Outlet, Navigate } from 'react-router'
import { LayoutDashboard, FolderOpen, Receipt, MessageSquare, LogOut, Menu, X, Globe } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/client', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/client/projects', icon: FolderOpen, label: 'My Projects' },
  { to: '/client/invoices', icon: Receipt, label: 'Invoices' },
  { to: '/client/messages', icon: MessageSquare, label: 'Messages' },
]

export default function ClientLayout() {
  const { user, isLoading, signOut } = useClientAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>
  if (!user) return <Navigate to="/client/login" replace />

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 flex flex-col transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-6 border-b border-white/5">
          <a href="/" className="flex items-center gap-3">
            <img src="/TabSphere_Profile.png" alt="TabSphere" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <span className="text-lg font-bold text-white">Tab<span className="text-orange-500">Sphere</span></span>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Client Portal</p>
            </div>
          </a>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.exact} onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon className="w-5 h-5" />{item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">
              {user.full_name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user.company || 'Client'}</p>
            </div>
          </div>
          <button onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <p className="text-sm text-gray-400 hidden sm:block">Welcome, {user.full_name}</p>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
