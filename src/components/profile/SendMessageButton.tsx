import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { MessageSquare } from 'lucide-react'

interface SendMessageButtonProps {
  userId: string
  username: string
}

export function SendMessageButton({
  userId,
  username,
}: SendMessageButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user || user.id === userId) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        navigate('/messages', { state: { userId } })
      }
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Mesaj Gönder
    </Button>
  )
}
