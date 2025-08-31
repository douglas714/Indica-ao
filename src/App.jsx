import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { LoginForm } from './components/LoginForm'
import { Dashboard } from './components/Dashboard'
import { Toaster } from 'sonner'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verifica se há uma sessão ativa
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Escuta mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, referral_code')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao carregar perfil:', error)
        await supabase.auth.signOut()
        return
      }

      if (data.role !== 'consultor') {
        console.error('Usuário não é consultor')
        await supabase.auth.signOut()
        return
      }

      setProfile(data)
    } catch (err) {
      console.error('Erro inesperado:', err)
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData, profileData) => {
    setUser(userData)
    setProfile(profileData)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return <LoginForm onLogin={handleLogin} />
  }

  return (
    <>
      <Dashboard user={user} profile={profile} onLogout={handleLogout} />
      <Toaster position="top-right" />
    </>
  )
}

export default App
