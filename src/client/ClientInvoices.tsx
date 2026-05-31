import { useEffect, useState } from 'react'
import { useClientAuth } from './ClientAuthContext'
import { supabase } from '../lib/supabase'
import { Receipt, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function ClientInvoices() {
  const { user } = useClientAuth()
  const [invoices, setInvoices] = useState<any[]>([])

  useEffect(() => { if (user) fetchInvoices() }, [user])

  const fetchInvoices = async () => {
    const { data } = await supabase.from('invoices').select('*, projects(name)').eq('client_id', user!.id).order('created_at', { ascending: false })
    setInvoices(data || [])
  }

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <p className="text-gray-400 mt-1">View and download your invoices</p>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5 border border-white/5">
          <p className="text-sm text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">&pound;{totalPaid.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5">
          <p className="text-sm text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">&pound;{totalPending.toLocaleString()}</p>
        </div>
        <div className="glass rounded-xl p-5 border border-white/5">
          <p className="text-sm text-gray-400">Overdue</p>
          <p className="text-2xl font-bold text-red-400">&pound;{totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Invoice List */}
      <div className="glass rounded-xl border border-white/5">
        {invoices.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No invoices yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {invoices.map(inv => (
              <div key={inv.id} className="p-5 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  inv.status === 'paid' ? 'bg-green-500/10' : inv.status === 'overdue' ? 'bg-red-500/10' : 'bg-yellow-500/10'
                }`}>
                  {inv.status === 'paid' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                   inv.status === 'overdue' ? <AlertCircle className="w-5 h-5 text-red-400" /> :
                   <Clock className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{inv.description || `Invoice #${inv.id.slice(0, 8)}`}</p>
                  <p className="text-xs text-gray-400">{inv.projects?.name || 'Project'} &middot; {new Date(inv.created_at).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">&pound;{inv.amount?.toLocaleString()}</p>
                  <p className={`text-xs ${inv.status === 'paid' ? 'text-green-400' : inv.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'}`}>
                    {inv.status}
                  </p>
                </div>
                {inv.file_url && (
                  <a href={inv.file_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
