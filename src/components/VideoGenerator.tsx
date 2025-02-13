// src/components/VideoGenerator.tsx
import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { 
  generateVideo, 
  checkVideoProgress,
  deleteVideo,
  type VideoGenerationParams,
  type VideoGenerationResult
} from '@/services/videoGeneration';

const STYLES = [
  { value: 'realistic', label: 'Gerçekçi' },
  { value: '3d', label: '3D' },
  { value: 'anime', label: 'Anime' },
  { value: 'cartoon', label: 'Karikatür' }
] as const;

const RESOLUTIONS = [
  { value: '480p', label: '480p' },
  { value: '720p', label: '720p' },
  { value: '1080p', label: '1080p' }
] as const;

const DURATIONS = [
  { value: 15, label: '15 saniye' },
  { value: 30, label: '30 saniye' },
  { value: 60, label: '1 dakika' }
] as const;

export const VideoGenerator = () => {
  const { user } = useUser();
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<VideoGenerationParams['style']>('realistic');
  const [duration, setDuration] = useState<number>(15);
  const [resolution, setResolution] = useState<VideoGenerationParams['resolution']>('720p');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<VideoGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (generationResult?.status === 'pending' || generationResult?.status === 'processing') {
      interval = setInterval(async () => {
        try {
          const result = await checkVideoProgress(generationResult.id);
          setGenerationResult(result);

          if (result.status === 'completed' || result.status === 'failed') {
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Video ilerleme kontrolü başarısız:', err);
          clearInterval(interval);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [generationResult?.id, generationResult?.status]);

  if (!user) {
    return <LoginPrompt 
      onSuccess={() => window.location.reload()} 
      message="Video oluşturmak için lütfen giriş yapın."
    />;
  }

  if (!user.profile.is_premium) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Premium Özellik</h2>
        <p className="text-gray-600 mb-4">Bu özelliği kullanmak için premium üye olmalısınız.</p>
        <a 
          href="/premium" 
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
        >
          Premium'a Yükselt
        </a>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      const params: VideoGenerationParams = {
        userId: user.id,
        prompt,
        style,
        duration,
        resolution
      };

      const result = await generateVideo(params);
      setGenerationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video oluşturma başarısız oldu.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (!generationResult) return;
    
    try {
      await deleteVideo(generationResult.id);
      setGenerationResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video silme başarısız oldu.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Video Oluşturucu</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Video Açıklaması
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
            required
            minLength={10}
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700">
            Stil
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value as VideoGenerationParams['style'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {STYLES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Süre
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {DURATIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="resolution" className="block text-sm font-medium text-gray-700">
            Çözünürlük
          </label>
          <select
            id="resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value as VideoGenerationParams['resolution'])}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {RESOLUTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Video Oluşturuluyor...</span>
            </div>
          ) : (
            'Video Oluştur'
          )}
        </button>
      </form>

      {generationResult && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Video Durumu</h3>
          
          <div className="space-y-4">
            <div>
              <span className="font-medium">Durum: </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                generationResult.status === 'completed' ? 'bg-green-100 text-green-800' :
                generationResult.status === 'failed' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {generationResult.status === 'completed' ? 'Tamamlandı' :
                 generationResult.status === 'failed' ? 'Başarısız' :
                 generationResult.status === 'processing' ? 'İşleniyor' : 'Bekliyor'}
              </span>
            </div>

            {generationResult.url && (
              <div>
                <video
                  src={generationResult.url}
                  controls
                  className="w-full rounded-lg"
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>
            )}

            {generationResult.error && (
              <div className="text-red-500 text-sm">
                Hata: {generationResult.error}
              </div>
            )}

            {generationResult.status === 'completed' && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Videoyu Sil
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
