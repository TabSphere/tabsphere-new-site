import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Save, RotateCcw, Check, FileText, Type, Image, Hash } from 'lucide-react'

type ContentSection = {
  id: string
  section: string
  key: string
  value: string
  label: string
}

const defaultContent: ContentSection[] = [
  { id: 'hero-headline', section: 'hero', key: 'headline', value: 'We Build Digital Experiences', label: 'Hero Headline' },
  { id: 'hero-subtext', section: 'hero', key: 'subtext', value: 'A registered UK digital studio \u2014 websites, apps and brands built remotely, delivered fast.', label: 'Hero Description' },
  { id: 'hero-cta-primary', section: 'hero', key: 'cta_primary', value: 'View Our Services', label: 'Primary CTA Button' },
  { id: 'hero-cta-secondary', section: 'hero', key: 'cta_secondary', value: 'Start a Project', label: 'Secondary CTA Button' },
  { id: 'hero-badge', section: 'hero', key: 'badge', value: 'Stirling, Scotland \u00b7 UK Co. 16534288', label: 'Badge Text' },
  { id: 'services-title', section: 'services', key: 'title', value: 'Full Digital Stack. One Team.', label: 'Services Section Title' },
  { id: 'services-desc', section: 'services', key: 'description', value: 'From your first website to a complete SaaS product \u2014 joined-up delivery, no handoff headaches.', label: 'Services Description' },
  { id: 'portfolio-title', section: 'portfolio', key: 'title', value: 'Recent Projects', label: 'Portfolio Section Title' },
  { id: 'pricing-title', section: 'pricing', key: 'title', value: 'Transparent Pricing. No Surprises.', label: 'Pricing Section Title' },
  { id: 'contact-title', section: 'contact', key: 'title', value: 'Ready to Transform Your Digital Presence?', label: 'Contact Section Title' },
  { id: 'footer-company', section: 'footer', key: 'company_desc', value: 'A Stirling-based digital studio delivering websites, apps and digital strategies for businesses across Scotland and the UK.', label: 'Footer Description' },
]

export default function ContentEditor() {
  const [content, setContent] = useState<ContentSection[]>(defaultContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    const { data } = await supabase.from('website_content').select('*')
    if (data && data.length > 0) {
      const updated = content.map(item => {
        const found = data.find((d: any) => d.key === item.key)
        return found ? { ...item, value: found.value, id: found.id } : item
      })
      setContent(updated)
    }
  }

  const updateValue = (key: string, newValue: string) => {
    setContent(prev => prev.map(item => item.key === key ? { ...item, value: newValue } : item))
    setSaved(false)
  }

  const saveAll = async () => {
    setSaving(true)
    for (const item of content) {
      await supabase.from('website_content').upsert({
        section: item.section,
        key: item.key,
        value: item.value,
      })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const resetDefaults = () => {
    setContent(defaultContent)
    setSaved(false)
  }

  const grouped = content.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {} as Record<string, ContentSection[]>)

  const sectionIcons: Record<string, any> = {
    hero: Hash,
    services: FileText,
    portfolio: Image,
    pricing: Type,
    contact: FileText,
    footer: FileText,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Editor</h1>
          <p className="text-gray-400 mt-1">Edit your website text directly</p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetDefaults} className="px-4 py-2 border border-white/10 rounded-xl text-sm text-gray-300 hover:bg-white/5 transition-all flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button onClick={saveAll} disabled={saving} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2">
            {saving ? 'Saving...' : saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save All</>}
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([section, items]) => {
        const Icon = sectionIcons[section] || FileText
        return (
          <div key={section} className="glass rounded-xl border border-white/5">
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <Icon className="w-4 h-4 text-orange-400" />
              <h3 className="font-semibold text-white capitalize">{section}</h3>
            </div>
            <div className="p-4 space-y-4">
              {items.map(item => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">{item.label}</label>
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateValue(item.key, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
