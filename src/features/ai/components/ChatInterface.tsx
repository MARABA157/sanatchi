import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, Loader2, ImageIcon, RefreshCcw } from 'lucide-react';
import { ollamaService } from '@/services/ollamaService';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachments?: string[];
}

interface ChatInterfaceProps {
  mode: string;
  suggestions: string[];
  onSendMessage: (message: string, image?: File) => void;
}

export function ChatInterface({ mode, suggestions, onSendMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ollamaService.chat(input);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Chat hatası:', error);
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Mesaj Alanı */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-lg font-semibold mb-2">Sanat Asistanına Hoş Geldiniz!</h2>
              <p>Size nasıl yardımcı olabilirim?</p>
              <div className="mt-6 grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="p-3 hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                    onClick={() => setInput(suggestion)}
                  >
                    {suggestion}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'assistant' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="w-5 h-5" />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-4 max-w-[80%] space-y-2 ${
                    message.role === 'assistant'
                      ? 'bg-background border'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.attachments?.map((attachment, index) => (
                    <img
                      key={index}
                      src={attachment}
                      alt="Uploaded"
                      className="max-w-sm rounded-lg mb-2"
                    />
                  ))}
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="rounded-lg p-4 bg-background border">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Giriş Alanı */}
      <div className="border-t bg-background p-4">
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
            {imageUpload && (
              <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm">{imageUpload.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4"
                  onClick={() => setImageUpload(null)}
                >
                  <RefreshCcw className="w-3 h-3" />
                </Button>
              </div>
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`${mode} modundasınız...`}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          
          <Button type="button" onClick={handleSubmit} disabled={!input.trim() || isLoading}>
            <Send className="w-4 h-4" />
            <span className="sr-only">Gönder</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
