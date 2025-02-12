import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AIArtSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-8 text-white"
    >
      <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">AI Destekli Sanat Üretimi</h2>
          <p className="text-lg opacity-90">
            Yapay zeka teknolojileri ile hayalinizdeki sanat eserlerini kolayca
            oluşturun. Metin, görsel veya ses ile başlayın, AI size yardımcı olsun.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="secondary" size="lg">
              <Link to="/resim-olustur">
                <Sparkles className="mr-2 h-4 w-4" />
                Resim Oluştur
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/video-olustur">
                <Sparkles className="mr-2 h-4 w-4" />
                Video Oluştur
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="overflow-hidden bg-white/10 backdrop-blur">
            <img
              src="/images/ai-art-1.jpg"
              alt="AI Sanat Örneği 1"
              className="aspect-square w-full object-cover"
            />
          </Card>
          <Card className="overflow-hidden bg-white/10 backdrop-blur">
            <img
              src="/images/ai-art-2.jpg"
              alt="AI Sanat Örneği 2"
              className="aspect-square w-full object-cover"
            />
          </Card>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </motion.section>
  );
}
