import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { Upload, File, Download, Trash2, Search, FolderOpen, X } from 'lucide-react'

export default function Documents() {
  const [files, setFiles] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [uploadMeta, setUploadMeta] = useState({ entity_type: 'general' as string, entity_id: '' })
  const [showUpload, setShowUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchFiles() }, [])

  const fetchFiles = async () => {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false })
    setFiles(data || [])
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)

    const filePath = `${uploadMeta.entity_type}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file)
    if (uploadError) { setUploading(false); return }

    const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath)

    await supabase.from('documents').insert({
      filename: file.name,
      original_name: file.name,
      file_type: file.type,
      file_size: file.size,
      bucket_path: filePath,
      public_url: publicUrl,
      entity_type: uploadMeta.entity_type,
      entity_id: uploadMeta.entity_id || null,
    })

    setUploading(false)
    setShowUpload(false)
    fetchFiles()
  }

  const handleDelete = async (doc: any) => {
    if (!confirm('Delete this file?')) return
    await supabase.storage.from('documents').remove([doc.bucket_path])
    await supabase.from('documents').delete().eq('id', doc.id)
    fetchFiles()
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filtered = files.filter(f => {
    const matchesSearch = !search || f.original_name.toLowerCase().includes(search.toLowerCase())
    const matchesEntity = entityFilter === 'all' || f.entity_type === entityFilter
    return matchesSearch && matchesEntity
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Documents</h1>
          <p className="text-gray-400 mt-1">Store employee docs, contracts &amp; company files</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
        </div>
        <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm">
          <option value="all">All</option><option value="employee">Employee</option><option value="client">Client</option><option value="company">Company</option><option value="general">General</option>
        </select>
      </div>

      <div className="glass rounded-xl border border-white/5">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No documents yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(f => (
              <div key={f.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02]">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"><File className="w-5 h-5 text-orange-400" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{f.original_name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatSize(f.file_size)}</span>
                    <span className="capitalize">{f.entity_type}</span>
                    <span>{new Date(f.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {f.public_url && <a href={f.public_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Download className="w-4 h-4" /></a>}
                  <button onClick={() => handleDelete(f)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Document</h3>
              <button onClick={() => setShowUpload(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm text-gray-300 mb-1">Document Type</label><select value={uploadMeta.entity_type} onChange={e => setUploadMeta({ ...uploadMeta, entity_type: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none text-sm"><option value="general">General</option><option value="employee">Employee Document</option><option value="client">Client Document</option><option value="company">Company Document</option></select></div>
              <div><label className="block text-sm text-gray-300 mb-1">Employee/Client ID (optional)</label><input value={uploadMeta.entity_id} onChange={e => setUploadMeta({ ...uploadMeta, entity_id: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none text-sm" placeholder="Link to specific record" /></div>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-orange-500/30 rounded-xl p-8 text-center cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Click to select file</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG up to 50MB</p>
              </div>
              <input ref={fileInputRef} type="file" onChange={handleUpload} className="hidden" />
              {uploading && <p className="text-sm text-orange-400 text-center">Uploading...</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
