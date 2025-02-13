import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Video, Music, MessageSquare, ArrowRight, Sparkles, Bot, Star, Image as ImageIcon, Users, Search, Globe2, Zap, Crown, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "AI Resim",
    description: "Hayal ettiğiniz sanat eserlerini saniyeler içinde oluşturun",
    icon: Wand2,
    gradient: "from-violet-500 to-fuchsia-500",
    textGradient: "from-violet-400 to-fuchsia-400",
    path: "/ai/art",
    examples: [
      "Yağlı boya portre",
      "Modern soyut",
      "Dijital illüstrasyon"
    ]
  },
  {
    title: "AI Video",
    description: "Videolarınızı sanat eserine dönüştürün",
    icon: Video,
    gradient: "from-blue-500 to-cyan-500",
    textGradient: "from-blue-400 to-cyan-400",
    path: "/ai/video",
    examples: [
      "Video stilizasyonu",
      "Animasyon efektleri",
      "Sinematik filtreler"
    ]
  },
  {
    title: "AI Müzik",
    description: "Kendi müzik eserlerinizi yapay zeka ile besteyin",
    icon: Music,
    gradient: "from-emerald-500 to-teal-500",
    textGradient: "from-emerald-400 to-teal-400",
    path: "/ai/audio",
    examples: [
      "Orkestra besteleri",
      "Modern müzik",
      "Film müzikleri"
    ]
  },
  {
    title: "AI Sohbet",
    description: "Sanat asistanınız ile yaratıcı fikirler geliştirin",
    icon: MessageSquare,
    gradient: "from-amber-500 to-orange-500",
    textGradient: "from-amber-400 to-orange-400",
    path: "/ai/chat",
    examples: [
      "Sanat tavsiyeleri",
      "Teknik bilgiler",
      "Sanat tarihi"
    ]
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Arkaplan efektleri */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(100,50,255,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(50,200,255,0.1),transparent_50%)]" />
      
      <div className="container relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
            Yapay Zeka Araçları
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Modern teknoloji ile sanatın sınırlarını zorlayın ve yaratıcılığınızı keşfedin
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index} className="group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-gray-900 border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group-hover:translate-y-[-8px]">
                  <CardContent className="p-6 space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-[-5deg]`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${feature.textGradient}`}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      {feature.examples.map((example, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                          <Sparkles className="w-4 h-4 text-gray-500" />
                          <span>{example}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="ghost" 
                      className={`w-full justify-between bg-gradient-to-r ${feature.gradient} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    >
                      Hemen Dene
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
