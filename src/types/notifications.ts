export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'bid'
  | 'sale'
  | 'message'
  | 'mention'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  timestamp: string;
  data: {
    title: string;
    body: string;
    image?: string;
    link?: string;
    actionText?: string;
    actionLink?: string;
    metadata?: Record<string, any>;
  };
}
