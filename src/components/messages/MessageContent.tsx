import { useState, useEffect, useRef } from 'react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface User {
  id: string
  username: string
  avatar_url: string | null
}

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  receiver_id: string
  read: boolean
  sender: User
  receiver: User
}

interface Conversation {
  id: string
  user: User
  last_message?: Message
  unread_count: number
}

interface MessageContentProps {
  conversation: Conversation
  onMessageSent: () => void
}

export function MessageContent({ conversation, onMessageSent }: MessageContentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles(*), receiver:profiles(*)')
          .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
          .order('created_at', { ascending: true })

        if (error) throw error

        setMessages(data || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast({
          title: 'Hata',
          description: 'Mesajlar yüklenirken bir hata oluştu',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          if (payload.new) {
            setMessages((prev) => [...prev, payload.new as Message])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, toast])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return

    try {
      setSending(true)
      const { error } = await supabase.from('messages').insert({
        content: newMessage.trim(),
        sender_id: user.id,
        receiver_id: conversation.user.id,
      })

      if (error) throw error

      setNewMessage('')
      onMessageSent()
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Hata',
        description: 'Mesaj gönderilirken bir hata oluştu',
        variant: 'destructive',
      })
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[70%] ${
                message.sender_id === user?.id ? 'flex-row-reverse space-x-reverse' : 'flex-row'
              }`}
            >
              <Avatar>
                <AvatarImage src={message.sender.avatar_url || undefined} />
                <AvatarFallback>{message.sender.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div
                  className={`rounded-lg p-3 ${
                    message.sender_id === user?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                <div
                  className={`text-xs text-muted-foreground mt-1 ${
                    message.sender_id === user?.id ? 'text-right' : 'text-left'
                  }`}
                >
                  {format(new Date(message.created_at), 'HH:mm', { locale: tr })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="min-h-[60px]"
          />
          <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
            {sending ? <LoadingSpinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MessageContent
