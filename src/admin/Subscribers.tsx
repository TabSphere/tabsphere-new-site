import { useState, useEffect } from 'react'
import { supabase, type NewsletterSubscriber } from '../lib/supabase'
import { Download, Users, Trash2, Search, Mail, Check } from 'lucide-react'

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
    setSubscribers(data || [])
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    await supabase.from('newsletter_subscribers').delete().eq('id', id)
    fetchSubscribers()
  }

  const exportCSV = () => {
    const csv = ['Email,Source,Date Subscribed', ...subscribers.map(s => `${s.email},${s.source || 'website'},${new Date(s.created_at).toLocaleDateString('en-GB')}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'tabsphere-subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = subscribers.filter(s => !search || s.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-gray-400 mt-1">{subscribers.length} newsletter subscriber{subscribers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 border border-white/10 hover:border-orange-500/30 text-gray-300 hover:text-white rounded-xl text-sm transition-all flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search emails..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
      </div>

      <div className="glass rounded-xl border border-white/5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No subscribers yet</p>
            <p className="text-xs mt-1">They appear here when people sign up via your newsletter section</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(sub => (
              <div key={sub.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02]">
                <div className="w-9 h-9 rounded-full bg-purple-500/10 flex items-center justify-center"><Mail className="w-4 h-4 text-purple-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{sub.email}</p>
                  <p className="text-xs text-gray-400">{sub.source || 'Website'} &middot; {new Date(sub.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/10 text-green-400 flex items-center gap-1"><Check className="w-3 h-3" /> Active</span>
                <button onClick={() => handleDelete(sub.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
