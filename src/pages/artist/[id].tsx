import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Image, 
  Heart, 
  MessageCircle, 
  Share2, 
  Grid, 
  ListFilter,
  Instagram,
  Twitter,
  Globe,
  Mail
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type Artist = Database['public']['Tables']['artists']['Row'];
type Artwork = Database['public']['Tables']['artworks']['Row'];

export default function ArtistProfile() {
  const { id } = useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (!id) return;

    // Sanatçı bilgilerini getir
    const fetchArtist = async () => {
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching artist:', error);
        return;
      }

      setArtist(data);
    };

    // Sanatçının eserlerini getir
    const fetchArtworks = async () => {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('artist_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching artworks:', error);
        return;
      }

      setArtworks(data || []);
    };

    fetchArtist();
    fetchArtworks();
  }, [id]);

  if (!artist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black/95">
      {/* Cover Image */}
      <div className="h-64 md:h-80 relative">
        <img
          src={artist.cover_url || 'https://images.pexels.com/photos/1647116/pexels-photo-1647116.jpeg'}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-black/95">
            <img
              src={artist.avatar_url || 'https://ui-avatars.com/api/?name=' + id}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{artist.user_id}</h1>
            <p className="text-white/80 mb-4 max-w-2xl">{artist.bio}</p>
            
            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{artist.total_views}</div>
                <div className="text-white/60 text-sm">Görüntülenme</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{artist.total_likes}</div>
                <div className="text-white/60 text-sm">Beğeni</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{artworks.length}</div>
                <div className="text-white/60 text-sm">Eser</div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {artist.website && (
                <a href={artist.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon">
                    <Globe className="w-5 h-5" />
                  </Button>
                </a>
              )}
              {artist.social_links && (
                <>
                  {(artist.social_links as any).instagram && (
                    <a href={(artist.social_links as any).instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Instagram className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {(artist.social_links as any).twitter && (
                    <a href={(artist.social_links as any).twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon">
                        <Twitter className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                </>
              )}
              <Button variant="ghost" size="icon">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="gallery" className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="gallery" onClick={() => setActiveTab('gallery')}>
                Galeri
              </TabsTrigger>
              <TabsTrigger value="ai" onClick={() => setActiveTab('ai')}>
                AI Eserleri
              </TabsTrigger>
              <TabsTrigger value="about" onClick={() => setActiveTab('about')}>
                Hakkında
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')}>
                <Grid className={`w-5 h-5 ${viewMode === 'grid' ? 'text-primary' : 'text-white/60'}`} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
                <ListFilter className={`w-5 h-5 ${viewMode === 'list' ? 'text-primary' : 'text-white/60'}`} />
              </Button>
            </div>
          </div>

          <TabsContent value="gallery" className="mt-6">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {artworks.filter(art => !art.ai_generated).map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={viewMode === 'grid' ? 'group relative' : 'flex gap-6 items-center bg-white/5 rounded-xl p-4'}
                >
                  <div className={viewMode === 'grid' ? 'aspect-square rounded-xl overflow-hidden bg-white/5' : 'w-40 h-40 rounded-xl overflow-hidden'}>
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className={viewMode === 'grid' ? 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl' : 'flex-1'}>
                    <div className={viewMode === 'grid' ? 'absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300' : ''}>
                      <h3 className="text-white font-bold text-xl mb-2">{artwork.title}</h3>
                      {artwork.description && (
                        <p className="text-white/80 text-sm mb-4">{artwork.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            <span>{artwork.likes_count}</span>
                          </button>
                          <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>{artwork.comments_count}</span>
                          </button>
                        </div>
                        <button className="text-white/90 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {artworks.filter(art => art.ai_generated).map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={viewMode === 'grid' ? 'group relative' : 'flex gap-6 items-center bg-white/5 rounded-xl p-4'}
                >
                  <div className={viewMode === 'grid' ? 'aspect-square rounded-xl overflow-hidden bg-white/5' : 'w-40 h-40 rounded-xl overflow-hidden'}>
                    <img
                      src={artwork.image_url}
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className={viewMode === 'grid' ? 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl' : 'flex-1'}>
                    <div className={viewMode === 'grid' ? 'absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300' : ''}>
                      <h3 className="text-white font-bold text-xl mb-2">{artwork.title}</h3>
                      {artwork.ai_prompt && (
                        <p className="text-white/80 text-sm mb-2">Prompt: {artwork.ai_prompt}</p>
                      )}
                      {artwork.ai_style && (
                        <p className="text-white/80 text-sm mb-4">Style: {artwork.ai_style}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            <span>{artwork.likes_count}</span>
                          </button>
                          <button className="text-white/90 hover:text-white transition-colors flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <span>{artwork.comments_count}</span>
                          </button>
                        </div>
                        <button className="text-white/90 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="bg-white/5 rounded-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Uzmanlık Alanları</h2>
              <div className="flex flex-wrap gap-2 mb-8">
                {artist.specialties?.map((specialty, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {specialty}
                  </span>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-4">Biyografi</h2>
              <p className="text-white/80 whitespace-pre-line">{artist.bio}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
