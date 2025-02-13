import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { Users, Image, Video, MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalContent: number;
  totalAiGenerated: {
    images: number;
    videos: number;
    chats: number;
  };
  popularContent: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState('today');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Kullanıcı istatistikleri
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, last_seen', { count: 'exact' });

      if (userError) throw userError;

      // İçerik istatistikleri
      const { data: contentData, error: contentError } = await supabase
        .from('contents')
        .select('id, type', { count: 'exact' });

      if (contentError) throw contentError;

      // AI üretim istatistikleri
      const { data: aiData, error: aiError } = await supabase
        .from('ai_generations')
        .select('type', { count: 'exact' });

      if (aiError) throw aiError;

      // Popüler içerik
      const { data: popularData, error: popularError } = await supabase
        .from('contents')
        .select('id, title, type, views')
        .order('views', { ascending: false })
        .limit(5);

      if (popularError) throw popularError;

      // Son aktiviteler
      const { data: activityData, error: activityError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;

      setAnalytics({
        totalUsers: userData?.length || 0,
        activeUsers: userData?.filter(u => 
          new Date(u.last_seen) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length || 0,
        totalContent: contentData?.length || 0,
        totalAiGenerated: {
          images: aiData?.filter(a => a.type === 'image').length || 0,
          videos: aiData?.filter(a => a.type === 'video').length || 0,
          chats: aiData?.filter(a => a.type === 'chat').length || 0,
        },
        popularContent: popularData || [],
        recentActivity: activityData || [],
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Hata',
        description: 'Analitik veriler yüklenirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-white">Platform Analitiği</h2>
          <p className="text-gray-400">
            Kullanıcı aktiviteleri ve içerik istatistikleri
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Bugün</SelectItem>
            <SelectItem value="week">Bu Hafta</SelectItem>
            <SelectItem value="month">Bu Ay</SelectItem>
            <SelectItem value="year">Bu Yıl</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-4">
            <Users className="w-8 h-8 text-violet-500" />
            <div>
              <p className="text-sm text-gray-400">Toplam Kullanıcı</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalUsers}
              </h3>
              <p className="text-sm text-gray-400">
                {analytics?.activeUsers} aktif
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-4">
            <Image className="w-8 h-8 text-cyan-500" />
            <div>
              <p className="text-sm text-gray-400">AI Resim</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalAiGenerated.images}
              </h3>
              <p className="text-sm text-gray-400">üretildi</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-4">
            <Video className="w-8 h-8 text-fuchsia-500" />
            <div>
              <p className="text-sm text-gray-400">AI Video</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalAiGenerated.videos}
              </h3>
              <p className="text-sm text-gray-400">üretildi</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-4">
            <MessageSquare className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm text-gray-400">AI Chat</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalAiGenerated.chats}
              </h3>
              <p className="text-sm text-gray-400">konuşma</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Popüler İçerik ve Son Aktiviteler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-semibold text-white">
              Popüler İçerik
            </h3>
          </div>
          <div className="space-y-4">
            {analytics?.popularContent.map((content) => (
              <div
                key={content.id}
                className="flex items-center justify-between py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  {content.type === 'image' && <Image className="w-4 h-4" />}
                  {content.type === 'video' && <Video className="w-4 h-4" />}
                  {content.type === 'post' && <MessageSquare className="w-4 h-4" />}
                  <span className="text-white">{content.title}</span>
                </div>
                <span className="text-gray-400">{content.views} görüntülenme</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/50 border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-semibold text-white">
              Son Aktiviteler
            </h3>
          </div>
          <div className="space-y-4">
            {analytics?.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-white/5"
              >
                <div className="flex items-center gap-3">
                  {activity.type === 'user' && <Users className="w-4 h-4" />}
                  {activity.type === 'content' && <Image className="w-4 h-4" />}
                  {activity.type === 'ai' && <Brain className="w-4 h-4" />}
                  <div>
                    <p className="text-white">{activity.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
