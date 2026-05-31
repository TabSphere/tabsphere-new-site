import { useState, useEffect } from 'react'
import { supabase, type ContactSubmission } from '../lib/supabase'
import { Mail, Phone, Search, Check, Archive, Eye, Trash2 } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-orange-500/10 text-orange-400',
  read: 'bg-blue-500/10 text-blue-400',
  replied: 'bg-green-500/10 text-green-400',
  archived: 'bg-gray-500/10 text-gray-400',
}

export default function Contacts() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = async () => {
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_submissions').update({ status }).eq('id', id)
    fetchContacts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this submission?')) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    fetchContacts()
  }

  const filtered = contacts.filter(c => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Submissions</h1>
        <p className="text-gray-400 mt-1">{contacts.filter(c => c.status === 'new').length} new, {contacts.length} total</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm">
          <option value="all">All Status</option><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No submissions yet</p>
          </div>
        ) : filtered.map(contact => (
          <div key={contact.id} className="glass rounded-xl p-5 border border-white/5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 font-bold">{contact.name[0]}</div>
                <div>
                  <p className="text-white font-medium">{contact.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{contact.email}</span>
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{contact.phone}</span>}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[contact.status]}`}>{contact.status}</span>
            </div>
            <div className="pl-13 ml-12">
              {contact.service && <p className="text-xs text-orange-400 mb-1">Service: {contact.service}</p>}
              <p className="text-sm text-gray-300 leading-relaxed">{contact.message}</p>
              <p className="text-xs text-gray-500 mt-2">{new Date(contact.created_at).toLocaleString('en-GB')}</p>
            </div>
            <div className="flex gap-2 mt-4 pl-13 ml-12">
              {contact.status === 'new' && <button onClick={() => updateStatus(contact.id, 'read')} className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1"><Eye className="w-3 h-3" /> Mark Read</button>}
              {contact.status !== 'replied' && <button onClick={() => updateStatus(contact.id, 'replied')} className="px-3 py-1.5 text-xs rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all flex items-center gap-1"><Check className="w-3 h-3" /> Mark Replied</button>}
              {contact.status !== 'archived' && <button onClick={() => updateStatus(contact.id, 'archived')} className="px-3 py-1.5 text-xs rounded-lg bg-gray-500/10 text-gray-400 hover:bg-gray-500/20 transition-all flex items-center gap-1"><Archive className="w-3 h-3" /> Archive</button>}
              <button onClick={() => handleDelete(contact.id)} className="px-3 py-1.5 text-xs rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all flex items-center gap-1 ml-auto"><Trash2 className="w-3 h-3" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
