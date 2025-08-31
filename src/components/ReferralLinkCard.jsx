import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { 
  Copy, 
  QrCode, 
  Share2, 
  ExternalLink,
  Download,
  Eye,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner'
import QRCodeLib from 'qrcode'

export function ReferralLinkCard({ referralCode, consultorName }) {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const referralLink = `https://cvjeoxneffctybjspjcs.supabase.co/functions/v1/referral-handler/r/${referralCode}`

  useEffect(() => {
    // Gera o QR Code
    QRCodeLib.toDataURL(referralLink, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    }).then(url => {
      setQrCodeUrl(url)
    }).catch(err => {
      console.error('Erro ao gerar QR Code:', err)
    })
  }, [referralLink])

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Link copiado para a área de transferência!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Erro ao copiar link')
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Indicação de ${consultorName}`,
          text: 'Cadastre-se através do meu link de indicação e tenha acesso a benefícios exclusivos!',
          url: referralLink
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(referralLink)
        }
      }
    } else {
      copyToClipboard(referralLink)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = `qr-code-indicacao-${referralCode}.png`
      link.href = qrCodeUrl
      link.click()
      toast.success('QR Code baixado com sucesso!')
    }
  }

  const previewLink = () => {
    // Abre o link em uma nova aba para testar
    window.open(referralLink, '_blank')
    toast.info('Link aberto em nova aba para teste')
  }

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-blue-900">🔗 Seu Link de Indicação</CardTitle>
            <CardDescription className="text-blue-700">
              Compartilhe este link para começar a ganhar com suas indicações
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Código: {referralCode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Link Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Link de Indicação:</label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-white rounded-md border border-blue-200 font-mono text-sm break-all shadow-sm">
              {referralLink}
            </div>
            <Button 
              onClick={() => copyToClipboard(referralLink)}
              className={`transition-all duration-200 ${copied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" onClick={shareLink} className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
          <Button variant="outline" onClick={() => setShowQR(!showQR)} className="w-full">
            <QrCode className="w-4 h-4 mr-2" />
            QR Code
          </Button>
          
          <Button variant="outline" onClick={previewLink} className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
          
          <Button variant="outline" onClick={downloadQRCode} className="w-full" disabled={!qrCodeUrl}>
            <Download className="w-4 h-4 mr-2" />
            Baixar QR
          </Button>
        </div>

        {/* QR Code Display */}
        {showQR && qrCodeUrl && (
          <div className="flex flex-col items-center space-y-3 p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-medium text-gray-900">QR Code do seu link</h4>
            <img 
              src={qrCodeUrl} 
              alt="QR Code do link de indicação" 
              className="border border-gray-200 rounded-lg shadow-sm"
            />
            <p className="text-xs text-gray-600 text-center max-w-xs">
              Seus clientes podem escanear este QR Code para acessar diretamente seu link de indicação
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Como usar seu link:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Compartilhe o link com seus contatos</li>
            <li>• Quando alguém se cadastrar pelo seu link, será automaticamente sua indicação</li>
            <li>• Você ganhará 1% recorrente sobre o saldo ativo de cada indicado</li>
            <li>• Acompanhe suas indicações na tabela abaixo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

