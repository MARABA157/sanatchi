import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, RotateCw } from 'lucide-react';
import { AutoTrainer } from '@/services/ai/AutoTrainer';

interface TrainingMetrics {
  model_type: string;
  accuracy: number;
  loss: number;
  epoch_number: number;
  created_at: string;
}

export function TrainingDashboard() {
  const [metrics, setMetrics] = useState<TrainingMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);

  const fetchMetrics = async () => {
    try {
      const trainer = AutoTrainer.getInstance();
      const data = await trainer.getTrainingStatus();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTraining = async () => {
    try {
      setIsTraining(true);
      const trainer = AutoTrainer.getInstance();
      await trainer.forceTraining();
      await fetchMetrics();
    } catch (error) {
      console.error('Error starting training:', error);
    } finally {
      setIsTraining(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Her dakika güncelle
    return () => clearInterval(interval);
  }, []);

  const getModelIcon = (type: string) => {
    switch (type) {
      case 'chat':
        return <Brain className="w-6 h-6 text-fuchsia-500" />;
      case 'art':
        return <TrendingUp className="w-6 h-6 text-cyan-500" />;
      case 'video':
        return <RotateCw className="w-6 h-6 text-violet-500" />;
      default:
        return null;
    }
  };

  const getModelName = (type: string) => {
    switch (type) {
      case 'chat':
        return 'AI Chat';
      case 'art':
        return 'AI Art';
      case 'video':
        return 'AI Video';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Eğitim Durumu</h2>
        <Button
          onClick={startTraining}
          disabled={isTraining}
          className="gap-2"
        >
          {isTraining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Eğitiliyor...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              Eğitimi Başlat
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.model_type} className="p-6 bg-black/50 border-white/10">
            <div className="flex items-center gap-4 mb-4">
              {getModelIcon(metric.model_type)}
              <div>
                <h3 className="font-semibold text-lg text-white">
                  {getModelName(metric.model_type)}
                </h3>
                <p className="text-sm text-gray-400">
                  Son Eğitim: {new Date(metric.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Doğruluk</span>
                  <span className="text-sm text-white">{(metric.accuracy * 100).toFixed(1)}%</span>
                </div>
                <Progress value={metric.accuracy * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-400">Kayıp</span>
                  <span className="text-sm text-white">{metric.loss.toFixed(3)}</span>
                </div>
                <Progress value={100 - (metric.loss * 100)} className="h-2" />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-400">
                  Epoch: {metric.epoch_number}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
