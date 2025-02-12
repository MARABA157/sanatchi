import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Brain, Sparkles, Video, Save, RotateCw } from 'lucide-react';
import { AutoTrainer } from '@/services/ai/AutoTrainer';

interface AIModel {
  id: string;
  name: string;
  type: 'chat' | 'art' | 'video';
  enabled: boolean;
  temperature: number;
  max_tokens: number;
  training_interval: number;
}

export function AISettings() {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('type');

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching AI models:', error);
      toast({
        title: 'Hata',
        description: 'AI modelleri yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('ai_models')
        .upsert(models);

      if (error) throw error;

      toast({
        title: 'Başarılı',
        description: 'AI ayarları kaydedildi.',
      });
    } catch (error) {
      console.error('Error saving AI settings:', error);
      toast({
        title: 'Hata',
        description: 'Ayarlar kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleForceTraining = async () => {
    try {
      const trainer = AutoTrainer.getInstance();
      await trainer.forceTraining();
      
      toast({
        title: 'Başarılı',
        description: 'AI eğitimi başlatıldı.',
      });
    } catch (error) {
      console.error('Error starting AI training:', error);
      toast({
        title: 'Hata',
        description: 'Eğitim başlatılırken bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <Brain className="w-6 h-6 text-fuchsia-500" />;
      case 'art':
        return <Sparkles className="w-6 h-6 text-cyan-500" />;
      case 'video':
        return <Video className="w-6 h-6 text-violet-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Model Ayarları</h2>
          <p className="text-gray-400">
            AI modellerinin davranışlarını ve eğitim ayarlarını yapılandırın
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleForceTraining}
          >
            <RotateCw className="w-4 h-4" />
            Eğitimi Başlat
          </Button>
          <Button 
            className="gap-2"
            onClick={handleSaveSettings}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {models.map((model) => (
          <Card key={model.id} className="p-6 bg-black/50 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {getModelIcon(model.type)}
                <div>
                  <h3 className="font-semibold text-lg text-white">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {model.type === 'chat' && 'Metin Üretimi'}
                    {model.type === 'art' && 'Resim Üretimi'}
                    {model.type === 'video' && 'Video Üretimi'}
                  </p>
                </div>
              </div>
              <Switch
                checked={model.enabled}
                onCheckedChange={(checked) =>
                  setModels(models.map(m =>
                    m.id === model.id ? { ...m, enabled: checked } : m
                  ))
                }
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400">Temperature</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[model.temperature]}
                    onValueChange={(value) =>
                      setModels(models.map(m =>
                        m.id === model.id ? { ...m, temperature: value[0] } : m
                      ))
                    }
                    min={0}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-white w-12">
                    {model.temperature.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Max Tokens</label>
                <Input
                  type="number"
                  value={model.max_tokens}
                  onChange={(e) =>
                    setModels(models.map(m =>
                      m.id === model.id ? { ...m, max_tokens: parseInt(e.target.value) } : m
                    ))
                  }
                  className="bg-black/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400">Eğitim Aralığı (saat)</label>
                <Input
                  type="number"
                  value={model.training_interval}
                  onChange={(e) =>
                    setModels(models.map(m =>
                      m.id === model.id ? { ...m, training_interval: parseInt(e.target.value) } : m
                    ))
                  }
                  className="bg-black/30"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
