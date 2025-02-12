import { supabase } from '../config/supabase';
import { Message, Chat, ChatParticipant } from '../types/messaging';

interface ErrorLog {
  timestamp: string;
  error: unknown;
  context: {
    operation: string;
    params?: Record<string, unknown>;
  };
  stack?: string;
}

const logError = (error: unknown, operation: string, params?: Record<string, unknown>): ErrorLog => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    error,
    context: {
      operation,
      params,
    },
  };

  if (error instanceof Error) {
    errorLog.stack = error.stack;
  }

  console.error('Messaging service error:', errorLog);
  return errorLog;
};

export const messagingService = {
  // Sohbetleri getir
  async getChats(userId: string) {
    try {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .contains('participants', [userId])
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return chats;
    } catch (error) {
      const errorLog = logError(error, 'getChats', { userId });
      throw new Error(`Sohbetler yüklenirken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Mesajları getir
  async getMessages(chatId: string, lastMessageId?: string) {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (lastMessageId) {
        query = query.lt('id', lastMessageId);
      }

      const { data: messages, error } = await query;

      if (error) throw error;
      return messages;
    } catch (error) {
      const errorLog = logError(error, 'getMessages', { chatId, lastMessageId });
      throw new Error(`Mesajlar yüklenirken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Mesaj gönder
  async sendMessage(chatId: string, message: Omit<Message, 'id' | 'timestamp'>) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: chatId,
            ...message,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const errorLog = logError(error, 'sendMessage', { chatId, message });
      throw new Error(`Mesaj gönderilirken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Dosya yükle
  async uploadAttachment(chatId: string, file: File) {
    try {
      const fileName = `${chatId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('attachments')
        .upload(fileName, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from('attachments')
        .getPublicUrl(fileName);

      return publicUrl.publicUrl;
    } catch (error) {
      const errorLog = logError(error, 'uploadAttachment', { chatId, fileName: file.name });
      throw new Error(`Dosya yüklenirken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Yeni sohbet oluştur
  async createChat(participants: string[]) {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            participants,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      const errorLog = logError(error, 'createChat', { participants });
      throw new Error(`Sohbet oluşturulurken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Mesajları okundu olarak işaretle
  async markAsRead(chatId: string, messageIds: string[]) {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds)
        .eq('chat_id', chatId);

      if (error) throw error;
    } catch (error) {
      const errorLog = logError(error, 'markAsRead', { chatId, messageIds });
      throw new Error(`Mesajlar okundu olarak işaretlenirken bir hata oluştu: ${errorLog.error}`);
    }
  },

  // Mesajları dinle
  subscribeToMessages(chatId: string, callback: (messages: Message[]) => void) {
    try {
      return supabase
        .channel(`messages:${chatId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`
        }, payload => {
          callback([payload.new as Message]);
        })
        .subscribe();
    } catch (error) {
      const errorLog = logError(error, 'subscribeToMessages', { chatId });
      console.error(`Mesaj aboneliği başlatılırken bir hata oluştu: ${errorLog.error}`);
      throw error;
    }
  },

  // Sohbetleri dinle
  subscribeToChats(userId: string, callback: (chats: Chat[]) => void) {
    try {
      return supabase
        .channel(`chats:${userId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'chats',
          filter: `participants=cs.{${userId}}`
        }, payload => {
          callback([payload.new as Chat]);
        })
        .subscribe();
    } catch (error) {
      const errorLog = logError(error, 'subscribeToChats', { userId });
      console.error(`Sohbet aboneliği başlatılırken bir hata oluştu: ${errorLog.error}`);
      throw error;
    }
  }
};
