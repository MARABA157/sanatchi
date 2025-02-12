import { supabase } from '../config/supabase';
import { Notification } from '../types/notifications';

export const notificationService = {
  // Bildirimleri getir
  async getNotifications(userId: string) {
    try {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Bildirim oluştur
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          {
            ...notification,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Bildirimi okundu olarak işaretle
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Bildirimleri dinle
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          this.getNotifications(userId).then(callback);
        }
      )
      .subscribe();
  }
};
