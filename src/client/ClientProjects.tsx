import { useEffect, useState } from 'react'
import { useClientAuth } from './ClientAuthContext'
import { supabase } from '../lib/supabase'
import { FolderOpen, ArrowRight, Clock } from 'lucide-react'

export default function ClientProjects() {
  const { user } = useClientAuth()
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => { if (user) fetchProjects() }, [user])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').eq('client_id', user!.id).order('created_at', { ascending: false })
    setProjects(data || [])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Projects</h1>
        <p className="text-gray-400 mt-1">All your projects with TabSphere</p>
      </div>

      <div className="grid gap-4">
        {projects.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500 border border-white/5">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No projects yet</p>
          </div>
        ) : projects.map(project => (
          <a key={project.id} href={`/client/project/${project.id}`} className="glass rounded-xl p-6 border border-white/5 hover:border-orange-500/20 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors">{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-gray-400">{project.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />
                    {project.deadline ? `Due ${new Date(project.deadline).toLocaleDateString('en-GB')}` : 'No deadline'}
                  </span>
                  <span>Budget: &pound;{project.budget?.toLocaleString() || 'TBC'}</span>
                </div>
                <div className="mt-3">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${project.progress || 0}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-orange-400 font-medium">{project.progress || 0}%</span>
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors ml-4 flex-shrink-0" />
            </div>
          </a>
        ))}
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
  return <span className={`px-2 py-0.5 text-[10px] rounded-full ${colors[status] || colors.planning}`}>{status}</span>
}
