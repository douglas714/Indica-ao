import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSessionAndProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          // --- CORREÇÃO APLICADA AQUI ---
          // A consulta agora usa 'name', que é o nome correto da coluna no banco de dados.
          const { data, error } = await supabase
            .from('profiles')
            .select('role, name, referral_code') // Alterado de 'full_name' para 'name'
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Erro ao carregar perfil:', error);
            await supabase.auth.signOut();
            setSession(null);
          } else {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error("Erro no processo de autenticação:", error);
      } finally {
        setLoading(false);
      }
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          setProfile(null);
        } else if (session && !profile) {
          getSessionAndProfile();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [profile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div>
      {session && profile ? (
        <Dashboard session={session} profile={profile} />
      ) : (
        <LoginForm />
      )}
    </div>
  )
}

export default App
