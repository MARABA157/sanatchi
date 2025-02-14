import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Kullanıcı mesajını ekle
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const ai = OpenSourceAI.getInstance();
      const response = await ai.generateChatCompletion(userMessage);

      // AI yanıtını ekle
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Üzgünüm, bir hata oluştu: ${error.message}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-6"
            >
              <Bot className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
              AI Sohbet
            </h1>
            <p className="text-xl text-gray-300">
              Llama2 AI ile sohbet edin
            </p>
          </div>

          {/* Mesaj Alanı */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 mb-6 h-[500px] overflow-y-auto flex flex-col space-y-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Sohbete başlamak için bir mesaj gönderin</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-purple-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-100'
                  }`}>
                    {message.content}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Input Alanı */}
          <form onSubmit={handleSubmit} className="flex gap-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 bg-black/20 backdrop-blur border-white/10 text-white placeholder:text-gray-400 resize-none"
              rows={1}
              disabled={loading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
