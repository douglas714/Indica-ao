import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  MousePointer,
  Calendar,
  Target
} from 'lucide-react'

export function ReferralStats({ userId, referralCode }) {
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeContracts: 0,
    totalEarnings: 0,
    thisMonthReferrals: 0,
    conversionRate: 0,
    totalClicks: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    try {
      // Busca indicações
      const { data: referrals, error } = await supabase
        .from('profiles')
        .select('current_balance, contract_status, created_at')
        .eq('referred_by', userId)

      if (error) {
        console.error('Erro ao buscar estatísticas:', error)
        return
      }

      const totalReferrals = referrals?.length || 0
      const activeContracts = referrals?.filter(r => r.contract_status === 'ativo').length || 0
      const totalEarnings = referrals?.reduce((sum, r) => {
        if (r.contract_status === 'ativo' && r.current_balance > 0) {
          return sum + (r.current_balance * 0.01)
        }
        return sum
      }, 0) || 0

      // Indicações deste mês
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthReferrals = referrals?.filter(r => {
        const createdDate = new Date(r.created_at)
        return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
      }).length || 0

      // Taxa de conversão simulada (em um sistema real, você teria dados de cliques)
      const conversionRate = totalReferrals > 0 ? ((activeContracts / totalReferrals) * 100) : 0

      setStats({
        totalReferrals,
        activeContracts,
        totalEarnings,
        thisMonthReferrals,
        conversionRate,
        totalClicks: totalReferrals * 3 // Simulação: assumindo 3 cliques por indicação
      })
    } catch (err) {
      console.error('Erro inesperado:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Total de Indicados</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{stats.totalReferrals}</div>
          <p className="text-xs text-blue-700">
            {stats.thisMonthReferrals} este mês
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Contratos Ativos</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{stats.activeContracts}</div>
          <p className="text-xs text-green-700">
            {formatPercentage(stats.conversionRate)} taxa de conversão
          </p>
        </CardContent>
      </Card>
      
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-900">Ganho Recorrente</CardTitle>
          <DollarSign className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{formatCurrency(stats.totalEarnings)}</div>
          <p className="text-xs text-purple-700">
            1% sobre saldos ativos
          </p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-900">Engajamento</CardTitle>
          <MousePointer className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{stats.totalClicks}</div>
          <p className="text-xs text-orange-700">
            cliques no seu link
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

