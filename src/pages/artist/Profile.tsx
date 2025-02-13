import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Image, Users, Mail, MapPin, Link as LinkIcon, Edit, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Exhibition {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface Workshop {
  id: string;
  title: string;
  date: string;
  capacity: number;
  price: number;
  description: string;
}

interface ArtistProfile {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  followers: number;
  following: number;
  exhibitions: Exhibition[];
  workshops: Workshop[];
}

export default function ArtistProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast({
        title: 'Hata',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    // Follow logic will be implemented
    toast({
      title: 'Başarılı',
      description: 'Sanatçıyı takip etmeye başladınız',
    });
  };

  const handleMessage = () => {
    // Message logic will be implemented
    toast({
      title: 'Bilgi',
      description: 'Mesajlaşma özelliği yakında eklenecek',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <div className="bg-card rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback>{profile?.fullName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold">{profile?.fullName}</h1>
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {profile?.location}
              </div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                <a href={profile?.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {profile?.website}
                </a>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{profile?.followers}</span> Takipçi
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{profile?.following}</span> Takip Edilen
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleFollow}>Takip Et</Button>
              <Button variant="outline" onClick={handleMessage}>
                <Mail className="w-4 h-4 mr-2" />
                Mesaj Gönder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs defaultValue="portfolio">
        <TabsList className="mb-8">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="exhibitions">Sergiler</TabsTrigger>
          <TabsTrigger value="workshops">Atölyeler</TabsTrigger>
          <TabsTrigger value="about">Hakkında</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio items will be mapped here */}
            <Button variant="outline" className="h-48 flex flex-col items-center justify-center">
              <Plus className="w-8 h-8 mb-2" />
              Yeni Eser Ekle
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="exhibitions" className="space-y-8">
          <div className="grid gap-6">
            {profile?.exhibitions.map((exhibition) => (
              <div key={exhibition.id} className="bg-card rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{exhibition.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {exhibition.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {exhibition.location}
                      </div>
                    </div>
                    <p className="mt-4">{exhibition.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-8">
          <div className="grid gap-6">
            {profile?.workshops.map((workshop) => (
              <div key={workshop.id} className="bg-card rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {workshop.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {workshop.capacity} Kişi
                      </div>
                    </div>
                    <p className="mt-4">{workshop.description}</p>
                    <div className="mt-4">
                      <Button>Katıl ({workshop.price} TL)</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="space-y-8">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Biyografi</h3>
            <p className="text-muted-foreground">{profile?.bio}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
