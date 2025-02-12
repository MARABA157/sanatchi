import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Shield, Palette, Image as ImageIcon, Bot, Rocket } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  {
    name: 'Başlangıç',
    price: 'Ücretsiz',
    description: 'Temel özelliklerle başlayın',
    features: [
      'Sınırlı AI kredisi (günlük 3)',
      'Temel arama özellikleri',
      'Standart destek',
      'Reklamlı deneyim'
    ],
    icon: Star,
    popular: false,
    color: 'from-gray-400 to-gray-600'
  },
  {
    name: 'Sanatçı',
    price: '99 ₺/ay',
    description: 'Yeni başlayan sanatçılar için',
    features: [
      'Günlük 50 AI kredisi',
      'Temel stil transferi',
      'HD görsel işleme',
      'Reklamsız deneyim',
      'Email desteği'
    ],
    icon: Palette,
    popular: false,
    color: 'from-cyan-400 to-blue-600'
  },
  {
    name: 'Premium',
    price: '199 ₺/ay',
    description: 'Profesyonel sanatçılar için',
    features: [
      'Günlük 200 AI kredisi',
      'Gelişmiş stil transferi',
      '4K görsel işleme',
      'Öncelikli destek',
      'Sanatçı rozeti',
      'Özel analitik raporları'
    ],
    icon: Crown,
    popular: true,
    color: 'from-violet-400 to-fuchsia-600'
  },
  {
    name: 'Pro',
    price: '399 ₺/ay',
    description: 'Tam zamanlı içerik üreticileri için',
    features: [
      'Sınırsız AI kredisi',
      'Ultra HD görsel işleme',
      'Özel AI modelleri',
      '7/24 öncelikli destek',
      'API erişimi',
      'Özel entegrasyonlar'
    ],
    icon: Rocket,
    popular: false,
    color: 'from-fuchsia-400 to-pink-600'
  },
  {
    name: 'Kurumsal',
    price: 'İletişime geçin',
    description: 'Galeriler ve kurumlar için',
    features: [
      'Tüm Pro özellikleri',
      'Özel AI model eğitimi',
      'Dedicated destek',
      'Çoklu kullanıcı yönetimi',
      'Özel eğitimler',
      'SLA garantisi'
    ],
    icon: Shield,
    popular: false,
    color: 'from-amber-400 to-orange-600'
  }
];

const features = [
  {
    icon: Zap,
    title: 'Yüksek Performans',
    description: 'Ultra hızlı AI görsel işleme'
  },
  {
    icon: Palette,
    title: 'Gelişmiş Stil Transferi',
    description: 'Özel sanat stilleri ve filtreler'
  },
  {
    icon: ImageIcon,
    title: 'Ultra HD Kalite',
    description: '8K çözünürlüğe kadar destek'
  },
  {
    icon: Bot,
    title: 'AI Asistan',
    description: 'Kişiselleştirilmiş sanat tavsiyeleri'
  }
];

export default function Premium() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    toast({
      title: 'Bilgi',
      description: 'Ödeme sistemi yakında eklenecek',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16 px-4"
      >
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
          Premium Üyelik
        </h1>
        <p className="text-xl text-gray-400">
          Sınırsız yaratıcılık ve profesyonel özellikler için Premium'a yükseltin
        </p>
      </motion.div>

      {/* Özellikler */}
      <div className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-gray-900 border-violet-500/20">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 mb-4 text-violet-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Planlar */}
      <div className="container overflow-x-auto pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-[1200px]">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className={`relative h-full bg-gray-900 border-violet-500/20 ${
                plan.popular ? 'ring-2 ring-violet-500' : ''
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-violet-500">
                    En Popüler
                  </Badge>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full mb-4 bg-gradient-to-br ${plan.color} p-2 flex items-center justify-center`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-violet-400 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600' 
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handleSubscribe(plan.name)}
                  >
                    {plan.name === 'Kurumsal' ? 'İletişime Geç' : 'Abone Ol'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mt-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Sıkça Sorulan Sorular</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">Premium üyelik ne zaman başlar?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Ödemeniz onaylandıktan hemen sonra Premium özellikler hesabınızda aktif olur.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">İstediğim zaman iptal edebilir miyim?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Evet, üyeliğinizi dilediğiniz zaman iptal edebilirsiniz. Kalan süre boyunca Premium özellikleri kullanmaya devam edersiniz.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">AI kredileri nasıl çalışır?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Her AI görsel oluşturma işlemi için 1 kredi kullanılır. Kredileriniz her gün üyelik planınıza göre yenilenir.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-violet-500/20">
            <CardHeader>
              <CardTitle className="text-white">Planlar arası geçiş yapabilir miyim?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Evet, dilediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler bir sonraki fatura döneminde geçerli olur.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
