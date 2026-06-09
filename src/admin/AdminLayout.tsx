import { useState } from 'react'
import { useAuth } from './AuthContext'
import { NavLink, Outlet } from 'react-router'
import {
  LayoutDashboard, FileText, Users, Briefcase, BookOpen,
  Mail, Newspaper, FolderOpen, FolderKanban, Receipt,
  Settings, LogOut, Menu, ChevronRight, Globe
} from 'lucide-react'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/content', icon: FileText, label: 'Content Editor' },
  { to: '/admin/clients', icon: Briefcase, label: 'Clients' },
  { to: '/admin/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/admin/invoices', icon: Receipt, label: 'Invoices' },
  { to: '/admin/employees', icon: Users, label: 'Employees' },
  { to: '/admin/blog', icon: BookOpen, label: 'Blog' },
  { to: '/admin/subscribers', icon: Newspaper, label: 'Subscribers' },
  { to: '/admin/contacts', icon: Mail, label: 'Contacts' },
  { to: '/admin/documents', icon: FolderOpen, label: 'Documents' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-black border-r border-white/5 flex flex-col transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand */}
        <div className="p-6 border-b border-white/5">
          <a href="/" className="flex items-center gap-3">
            <img src="/TabSphere_Profile.png" alt="TabSphere" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <span className="text-lg font-bold text-white">Tab<span className="text-orange-500">Sphere</span></span>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Dashboard</p>
            </div>
          </a>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'admin'}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-2"
          >
            View Website
            <Globe className="w-4 h-4" />
          </a>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
