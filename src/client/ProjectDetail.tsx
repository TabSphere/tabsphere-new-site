import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'
import { useClientAuth } from './ClientAuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeft, Clock, CheckCircle, Circle, MessageSquare, Send, Paperclip, FileText, Download } from 'lucide-react'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useClientAuth()
  const [project, setProject] = useState<any>(null)
  const [milestones, setMilestones] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (id) fetchAll() }, [id])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Real-time messages
  useEffect(() => {
    if (!id) return
    const channel = supabase.channel(`project-${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_messages', filter: `project_id=eq.${id}` },
        (payload) => { setMessages(prev => [...prev, payload.new]) }
      ).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id])

  const fetchAll = async () => {
    setIsLoading(true)
    const [{ data: p }, { data: m }, { data: msg }, { data: docs }] = await Promise.all([
      supabase.from('projects').select('*').eq('id', id).single(),
      supabase.from('project_milestones').select('*').eq('project_id', id).order('due_date', { ascending: true }),
      supabase.from('project_messages').select('*').eq('project_id', id).order('created_at', { ascending: true }),
      supabase.from('project_documents').select('*').eq('project_id', id).order('created_at', { ascending: false }),
    ])
    setProject(p)
    setMilestones(m || [])
    setMessages(msg || [])
    setDocuments(docs || [])
    // Mark admin messages as read
    await supabase.from('project_messages').update({ read: true }).eq('project_id', id).eq('sender_type', 'admin')
    setIsLoading(false)
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !id || !user) return
    await supabase.from('project_messages').insert({
      project_id: id,
      client_id: user.id,
      sender_type: 'client',
      sender_name: user.full_name,
      message: newMessage.trim(),
    })
    setNewMessage('')
  }

  if (isLoading) return <div className="text-gray-400 text-center py-12">Loading project...</div>
  if (!project) return <div className="text-gray-400 text-center py-12">Project not found</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <a href="/client/projects" className="text-sm text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </a>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            <p className="text-gray-400 mt-1">{project.description}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Started: {project.start_date ? new Date(project.start_date).toLocaleDateString('en-GB') : 'TBC'}</span>
          <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString('en-GB') : 'TBC'}</span>
          <span>Budget: &pound;{project.budget?.toLocaleString() || 'TBC'}</span>
        </div>
        {/* Overall progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Overall Progress</span>
            <span className="text-white font-medium">{project.progress || 0}%</span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Milestones + Documents */}
        <div className="lg:col-span-1 space-y-6">
          {/* Milestones */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="font-semibold text-white mb-4">Project Milestones</h3>
            {milestones.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No milestones set yet</p>
            ) : (
              <div className="space-y-3">
                {milestones.map((ms, i) => (
                  <div key={ms.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      {ms.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600" />
                      )}
                      {i < milestones.length - 1 && <div className="w-px h-full bg-white/10 my-1" />}
                    </div>
                    <div className="pb-4">
                      <p className={`text-sm font-medium ${ms.status === 'completed' ? 'text-green-400' : 'text-white'}`}>{ms.title}</p>
                      <p className="text-xs text-gray-400">{ms.description}</p>
                      {ms.due_date && <p className="text-xs text-gray-500 mt-0.5">Due: {new Date(ms.due_date).toLocaleDateString('en-GB')}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents */}
          <div className="glass rounded-xl border border-white/5 p-5">
            <h3 className="font-semibold text-white mb-4">Project Files</h3>
            {documents.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No files yet</p>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <a key={doc.id} href={doc.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all">
                    <FileText className="w-5 h-5 text-orange-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{doc.filename}</p>
                      <p className="text-xs text-gray-400">{new Date(doc.created_at).toLocaleDateString('en-GB')}</p>
                    </div>
                    <Download className="w-4 h-4 text-gray-500" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="lg:col-span-2">
          <div className="glass rounded-xl border border-white/5 flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-orange-400" />
              <h3 className="font-semibold text-white">Project Chat</h3>
              <span className="ml-auto text-xs text-gray-500">{messages.length} messages</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No messages yet</p>
                  <p className="text-xs">Send a message to start the conversation</p>
                </div>
              ) : messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.sender_type === 'client'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-white/5 text-gray-300 rounded-bl-md border border-white/5'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender_type === 'client' ? 'text-orange-200' : 'text-gray-500'}`}>
                      {msg.sender_name} &middot; {new Date(msg.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-white/5 flex gap-2">
              <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm" />
              <button type="submit" disabled={!newMessage.trim()}
                className="px-4 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-xl transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    planning: 'bg-blue-500/10 text-blue-400',
    active: 'bg-green-500/10 text-green-400',
    'in-progress': 'bg-orange-500/10 text-orange-400',
    review: 'bg-yellow-500/10 text-yellow-400',
    completed: 'bg-emerald-500/10 text-emerald-400',
    'on-hold': 'bg-gray-500/10 text-gray-400',
  }
  return <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[status] || colors.planning}`}>{status}</span>
}
