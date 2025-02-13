import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import {
  Users,
  Image,
  Video,
  Music,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Flag,
  MessageSquare,
  Trash2,
  Edit,
  Search,
  Plus,
  Filter,
  Download,
  Upload
} from 'lucide-react';

// Örnek veriler
const users = [
  { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'Premium', status: 'Aktif' },
  { id: 2, name: 'Mehmet Demir', email: 'mehmet@example.com', role: 'Ücretsiz', status: 'Aktif' },
  { id: 3, name: 'Ayşe Kaya', email: 'ayse@example.com', role: 'Premium', status: 'Askıda' }
];

const stats = [
  { title: 'Toplam Kullanıcı', value: '1,234', icon: Users, change: '+12%' },
  { title: 'Premium Üye', value: '321', icon: Shield, change: '+18%' },
  { title: 'AI Resim', value: '15.4K', icon: Image, change: '+24%' },
  { title: 'AI Video', value: '2.1K', icon: Video, change: '+32%' }
];

const recentActivities = [
  { user: 'Ahmet Yılmaz', action: 'yeni bir resim oluşturdu', time: '2 dakika önce' },
  { user: 'Mehmet Demir', action: 'premium üye oldu', time: '15 dakika önce' },
  { user: 'Ayşe Kaya', action: 'bir video paylaştı', time: '1 saat önce' }
];

const reports = [
  { id: 1, type: 'İçerik', user: 'user123', reason: 'Uygunsuz içerik', status: 'İnceleniyor' },
  { id: 2, type: 'Kullanıcı', user: 'user456', reason: 'Spam', status: 'Çözüldü' }
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAction = (action: string) => {
    toast({
      title: 'Başarılı',
      description: `İşlem başarıyla gerçekleştirildi: ${action}`,
    });
  };

  return (
    <div className="min-h-screen bg-black/95">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Admin Paneli
            </h1>
            <p className="text-white/60">
              Sistem yönetimi ve içerik kontrolü
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-white/60">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                  <span className="text-white/40 text-sm ml-2">geçen aya göre</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white/5 border-white/10">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="content">İçerik Yönetimi</TabsTrigger>
            <TabsTrigger value="reports">Raporlar</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Recent Activity */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Son Aktiviteler</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 text-white/80">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-white/60">{activity.action}</span>
                    <span className="text-white/40 ml-auto">{activity.time}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Yeni Duyuru
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Rapor İndir
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Toplu İçerik Yükle
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Sistem Durumu</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white/80">
                    <span>CPU Kullanımı</span>
                    <span>45%</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Bellek Kullanımı</span>
                    <span>62%</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>Disk Kullanımı</span>
                    <span>78%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">AI Model Durumu</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white/80">
                    <span>Stable Diffusion</span>
                    <span className="text-green-400">Aktif</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>MusicGen</span>
                    <span className="text-green-400">Aktif</span>
                  </div>
                  <div className="flex justify-between items-center text-white/80">
                    <span>VideoGen</span>
                    <span className="text-yellow-400">Bakımda</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            {/* Users Table */}
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  <Input
                    placeholder="Kullanıcı ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-white/5 border-white/10"
                  />
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" /> Filtrele
                  </Button>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Yeni Kullanıcı
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/60">ID</th>
                      <th className="text-left py-3 text-white/60">Ad Soyad</th>
                      <th className="text-left py-3 text-white/60">Email</th>
                      <th className="text-left py-3 text-white/60">Rol</th>
                      <th className="text-left py-3 text-white/60">Durum</th>
                      <th className="text-right py-3 text-white/60">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-white/10">
                        <td className="py-3 text-white/80">#{user.id}</td>
                        <td className="py-3 text-white/80">{user.name}</td>
                        <td className="py-3 text-white/80">{user.email}</td>
                        <td className="py-3">
                          <span className={
                            user.role === 'Premium'
                              ? 'bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-sm'
                              : 'bg-white/20 text-white px-2 py-1 rounded-full text-sm'
                          }>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={
                            user.status === 'Aktif'
                              ? 'bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-sm'
                              : 'bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-sm'
                          }>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleAction('edit')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleAction('delete')}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            {/* Content Management */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Resimler</h3>
                    <p className="text-white/60">Toplam: 15,432</p>
                  </div>
                  <Image className="h-6 w-6 text-white/60" />
                </div>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Tümünü Gör
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Videolar</h3>
                    <p className="text-white/60">Toplam: 2,143</p>
                  </div>
                  <Video className="h-6 w-6 text-white/60" />
                </div>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Tümünü Gör
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Müzikler</h3>
                    <p className="text-white/60">Toplam: 987</p>
                  </div>
                  <Music className="h-6 w-6 text-white/60" />
                </div>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Tümünü Gör
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            {/* Reports */}
            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Raporlar ve Şikayetler</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/60">ID</th>
                      <th className="text-left py-3 text-white/60">Tip</th>
                      <th className="text-left py-3 text-white/60">Kullanıcı</th>
                      <th className="text-left py-3 text-white/60">Sebep</th>
                      <th className="text-left py-3 text-white/60">Durum</th>
                      <th className="text-right py-3 text-white/60">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report.id} className="border-b border-white/10">
                        <td className="py-3 text-white/80">#{report.id}</td>
                        <td className="py-3 text-white/80">{report.type}</td>
                        <td className="py-3 text-white/80">{report.user}</td>
                        <td className="py-3 text-white/80">{report.reason}</td>
                        <td className="py-3">
                          <span className={
                            report.status === 'Çözüldü'
                              ? 'bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-sm'
                              : 'bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full text-sm'
                          }>
                            {report.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleAction('view')}>
                            <Search className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleAction('resolve')}>
                            <Flag className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
