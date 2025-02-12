import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Share2, Heart } from 'lucide-react';

const generatedImages = [
  {
    id: 1,
    title: "Modern Soyut Kompozisyon",
    prompt: "Modern abstract art with vibrant colors and geometric shapes",
    image: "https://images.pexels.com/photos/2693212/pexels-photo-2693212.jpeg",
    likes: 245
  },
  {
    id: 2,
    title: "Dijital Portre",
    prompt: "Digital portrait art with neon lights and cyberpunk style",
    image: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    likes: 189
  },
  {
    id: 3,
    title: "Fantastik Manzara",
    prompt: "Fantasy landscape with floating islands and magical atmosphere",
    image: "https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg",
    likes: 312
  },
  {
    id: 4,
    title: "Minimalist Natürmort",
    prompt: "Minimalist still life with simple shapes and soft lighting",
    image: "https://images.pexels.com/photos/3109807/pexels-photo-3109807.jpeg",
    likes: 167
  },
  {
    id: 5,
    title: "Şehir Manzarası",
    prompt: "Futuristic cityscape with neon lights and hover vehicles",
    image: "https://images.pexels.com/photos/3075665/pexels-photo-3075665.jpeg",
    likes: 278
  },
  {
    id: 6,
    title: "Sürreal Kompozisyon",
    prompt: "Surreal composition with floating objects and dream-like atmosphere",
    image: "https://images.pexels.com/photos/3062948/pexels-photo-3062948.jpeg",
    likes: 234
  }
];

export default function Explore() {
  const [activeTab, setActiveTab] = useState('popular');

  return (
    <div className="min-h-screen bg-black/95 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-3xl -z-10" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            AI Üretilen Eserler
          </h1>
          <p className="text-lg text-white/80 font-medium tracking-wide">
            Yapay zeka ile üretilen en etkileyici sanat eserleri
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === 'popular' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('popular')}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Popüler
          </Button>
          <Button
            variant={activeTab === 'recent' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('recent')}
            className="gap-2"
          >
            En Yeni
          </Button>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedImages.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-white/5">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-white/80 text-sm mb-4">{item.prompt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="text-white/90 hover:text-white transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                        <button className="text-white/90 hover:text-white transition-colors">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button className="flex items-center gap-2 text-white/90 hover:text-white transition-colors">
                        <Heart className="w-5 h-5" />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
