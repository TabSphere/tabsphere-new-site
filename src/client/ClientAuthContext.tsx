import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

type ClientUser = {
  id: string
  email: string
  full_name: string
  company: string | null
} | null

type ClientAuthContextType = {
  user: ClientUser
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined)

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ClientUser>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) fetchClientProfile(session.user.id)
      else setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchClientProfile(session.user.id)
      else { setUser(null); setIsLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchClientProfile = async (userId: string) => {
    const { data } = await supabase.from('clients').select('id,full_name,email,company').eq('id', userId).single()
    if (data) setUser({ id: data.id, email: data.email, full_name: data.full_name, company: data.company })
    setIsLoading(false)
  }

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message || null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <ClientAuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const ctx = useContext(ClientAuthContext)
  if (!ctx) throw new Error('useClientAuth must be used within ClientAuthProvider')
  return ctx
}
