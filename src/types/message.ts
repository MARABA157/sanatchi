export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  userId: string;
}

export interface MessageRequest {
  content: string;
  conversationId?: string;
}

export interface MessageResponse {
  message: Message;
  conversation: Conversation;
}
