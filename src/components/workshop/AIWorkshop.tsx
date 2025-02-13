import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Paintbrush, Wand2, Share2, Download, ImageIcon, Video, Music, Mic } from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AIWorkshop() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioType, setAudioType] = useState<'music' | 'speech'>('music');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!prompt) {
      setError('Lütfen bir prompt girin');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateImage(prompt);
      setGeneratedImage(result.url);
    } catch (error) {
      console.error('Image generation error:', error);
      setError(error instanceof Error ? error.message : 'Görsel oluşturulurken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    setIsLoading(true);
    
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateVideo(prompt, {
        duration: 4,
        fps: 24
      });
      setGeneratedVideo(result.url);
    } catch (error) {
      console.error('Video generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!prompt) return;
    setIsLoading(true);
    
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateAudio(prompt, {
        duration: 10,
        type: audioType
      });
      setGeneratedAudio(result.url);
    } catch (error) {
      console.error('Audio generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (url: string | null) => {
    if (!url) return;
    // Paylaşım mantığı eklenecek
  };

  const handleDownload = (url: string | null, filename: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Tabs defaultValue="image" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            {t('workshop.image')}
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <Video className="w-4 h-4" />
            {t('workshop.video')}
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2">
            <Music className="w-4 h-4" />
            {t('workshop.audio')}
          </TabsTrigger>
        </TabsList>

        {/* Resim Oluşturma */}
        <TabsContent value="image" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.prompt')}
              </div>
              
              <Textarea
                placeholder={t('Görsel oluşturmak için bir açıklama yazın...')}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <div className="flex justify-end space-x-2">
                <Button
                  onClick={handleGenerateImage}
                  disabled={isLoading || !prompt}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⚪</span>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Oluştur
                    </>
                  )}
                </Button>
              </div>

              {generatedImage && (
                <div className="mt-4">
                  <img
                    src={generatedImage}
                    alt="Generated artwork"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generatedImage, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      İndir
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.generated')}
              </div>
              
              <div className="aspect-square relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
                {generatedImage ? (
                  <img
                    src={generatedImage}
                    alt="Generated artwork"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {t('workshop.noGeneratedImage')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare(generatedImage)}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedImage}
                >
                  <Share2 className="w-4 h-4" />
                  {t('workshop.share')}
                </Button>
                <Button
                  onClick={() => handleDownload(generatedImage, 'generated-artwork.png')}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedImage}
                >
                  <Download className="w-4 h-4" />
                  {t('workshop.download')}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Video Oluşturma */}
        <TabsContent value="video" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.prompt')}
              </div>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('workshop.videoPromptPlaceholder')}
                className="w-full"
              />

              <Button
                onClick={handleGenerateVideo}
                className="w-full gap-2"
                disabled={!prompt || isLoading}
              >
                <Wand2 className="w-4 h-4" />
                {isLoading ? t('common.loading') : t('workshop.generate')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.generated')}
              </div>
              
              <div className="aspect-video relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
                {generatedVideo ? (
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {t('workshop.noGeneratedVideo')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare(generatedVideo)}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedVideo}
                >
                  <Share2 className="w-4 h-4" />
                  {t('workshop.share')}
                </Button>
                <Button
                  onClick={() => handleDownload(generatedVideo, 'generated-video.mp4')}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedVideo}
                >
                  <Download className="w-4 h-4" />
                  {t('workshop.download')}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Ses Oluşturma */}
        <TabsContent value="audio" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.prompt')}
              </div>

              <Select
                value={audioType}
                onValueChange={(value: 'music' | 'speech') => setAudioType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('workshop.selectAudioType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      {t('workshop.music')}
                    </div>
                  </SelectItem>
                  <SelectItem value="speech">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      {t('workshop.speech')}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('workshop.audioPromptPlaceholder')}
                className="w-full"
              />

              <Button
                onClick={handleGenerateAudio}
                className="w-full gap-2"
                disabled={!prompt || isLoading}
              >
                <Wand2 className="w-4 h-4" />
                {isLoading ? t('common.loading') : t('workshop.generate')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-medium text-white">
                {t('workshop.generated')}
              </div>
              
              <div className="aspect-[3/1] relative rounded-lg overflow-hidden bg-black/50 border border-white/10">
                {generatedAudio ? (
                  <audio
                    src={generatedAudio}
                    controls
                    className="w-full mt-8"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    {t('workshop.noGeneratedAudio')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare(generatedAudio)}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedAudio}
                >
                  <Share2 className="w-4 h-4" />
                  {t('workshop.share')}
                </Button>
                <Button
                  onClick={() => handleDownload(generatedAudio, `generated-${audioType}.mp3`)}
                  variant="outline"
                  className="flex-1 gap-2"
                  disabled={!generatedAudio}
                >
                  <Download className="w-4 h-4" />
                  {t('workshop.download')}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
