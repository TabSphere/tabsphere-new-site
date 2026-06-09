import { useState, useEffect } from 'react'
import { supabase, type Employee } from '../lib/supabase'
import { Plus, Search, Pencil, Trash2, X, Save, FileText } from 'lucide-react'

const statusColors: Record<string, string> = {
  applicant: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  interviewing: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  hired: 'bg-green-500/10 text-green-400 border-green-500/20',
  onboarding: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  terminated: 'bg-red-500/10 text-red-400 border-red-500/20',
}

const cosStatusColors: Record<string, string> = {
  'not-required': 'bg-gray-500/10 text-gray-400',
  pending: 'bg-yellow-500/10 text-yellow-400',
  assigned: 'bg-green-500/10 text-green-400',
  used: 'bg-blue-500/10 text-blue-400',
  expired: 'bg-red-500/10 text-red-400',
}

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Employee | null>(null)
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', nationality: '', job_title: '',
    employment_type: 'full-time' as string, start_date: '', status: 'applicant' as string,
    cos_reference: '', cos_status: 'not-required' as string, salary: '', notes: '',
  })

  useEffect(() => { fetchEmployees() }, [])

  const fetchEmployees = async () => {
    const { data } = await supabase.from('employees').select('*').order('created_at', { ascending: false })
    setEmployees(data || [])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, salary: form.salary ? parseFloat(form.salary) : null, documents: editing?.documents || [] }
    if (editing) {
      await supabase.from('employees').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('employees').insert(payload)
    }
    setShowForm(false); setEditing(null)
    setForm({ full_name: '', email: '', phone: '', nationality: '', job_title: '', employment_type: 'full-time', start_date: '', status: 'applicant', cos_reference: '', cos_status: 'not-required', salary: '', notes: '' })
    fetchEmployees()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this employee record?')) return
    await supabase.from('employees').delete().eq('id', id)
    fetchEmployees()
  }

  const startEdit = (emp: Employee) => {
    setEditing(emp)
    setForm({
      full_name: emp.full_name, email: emp.email, phone: emp.phone || '', nationality: emp.nationality || '',
      job_title: emp.job_title, employment_type: emp.employment_type, start_date: emp.start_date || '',
      status: emp.status, cos_reference: emp.cos_reference || '', cos_status: emp.cos_status,
      salary: emp.salary?.toString() || '', notes: emp.notes || '',
    })
    setShowForm(true)
  }

  const filtered = employees.filter(e => {
    const matchesSearch = !search || e.full_name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.job_title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-gray-400 mt-1">HR records &amp; COS management</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* COS Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {['not-required', 'pending', 'assigned', 'used'].map(s => {
          const count = employees.filter(e => e.cos_status === s).length
          return (
            <div key={s} className="glass rounded-xl p-3 border border-white/5">
              <p className="text-xs text-gray-400 capitalize">COS: {s.replace('-', ' ')}</p>
              <p className="text-xl font-bold text-white">{count}</p>
            </div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm">
          <option value="all">All Status</option>
          <option value="applicant">Applicant</option>
          <option value="interviewing">Interviewing</option>
          <option value="hired">Hired</option>
          <option value="onboarding">Onboarding</option>
          <option value="active">Active</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      {/* Employee List */}
      <div className="glass rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-white/5">
            <th className="text-left p-4 text-gray-400 font-medium">Employee</th>
            <th className="text-left p-4 text-gray-400 font-medium hidden sm:table-cell">Role</th>
            <th className="text-left p-4 text-gray-400 font-medium hidden md:table-cell">Status</th>
            <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">COS</th>
            <th className="text-left p-4 text-gray-400 font-medium hidden lg:table-cell">Start Date</th>
            <th className="text-right p-4 text-gray-400 font-medium">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-gray-500">No employees found</td></tr>
            ) : filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-white/[0.02]">
                <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xs font-bold">{emp.full_name.split(' ').map(n => n[0]).join('')}</div><div><p className="text-white font-medium">{emp.full_name}</p><p className="text-gray-400 text-xs">{emp.email}</p></div></div></td>
                <td className="p-4 text-gray-300 hidden sm:table-cell">{emp.job_title}</td>
                <td className="p-4 hidden md:table-cell"><span className={`px-2 py-0.5 text-xs rounded-full border ${statusColors[emp.status]}`}>{emp.status}</span></td>
                <td className="p-4 hidden lg:table-cell"><span className={`px-2 py-0.5 text-xs rounded-full ${cosStatusColors[emp.cos_status]}`}>{emp.cos_status}</span></td>
                <td className="p-4 text-gray-300 hidden lg:table-cell">{emp.start_date || '-'}</td>
                <td className="p-4 text-right"><div className="flex justify-end gap-1"><button onClick={() => startEdit(emp)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button><button onClick={() => handleDelete(emp.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Employee' : 'Add Employee'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Full Name *</label><input required value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Email *</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Nationality</label><input value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" placeholder="e.g. Nigerian" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Job Title *</label><input required value={form.job_title} onChange={e => setForm({ ...form, job_title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Employment Type</label><select value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="full-time">Full-time</option><option value="part-time">Part-time</option><option value="contract">Contract</option></select></div>
                <div><label className="block text-sm text-gray-300 mb-1">Status</label><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="applicant">Applicant</option><option value="interviewing">Interviewing</option><option value="hired">Hired</option><option value="onboarding">Onboarding</option><option value="active">Active</option><option value="terminated">Terminated</option></select></div>
                <div><label className="block text-sm text-gray-300 mb-1">Start Date</label><input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              </div>
              <div className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" />COS Details</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className="block text-sm text-gray-300 mb-1">COS Reference Number</label><input value={form.cos_reference} onChange={e => setForm({ ...form, cos_reference: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" placeholder="e.g. COS-2026-001" /></div>
                  <div><label className="block text-sm text-gray-300 mb-1">COS Status</label><select value={form.cos_status} onChange={e => setForm({ ...form, cos_status: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm"><option value="not-required">Not Required</option><option value="pending">Pending</option><option value="assigned">Assigned</option><option value="used">Used</option><option value="expired">Expired</option></select></div>
                </div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-1">Annual Salary (&pound;)</label><input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Notes</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none" /></div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update Employee' : 'Add Employee'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
