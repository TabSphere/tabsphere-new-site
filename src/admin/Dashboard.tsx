import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Users, Briefcase, MailOpen, Newspaper, TrendingUp, Eye, FileText, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    clients: 0,
    employees: 0,
    contacts: 0,
    subscribers: 0,
    blogPosts: 0,
    pendingContacts: 0,
  })
  const [recentContacts, setRecentContacts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const [
        { count: clients },
        { count: employees },
        { count: contacts },
        { count: subscribers },
        { count: blogPosts },
        { count: pendingContacts },
        { data: recent },
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('subscribed', true),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contact_submissions').select('*').eq('status', 'new').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        clients: clients || 0,
        employees: employees || 0,
        contacts: contacts || 0,
        subscribers: subscribers || 0,
        blogPosts: blogPosts || 0,
        pendingContacts: pendingContacts || 0,
      })
      setRecentContacts(recent || [])
    } catch (e) {
      // Tables may not exist yet — show empty state
    }
    setIsLoading(false)
  }

  const statCards = [
    { label: 'Total Clients', value: stats.clients, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Employees', value: stats.employees, icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Newsletter Subs', value: stats.subscribers, icon: Newspaper, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="glass rounded-xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl font-bold text-white">{isLoading ? '-' : card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts + Recent */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Contacts Alert */}
        <div className="lg:col-span-2 space-y-4">
          {stats.pendingContacts > 0 && (
            <div className="glass rounded-xl p-4 border border-orange-500/20 bg-orange-500/5 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-white">{stats.pendingContacts} new contact submission{stats.pendingContacts > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-400">Waiting for your response</p>
              </div>
              <a href="/admin/contacts" className="ml-auto text-sm text-orange-400 hover:text-orange-300">View</a>
            </div>
          )}

          {/* Recent Contacts */}
          <div className="glass rounded-xl border border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <MailOpen className="w-4 h-4 text-orange-400" />
                Recent Contact Submissions
              </h3>
              <a href="/admin/contacts" className="text-sm text-orange-400 hover:text-orange-300">View All</a>
            </div>
            <div className="divide-y divide-white/5">
              {recentContacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No contact submissions yet</p>
                  <p className="text-xs mt-1">They will appear here when someone fills out your contact form</p>
                </div>
              ) : (
                recentContacts.map((c: any) => (
                  <div key={c.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02]">
                    <div className="w-9 h-9 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 text-sm font-bold">
                      {c.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{c.name}</p>
                      <p className="text-xs text-gray-400 truncate">{c.service || 'General enquiry'}</p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400">New</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl border border-white/5 p-4">
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Add New Client', href: '/admin/clients', icon: Briefcase },
              { label: 'Add Employee', href: '/admin/employees', icon: Users },
              { label: 'Write Blog Post', href: '/admin/blog', icon: FileText },
              { label: 'Edit Website Content', href: '/admin/content', icon: MailOpen },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <action.icon className="w-4 h-4 text-orange-400" />
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
