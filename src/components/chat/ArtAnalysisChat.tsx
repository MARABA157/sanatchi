import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { analyzeArtwork, getArtisticSuggestions, generateArtworkDescription } from '@/lib/openai';
import { Upload, Image as ImageIcon, MessageSquare, Wand2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'analysis' | 'suggestion' | 'description';
}

export function ArtAnalysisChat() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const analysis = await analyzeArtwork(selectedImage);
      setMessages(prev => [...prev, 
        { role: 'user', content: 'Lütfen bu eseri analiz et.' },
        { role: 'assistant', content: analysis, type: 'analysis' }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = async () => {
    if (!input) return;

    setIsLoading(true);
    try {
      const suggestion = await getArtisticSuggestions(input);
      setMessages(prev => [...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: suggestion, type: 'suggestion' }
      ]);
      setInput('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescription = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      const description = await generateArtworkDescription(selectedImage);
      setMessages(prev => [...prev,
        { role: 'user', content: 'Bu eser için bir açıklama yazar mısın?' },
        { role: 'assistant', content: description, type: 'description' }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="gap-2"
        >
          <Upload className="w-4 h-4" />
          {t('chat.uploadImage')}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {selectedImage && (
        <div className="relative rounded-lg overflow-hidden">
          <img
            src={selectedImage}
            alt="Uploaded artwork"
            className="max-h-96 w-full object-contain"
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-2">
              <Button
                onClick={handleAnalysis}
                variant="ghost"
                className="gap-2 text-white hover:text-violet-400"
                disabled={isLoading}
              >
                <ImageIcon className="w-4 h-4" />
                {t('chat.analyze')}
              </Button>
              <Button
                onClick={handleDescription}
                variant="ghost"
                className="gap-2 text-white hover:text-fuchsia-400"
                disabled={isLoading}
              >
                <Wand2 className="w-4 h-4" />
                {t('chat.describe')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px] bg-black/50 rounded-lg p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-violet-500/20 text-white'
                  : 'bg-white/10 text-gray-200'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.askAboutArt')}
          className="flex-1"
        />
        <Button
          onClick={handleSuggestion}
          className="gap-2"
          disabled={isLoading || !input}
        >
          <MessageSquare className="w-4 h-4" />
          {t('chat.send')}
        </Button>
      </div>
    </div>
  );
}
