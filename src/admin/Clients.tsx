import { useState, useEffect } from 'react'
import { supabase, type Client } from '../lib/supabase'
import { Plus, Search, Filter, MoreHorizontal, Phone, Mail, MapPin, Pencil, Trash2, X, Save } from 'lucide-react'

const statusColors: Record<string, string> = {
  lead: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'on-hold': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company: '', service_type: '', status: 'lead' as string, notes: '', value: '',
  })

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    setClients(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, value: form.value ? parseFloat(form.value) : null }
    if (editing) {
      await supabase.from('clients').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('clients').insert(payload)
    }
    setShowForm(false)
    setEditing(null)
    setForm({ full_name: '', email: '', phone: '', company: '', service_type: '', status: 'lead', notes: '', value: '' })
    fetchClients()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this client?')) return
    await supabase.from('clients').delete().eq('id', id)
    fetchClients()
  }

  const startEdit = (client: Client) => {
    setEditing(client)
    setForm({
      full_name: client.full_name,
      email: client.email,
      phone: client.phone || '',
      company: client.company || '',
      service_type: client.service_type || '',
      status: client.status,
      notes: client.notes || '',
      value: client.value?.toString() || '',
    })
    setShowForm(true)
  }

  const filtered = clients.filter(c => {
    const matchesSearch = !search || c.full_name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.company || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-gray-400 mt-1">Manage your client relationships</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm({ full_name: '', email: '', phone: '', company: '', service_type: '', status: 'lead', notes: '', value: '' }) }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:border-orange-500 outline-none text-sm appearance-none cursor-pointer">
            <option value="all">All Status</option>
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Client List */}
      <div className="glass rounded-xl border border-white/5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <MoreHorizontal className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No clients found</p>
            <p className="text-xs mt-1">Add your first client to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(client => (
              <div key={client.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                  {client.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{client.full_name}</p>
                    <span className={`px-2 py-0.5 text-[10px] rounded-full border ${statusColors[client.status]}`}>{client.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                    {client.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>}
                    {client.company && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{client.company}</span>}
                  </div>
                </div>
                {client.value && <p className="text-sm text-orange-400 font-medium">&pound;{client.value.toLocaleString()}</p>}
                <div className="flex gap-1">
                  <button onClick={() => startEdit(client)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(client.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Client' : 'Add Client'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Full Name *</label><input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Email *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Company</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Service Type</label><select value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="">Select...</option><option>Web Design</option><option>App Development</option><option>Branding</option><option>SEO</option><option>Consulting</option><option>Other</option></select></div>
                <div><label className="block text-sm text-gray-300 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="lead">Lead</option><option value="active">Active</option><option value="completed">Completed</option><option value="on-hold">On Hold</option></select></div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-1">Project Value (&pound;)</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none" /></div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update Client' : 'Add Client'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
