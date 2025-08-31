import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { ReferralLinkCard } from './ReferralLinkCard'
import { ReferralStats } from './ReferralStats'
import { 
  RefreshCw, 
  LogOut, 
  Users, 
  DollarSign, 
  TrendingUp,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export function Dashboard({ user, profile, onLogout }) {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchReferrals = async () => {
    try {
      // --- CORREÇÃO APLICADA AQUI: Usando 'name' ---
      const { data, error } = await supabase
        .from('profiles')
        .select('name, phone, current_balance, contract_status') // Alterado de 'full_name' para 'name'
        .eq('referred_by', user.id)
        .order('name') // Alterado de 'full_name' para 'name'

      if (error) {
        console.error('Erro ao buscar indicados:', error)
        return
      }

      setReferrals(data || [])
    } catch (err) {
      console.error('Erro inesperado:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [user.id])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchReferrals()
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ativo':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>
      case 'inativo':
        return <Badge variant="secondary"><AlertCircle className="w-3 h-3 mr-1" />Inativo</Badge>
      case 'cancelado':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const calculateEarning = (balance, status) => {
    if (status === 'ativo' && balance > 0) {
      return balance * 0.01
    }
    return 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel do Consultor</h1>
              {/* --- CORREÇÃO APLICADA AQUI: Usando 'profile.name' --- */}
              <p className="text-gray-600">Bem-vindo, {profile.name}</p>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReferralStats userId={user.id} referralCode={profile.referral_code} />

        <div className="mb-8">
          <ReferralLinkCard 
            referralCode={profile.referral_code} 
            consultorName={profile.name} // Alterado de 'full_name' para 'name'
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Suas Indicações Detalhadas
                </CardTitle>
                <CardDescription>
                  Acompanhe todos os seus indicados, status dos contratos e ganhos individuais
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-blue-50 hover:bg-blue-100 border-blue-200"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar Dados
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma indicação ainda</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Compartilhe seu link de indicação acima para começar a ganhar com suas indicações. 
                  Cada pessoa que se cadastrar pelo seu link se tornará sua indicação automaticamente.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Dica:</strong> Use o QR Code ou compartilhe o link nas suas redes sociais para alcançar mais pessoas!
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead><User className="w-4 h-4 inline mr-2" />Cliente Indicado</TableHead>
                      <TableHead><Phone className="w-4 h-4 inline mr-2" />Telefone</TableHead>
                      <TableHead><DollarSign className="w-4 h-4 inline mr-2" />Saldo do Cliente</TableHead>
                      <TableHead>Status do Contrato</TableHead>
                      <TableHead className="text-right"><TrendingUp className="w-4 h-4 inline mr-2" />Seu Ganho Recorrente</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((referral, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {/* --- CORREÇÃO APLICADA AQUI: Usando 'referral.name' --- */}
                          {referral.name || 'Nome não informado'}
                        </TableCell>
                        <TableCell>
                          {referral.phone || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(referral.current_balance || 0)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(referral.contract_status)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          <span className={calculateEarning(referral.current_balance, referral.contract_status) > 0 ? 'text-green-600' : 'text-gray-500'}>
                            {formatCurrency(calculateEarning(referral.current_balance, referral.contract_status))}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
