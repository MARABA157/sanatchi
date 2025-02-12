import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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

interface MessageListProps {
  selectedConversation: Conversation | null
  onSelect: (conversation: Conversation) => void
}

export function MessageList({ selectedConversation, onSelect }: MessageListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return

      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('conversations')
          .select('*, user:profiles(*), last_message:messages(*)')
          .eq('user_id', user.id)
          .order('last_message_at', { ascending: false })

        if (error) throw error

        setConversations(data || [])
      } catch (error) {
        console.error('Error fetching conversations:', error)
        toast({
          title: 'Hata',
          description: 'Konuşmalar yüklenirken bir hata oluştu',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <LoadingSpinner className="w-8 h-8" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-muted-foreground">Henüz hiç mesajınız yok</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="space-y-2 p-4">
        {conversations.map((conversation) => (
          <motion.div
            key={conversation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              variant={selectedConversation?.id === conversation.id ? 'secondary' : 'ghost'}
              className="w-full justify-start px-2"
              onClick={() => onSelect(conversation)}
            >
              <div className="flex items-center space-x-3 w-full">
                <Avatar>
                  <AvatarImage src={conversation.user.avatar_url || undefined} />
                  <AvatarFallback>{conversation.user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1 text-left">
                  <p className="text-sm font-medium leading-none">{conversation.user.username}</p>
                  {conversation.last_message && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.last_message.content}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {conversation.last_message && (
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.last_message.created_at), 'HH:mm', {
                        locale: tr,
                      })}
                    </span>
                  )}
                  {conversation.unread_count > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 text-xs text-white bg-primary rounded-full">
                      {conversation.unread_count}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}

export default MessageList
