import { useState, useEffect } from 'react'
import { supabase, type BlogPost } from '../lib/supabase'
import { Plus, Search, Pencil, Trash2, X, Save, EyeOff, Calendar, Tag } from 'lucide-react'

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', featured_image: '',
    category: '', tags: '', status: 'draft' as string, meta_title: '', meta_description: '',
  })

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setPosts(data || [])
  }

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || generateSlug(form.title)
    const payload = {
      ...form, slug,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    }
    if (editing) {
      await supabase.from('blog_posts').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('blog_posts').insert({ ...payload, author: 'TabSphere Team' })
    }
    setShowForm(false); setEditing(null)
    setForm({ title: '', slug: '', excerpt: '', content: '', featured_image: '', category: '', tags: '', status: 'draft', meta_title: '', meta_description: '' })
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    await supabase.from('blog_posts').delete().eq('id', id)
    fetchPosts()
  }

  const startEdit = (post: BlogPost) => {
    setEditing(post)
    setForm({
      title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content,
      featured_image: post.featured_image || '', category: post.category || '',
      tags: (post.tags || []).join(', '), status: post.status, meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
    })
    setShowForm(true)
  }

  const filtered = posts.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog</h1>
          <p className="text-gray-400 mt-1">Create and manage blog posts</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditing(null) }} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Write Post
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..." className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 text-sm" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm">
          <option value="all">All</option><option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-gray-500">
            <EyeOff className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No blog posts yet</p>
          </div>
        ) : filtered.map(post => (
          <div key={post.id} className="glass rounded-xl p-5 border border-white/5 flex items-start gap-4">
            {post.featured_image ? (
              <img src={post.featured_image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0"><Tag className="w-6 h-6 text-gray-500" /></div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-medium truncate">{post.title}</h3>
                <span className={`px-2 py-0.5 text-[10px] rounded-full ${post.status === 'published' ? 'bg-green-500/10 text-green-400' : post.status === 'draft' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}`}>{post.status}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-2">{post.excerpt || post.content.slice(0, 120)}...</p>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {post.category && <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{post.category}</span>}
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.created_at).toLocaleDateString('en-GB')}</span>
              </div>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <button onClick={() => startEdit(post)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{editing ? 'Edit Post' : 'Write New Post'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div><label className="block text-sm text-gray-300 mb-1">Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: form.slug || generateSlug(e.target.value) })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Category</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" placeholder="e.g. Web Design" /></div>
              </div>
              <div><label className="block text-sm text-gray-300 mb-1">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none" placeholder="Short summary for listings..." /></div>
              <div><label className="block text-sm text-gray-300 mb-1">Content *</label><textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={10} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none font-mono" placeholder="Write your post content here... Supports HTML and Markdown." /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-sm text-gray-300 mb-1">Featured Image URL</label><input value={form.featured_image} onChange={e => setForm({ ...form, featured_image: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" placeholder="https://..." /></div>
                <div><label className="block text-sm text-gray-300 mb-1">Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" placeholder="web design, SEO, Scotland" /></div>
              </div>
              <div className="border border-white/5 rounded-xl p-4 bg-white/[0.02]">
                <h4 className="text-sm font-medium text-white mb-3">SEO</h4>
                <div className="space-y-3">
                  <div><label className="block text-sm text-gray-300 mb-1">Meta Title</label><input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm" /></div>
                  <div><label className="block text-sm text-gray-300 mb-1">Meta Description</label><textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm resize-none" /></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-300">Status:</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500 text-sm">
                  <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"><Save className="w-4 h-4" />{editing ? 'Update Post' : 'Publish Post'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
