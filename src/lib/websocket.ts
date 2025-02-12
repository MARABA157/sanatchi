import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { toast } from 'react-hot-toast'

type WebSocketEvent = {
  type: string
  payload: any
}

type WebSocketSubscription = {
  channel: string
  callback: (payload: any) => void
}

class WebSocketManager {
  private channels: Map<string, RealtimeChannel>
  private subscriptions: Map<string, WebSocketSubscription[]>
  private reconnectAttempts: number
  private maxReconnectAttempts: number
  private reconnectDelay: number

  constructor() {
    this.channels = new Map()
    this.subscriptions = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000 // 1 saniye

    // Bağlantı durumunu dinle
    supabase
      .channel('system')
      .on('system', { event: '*' }, payload => {
        if (payload.event === 'disconnected') {
          this.handleDisconnect()
        }
      })
      .subscribe()
  }

  // Kanala abone ol
  subscribe(channelName: string, event: string, callback: (payload: any) => void) {
    let channel = this.channels.get(channelName)

    if (!channel) {
      channel = supabase.channel(channelName)
      this.channels.set(channelName, channel)
    }

    const subscription = { channel: channelName, callback }
    const subscriptions = this.subscriptions.get(event) || []
    subscriptions.push(subscription)
    this.subscriptions.set(event, subscriptions)

    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence sync:', channelName)
      })
      .on('broadcast', { event }, payload => {
        callback(payload)
      })
      .subscribe(status => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${channelName}`)
        }
      })

    return () => this.unsubscribe(channelName, event, callback)
  }

  // Kanaldan ayrıl
  unsubscribe(channelName: string, event: string, callback: (payload: any) => void) {
    const subscriptions = this.subscriptions.get(event) || []
    const index = subscriptions.findIndex(
      sub => sub.channel === channelName && sub.callback === callback
    )

    if (index !== -1) {
      subscriptions.splice(index, 1)
      this.subscriptions.set(event, subscriptions)
    }

    if (subscriptions.length === 0) {
      const channel = this.channels.get(channelName)
      if (channel) {
        channel.unsubscribe()
        this.channels.delete(channelName)
      }
    }
  }

  // Mesaj yayınla
  broadcast(channelName: string, event: string, payload: any) {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.send({
        type: 'broadcast',
        event,
        payload,
      })
    }
  }

  // Presence bilgisini güncelle
  updatePresence(channelName: string, presence: any) {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.track(presence)
    }
  }

  // Presence bilgisini al
  getPresence(channelName: string) {
    const channel = this.channels.get(channelName)
    return channel?.presenceState() || {}
  }

  // Bağlantı koptuğunda
  private handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.reconnect()
      }, this.reconnectDelay * this.reconnectAttempts)
    } else {
      toast.error('Bağlantı hatası. Lütfen sayfayı yenileyin.')
    }
  }

  // Yeniden bağlan
  private async reconnect() {
    try {
      for (const [channelName, channel] of this.channels.entries()) {
        await channel.unsubscribe()
        const newChannel = supabase.channel(channelName)
        this.channels.set(channelName, newChannel)
        
        // Subscription'ları yeniden ekle
        for (const [event, subscriptions] of this.subscriptions.entries()) {
          subscriptions
            .filter(sub => sub.channel === channelName)
            .forEach(sub => {
              newChannel.on('broadcast', { event }, sub.callback)
            })
        }

        await newChannel.subscribe()
      }

      this.reconnectAttempts = 0
      toast.success('Bağlantı yeniden kuruldu')
    } catch (error) {
      console.error('Reconnection failed:', error)
      this.handleDisconnect()
    }
  }
}

// Singleton instance
export const websocket = new WebSocketManager()

// Hooks
export function useWebSocket(channelName: string, event: string) {
  return {
    subscribe: (callback: (payload: any) => void) =>
      websocket.subscribe(channelName, event, callback),
    broadcast: (payload: any) =>
      websocket.broadcast(channelName, event, payload),
    updatePresence: (presence: any) =>
      websocket.updatePresence(channelName, presence),
    getPresence: () => websocket.getPresence(channelName),
  }
}

// Örnek kullanımlar:
/*
// Mesajlaşma için
const messageSocket = useWebSocket('chat', 'new_message')
messageSocket.subscribe((message) => {
  console.log('New message:', message)
})
messageSocket.broadcast({ text: 'Hello!' })

// Bildirimler için
const notificationSocket = useWebSocket('notifications', 'new_notification')
notificationSocket.subscribe((notification) => {
  toast(notification.message)
})

// Online kullanıcılar için
const presenceSocket = useWebSocket('presence', 'update')
presenceSocket.updatePresence({ user_id: '123', status: 'online' })
const onlineUsers = presenceSocket.getPresence()
*/
