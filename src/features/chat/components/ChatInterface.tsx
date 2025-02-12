import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, ChatProps } from '../Types';

export function ChatInterface({ mode = 'general', suggestions = [], onSendMessage }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !imageUpload && !isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      attachments: imageUpload ? [URL.createObjectURL(imageUpload)] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (onSendMessage) {
      onSendMessage(input, imageUpload);
    }
    setInput('');
    setImageUpload(null);
    setIsLoading(true);

    // Simüle edilmiş AI yanıtı - gerçek implementasyonda bu kısım değişecek
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Bu bir örnek AI yanıtıdır.',
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] max-w-2xl mx-auto">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${
                message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <Avatar className="h-8 w-8">
                {message.role === 'assistant' ? (
                  <>
                    <AvatarImage src="/ai-avatar.png" />
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/user-avatar.png" />
                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </>
                )}
              </Avatar>
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.role === 'assistant'
                    ? 'bg-secondary'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.attachments?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt="Uploaded content"
                    className="mt-2 rounded-md max-w-full h-auto"
                  />
                ))}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI yanıt yazıyor...</span>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        {suggestions.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mesajınızı yazın..."
            className="flex-1"
            disabled={isLoading}
          />
          {mode === 'art' && (
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
            />
          )}
          {mode === 'art' && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => document.getElementById('image-upload')?.click()}
              disabled={isLoading}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
