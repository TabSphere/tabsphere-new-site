import { useEffect, useState } from 'react'
import { useClientAuth } from './ClientAuthContext'
import { supabase } from '../lib/supabase'
import { MessageSquare, ArrowRight } from 'lucide-react'

export default function ClientMessages() {
  const { user } = useClientAuth()
  const [projectList, setProjectList] = useState<any[]>([])

  useEffect(() => { if (user) fetchProjects() }, [user])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('id, name, status, progress').eq('client_id', user!.id)
    if (!data) return
    // Get last message for each project
    const withMessages = await Promise.all(data.map(async p => {
      const { data: msg } = await supabase.from('project_messages').select('*').eq('project_id', p.id).order('created_at', { ascending: false }).limit(1).single()
      const { count } = await supabase.from('project_messages').select('*', { count: 'exact', head: true }).eq('project_id', p.id).eq('read', false).eq('sender_type', 'admin')
      return { ...p, lastMessage: msg, unread: count || 0 }
    }))
    setProjectList(withMessages)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-gray-400 mt-1">Chat with TabSphere on your projects</p>
      </div>

      <div className="space-y-3">
        {projectList.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500 border border-white/5">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No active conversations</p>
          </div>
        ) : projectList.map(p => (
          <a key={p.id} href={`/client/project/${p.id}`} className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/20 transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-white group-hover:text-orange-400 transition-colors">{p.name}</h3>
                {p.unread > 0 && <span className="px-2 py-0.5 text-[10px] rounded-full bg-orange-500 text-white font-bold">{p.unread} new</span>}
              </div>
              {p.lastMessage ? (
                <p className="text-sm text-gray-400 truncate">{p.lastMessage.sender_name}: {p.lastMessage.message}</p>
              ) : (
                <p className="text-sm text-gray-500">No messages yet</p>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  )
}
