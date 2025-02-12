import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  signIn: (email: string, password: string) => Promise<{ data: any, error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any, error: any }>
  signOut: () => Promise<void>
  loading: boolean
  socialSignIn: (provider: 'google' | 'github' | 'apple') => Promise<{ data: any, error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN' && session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(profile)
        toast.success('Başarıyla giriş yapıldı!')
        navigate('/')
      }

      if (event === 'SIGNED_OUT') {
        setProfile(null)
        toast.success('Çıkış yapıldı')
        navigate('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      const timestamp = new Date().toISOString()
      const errorDetails = {
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'Stack trace not available',         
        timestamp,
        email
      }
      
      console.error('SignIn error:', errorDetails)
      toast.error('Giriş başarısız: ' + error.message)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      const timestamp = new Date().toISOString()
      const errorDetails = {
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'Stack trace not available',
        timestamp,
        email,
        fullName
      }
      
      console.error('SignUp error:', errorDetails)
      toast.error('Kayıt başarısız: ' + error.message)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      toast.success('Başarıyla çıkış yapıldı')
    } catch (error: any) {
      const timestamp = new Date().toISOString()
      const errorDetails = {
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'Stack trace not available',
        timestamp
      }
      
      console.error('SignOut error:', errorDetails)
      toast.error('Çıkış başarısız: ' + error.message)
      throw error
    }
  }

  const socialSignIn = async (provider: 'google' | 'github' | 'apple') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      const timestamp = new Date().toISOString()
      const errorDetails = {
        type: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'Stack trace not available',
        timestamp,
        provider
      }
      
      console.error('Social SignIn error:', errorDetails)
      toast.error('Sosyal giriş başarısız: ' + error.message)
      return { data: null, error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
        socialSignIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
