export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: string[];
}

export interface ChatProps {
  mode?: 'art' | 'general' | 'audio' | 'video';
  suggestions?: string[];
  onSendMessage?: (message: string, image?: File) => void;
}
