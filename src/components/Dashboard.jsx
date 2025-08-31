import { supabase } from '@/lib/supabase'
// --- CORREÇÃO APLICADA AQUI ---
// Adicionamos chaves {} para importar componentes com exportação nomeada.
// Também padronizamos o caminho usando o alias '@'.
import { ReferralLinkCard } from '@/components/ReferralLinkCard'
import { ReferralStats } from '@/components/ReferralStats'

export default function Dashboard({ session, profile }) {

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (!profile) {
    return <div>Carregando informações do dashboard...</div>
  }

  return (
    <div className="p-4 bg-gray-800 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Bem-vindo, {profile.name}!</p>
            <p className="text-sm text-gray-400">Seu e-mail: {session.user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>

        <div className="space-y-6">
          <ReferralLinkCard referralCode={profile.referral_code} />
          {/* Apenas consultores podem ver as estatísticas */}
          {profile.role === 'consultor' && <ReferralStats userId={session.user.id} />}
        </div>
      </div>
    </div>
  )
}
