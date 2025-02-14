import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Download, Share2, Sparkles } from 'lucide-react';
import { OpenSourceAI } from '@/services/ai/OpenSourceAI';

export default function AiVideo() {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt || generating) return;
    
    setGenerating(true);
    setError(null);
    setVideoUrl(null);
    
    try {
      const ai = OpenSourceAI.getInstance();
      const result = await ai.generateVideo(prompt);
      setVideoUrl(result.url);
    } catch (error: any) {
      console.error('Video generation error:', error);
      setError(error.message || 'Video oluşturulurken bir hata oluştu');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!videoUrl) return;
    
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Video indirme hatası:', error);
      setError('Video indirilirken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/video-bg.jpg')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-black/70 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Başlık */}
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
                AI Video Stüdyosu
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Yapay zeka ile metninizi videoya dönüştürün
              </p>
            </div>

            {/* Ana Panel */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sol Panel - Kontroller */}
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <Sparkles className="w-6 h-6 mr-2 text-purple-400" />
                    Video Ayarları
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Açıklama */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Video Açıklaması
                      </label>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Örnek: Güneş batarken sahilde yürüyen bir çift, romantik ve sinematik tarzda..."
                        className="h-32 bg-black/30 border-white/20 text-white placeholder:text-gray-500 resize-none"
                      />
                      <p className="text-xs text-gray-400">
                        İpucu: Detaylı açıklamalar daha iyi sonuç verir. Tarz, renk, kamera açısı gibi detayları ekleyin.
                      </p>
                    </div>

                    {/* Oluştur Butonu */}
                    <Button
                      onClick={handleGenerate}
                      disabled={!prompt || generating}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-lg h-14 shadow-lg shadow-purple-500/30"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Video Oluşturuluyor...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Video Oluştur
                        </>
                      )}
                    </Button>

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sağ Panel - Önizleme */}
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Önizleme
                  </h2>
                  
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/50 mb-4">
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {generating ? (
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                            <p>Video oluşturuluyor...</p>
                            <p className="text-sm text-gray-500 mt-2">Bu işlem birkaç dakika sürebilir</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p>Video burada görüntülenecek</p>
                            <p className="text-sm text-gray-500 mt-2">Detaylı açıklama yazarak başlayın</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {videoUrl && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-black/30 border-white/20 text-white hover:bg-black/50"
                        onClick={handleDownload}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        İndir
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 bg-black/30 border-white/20 text-white hover:bg-black/50"
                        onClick={() => {
                          navigator.clipboard.writeText(videoUrl);
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Linki Kopyala
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
