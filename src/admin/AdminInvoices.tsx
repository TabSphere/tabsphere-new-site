import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, Search, Pencil, Trash2, X, Save, Receipt } from 'lucide-react'

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ client_id: '', project_id: '', amount: '', description: '', status: 'pending', due_date: '' })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    const { data: i } = await supabase.from('invoices').select('*, clients(full_name), projects(name)').order('created_at', { ascending: false })
    setInvoices(i || [])
    const { data: c } = await supabase.from('clients').select('id, full_name, email').order('full_name')
    setClients(c || [])
    const { data: p } = await supabase.from('projects').select('id, name, client_id').order('name')
    setProjects(p || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, amount: parseFloat(form.amount) || 0 }
    if (editing) { await supabase.from('invoices').update(payload).eq('id', editing.id) }
    else { await supabase.from('invoices').insert(payload) }
    setShowForm(false); setEditing(null)
    setForm({ client_id: '', project_id: '', amount: '', description: '', status: 'pending', due_date: '' })
    fetchAll()
  }

  const handleDelete = async (id: string) => { if (confirm('Delete?')) { await supabase.from('invoices').delete().eq('id', id); fetchAll() } }

  const filteredProjects = projects.filter(p => !form.client_id || p.client_id === form.client_id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 mt-1">Create and manage client invoices</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Invoice
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoices..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
      </div>

      <div className="space-y-2">
        {invoices.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500 border border-white/5">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No invoices yet</p>
          </div>
        ) : invoices.filter(i => !search || i.description?.toLowerCase().includes(search.toLowerCase()) || i.clients?.full_name?.toLowerCase().includes(search.toLowerCase())).map(inv => (
          <div key={inv.id} className="glass rounded-xl p-5 border border-white/5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-white">{inv.description || `Invoice #${inv.id.slice(0, 8)}`}</p>
                <span className={`px-2 py-0.5 text-[10px] rounded-full ${inv.status === 'paid' ? 'bg-green-500/10 text-green-400' : inv.status === 'overdue' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{inv.status}</span>
              </div>
              <p className="text-xs text-gray-400">{inv.clients?.full_name} &middot; {inv.projects?.name} &middot; {new Date(inv.created_at).toLocaleDateString('en-GB')}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold text-white">&pound;{inv.amount?.toLocaleString()}</p>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(inv); setForm({ client_id: inv.client_id, project_id: inv.project_id || '', amount: inv.amount?.toString() || '', description: inv.description || '', status: inv.status, due_date: inv.due_date || '' }); setShowForm(true) }} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(inv.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Invoice' : 'Create Invoice'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm text-gray-300 mb-1">Client *</label><select required value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value, project_id: '' })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="">Select...</option>{clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}</select></div>
              <div><label className="block text-sm text-gray-300 mb-1">Project</label><select value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="">Select...</option>{filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Amount (&pound;) *</label><input type="number" required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Due Date</label><input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-1">Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="pending">Pending</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option></select></div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update' : 'Create'} Invoice</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
