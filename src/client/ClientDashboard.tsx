import { useEffect, useState } from 'react'
import { useClientAuth } from './ClientAuthContext'
import { supabase } from '../lib/supabase'
import { FolderOpen, Receipt, MessageSquare, Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function ClientDashboard() {
  const { user } = useClientAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    const { data: p } = await supabase.from('projects').select('*').eq('client_id', user!.id).order('created_at', { ascending: false })
    setProjects(p || [])

    const { data: i } = await supabase.from('invoices').select('*').eq('client_id', user!.id).order('created_at', { ascending: false })
    setInvoices(i || [])

    const { data: m } = await supabase.from('project_messages').select('*').eq('client_id', user!.id).eq('read', false).eq('sender_type', 'admin')
    setUnreadMessages(m?.length || 0)
  }

  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in-progress')
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.amount || 0), 0)
  const totalDue = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((sum, i) => sum + (i.amount || 0), 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome, {user?.full_name}</h1>
        <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your projects</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5 border border-white/5">
          <FolderOpen className="w-8 h-8 text-blue-400 mb-3" />
          <p className="text-2xl font-bold text-white">{activeProjects.length}</p>
          <p className="text-sm text-gray-400">Active Projects</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5">
          <Receipt className="w-8 h-8 text-green-400 mb-3" />
          <p className="text-2xl font-bold text-white">&pound;{totalPaid.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Paid</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5">
          <Receipt className="w-8 h-8 text-orange-400 mb-3" />
          <p className="text-2xl font-bold text-white">&pound;{totalDue.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Amount Due</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5">
          <MessageSquare className="w-8 h-8 text-purple-400 mb-3" />
          <p className="text-2xl font-bold text-white">{unreadMessages}</p>
          <p className="text-sm text-gray-400">Unread Messages</p>
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Your Projects</h2>
          <a href="/client/projects" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {projects.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500 border border-white/5">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No projects yet</p>
            <p className="text-sm mt-1">Your projects will appear here once we start working together</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.slice(0, 3).map(project => (
              <a key={project.id} href={`/client/project/${project.id}`} className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/20 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{project.name}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{project.deadline ? `Due ${new Date(project.deadline).toLocaleDateString('en-GB')}` : 'No deadline'}</span>
                      <span>Budget: &pound;{project.budget?.toLocaleString() || 'TBC'}</span>
                    </div>
                  </div>
                  {/* Progress ring */}
                  <div className="relative w-14 h-14 flex-shrink-0 ml-4">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#f97316" strokeWidth="3"
                        strokeDasharray={`${(project.progress || 0) * 0.942} 94.2`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{project.progress || 0}%</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${project.progress || 0}%` }} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Recent Invoices */}
      {invoices.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
            <a href="/client/invoices" className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="space-y-2">
            {invoices.slice(0, 3).map(inv => (
              <div key={inv.id} className="glass rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">{inv.description || `Invoice #${inv.id.slice(0, 8)}`}</p>
                  <p className="text-xs text-gray-400">{new Date(inv.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">&pound;{inv.amount?.toLocaleString()}</p>
                  <InvoiceStatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'planning': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'active': 'bg-green-500/10 text-green-400 border-green-500/20',
    'in-progress': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'review': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'on-hold': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  }
  return <span className={`px-2 py-0.5 text-[10px] rounded-full border ${colors[status] || colors['planning']}`}>{status}</span>
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'text-yellow-400',
    paid: 'text-green-400',
    overdue: 'text-red-400',
    cancelled: 'text-gray-400',
  }
  return <span className={`text-xs ${colors[status] || 'text-gray-400'}`}>{status}</span>
}
