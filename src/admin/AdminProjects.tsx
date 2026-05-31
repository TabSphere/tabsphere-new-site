import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Search, Pencil, Trash2, X, Save, MessageSquare, FolderOpen, Clock } from 'lucide-react'

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', description: '', client_id: '', status: 'planning', budget: '', progress: '0', start_date: '', deadline: '' })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const { data: p } = await supabase.from('projects').select('*, clients(full_name, email, company)').order('created_at', { ascending: false })
    setProjects(p || [])
    const { data: c } = await supabase.from('clients').select('id, full_name, email').order('full_name')
    setClients(c || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, budget: form.budget ? parseFloat(form.budget) : null, progress: parseInt(form.progress) || 0 }
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('projects').insert(payload)
    }
    setShowForm(false); setEditing(null)
    setForm({ name: '', description: '', client_id: '', status: 'planning', budget: '', progress: '0', start_date: '', deadline: '' })
    fetchAll()
  }

  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await supabase.from('projects').delete().eq('id', id); fetchAll() } }

  const startEdit = (p: any) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description || '', client_id: p.client_id || '', status: p.status, budget: p.budget?.toString() || '', progress: p.progress?.toString() || '0', start_date: p.start_date || '', deadline: p.deadline || '' })
    setShowForm(true)
  }

  const filtered = projects.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.clients?.full_name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">Manage client projects &amp; track progress</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ name: '', description: '', client_id: '', status: 'planning', budget: '', progress: '0', start_date: '', deadline: '' }) }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500 border border-white/5">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No projects yet</p>
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className="glass rounded-xl p-5 border border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-gray-400">{p.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Client: {p.clients?.full_name || 'Unassigned'}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {p.deadline ? new Date(p.deadline).toLocaleDateString('en-GB') : 'TBC'}</span>
                  <span>Budget: &pound;{p.budget?.toLocaleString() || 'TBC'}</span>
                </div>
                <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.progress || 0}%` }} />
                </div>
              </div>
              <div className="flex gap-1 ml-4">
                <a href={`/client/project/${p.id}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white" title="View client portal">
                  <MessageSquare className="w-4 h-4" />
                </a>
                <button onClick={() => startEdit(p)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm text-gray-300 mb-1">Project Name *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Client</label><select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="">Select client...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="planning">Planning</option><option value="active">Active</option><option value="in-progress">In Progress</option><option value="review">Review</option><option value="completed">Completed</option><option value="on-hold">On Hold</option></select></div>
                <div><label className="block text-sm text-gray-300 mb-1">Progress (%)</label><input type="number" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Budget (&pound;)</label><input type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Deadline</label><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update Project' : 'Create Project'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    planning: 'bg-blue-500/10 text-blue-400', active: 'bg-green-500/10 text-green-400',
    'in-progress': 'bg-orange-500/10 text-orange-400', review: 'bg-yellow-500/10 text-yellow-400',
    completed: 'bg-emerald-500/10 text-emerald-400', 'on-hold': 'bg-gray-500/10 text-gray-400',
  }
  return <span className={`px-2 py-0.5 text-[10px] rounded-full ${colors[status] || colors.planning}`}>{status}</span>
}
