import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'react-hot-toast'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention'
  content: string
  created_at: string
  read: boolean
  link: string
  user: {
    username: string
    avatar_url: string
  }
}

interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  loading?: boolean
  onMarkAsRead: (notificationId: string) => Promise<void>
  onMarkAllAsRead: () => Promise<void>
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  loading,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await onMarkAsRead(notification.id)
    }
  }

  if (loading) {
    return (
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      >
        <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-50"
        >
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                onClick={onMarkAllAsRead}
                variant="link"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Mark all as read
              </Button>
            )}
          </div>

          <ScrollArea className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={notification.link}
                  onClick={() => handleNotificationClick(notification)}
                  className={`block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-700 last:border-0 ${
                    !notification.read ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.user.avatar_url} />
                      <AvatarFallback>
                        {notification.user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notification.read ? 'font-medium' : ''
                        }`}
                      >
                        {notification.content}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </ScrollArea>
        </motion.div>
      )}
    </div>
  )
}

export default NotificationDropdown
