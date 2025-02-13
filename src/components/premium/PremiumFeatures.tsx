import { motion } from 'framer-motion';
import { Crown, Star, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Crown,
    title: 'Premium İçerik',
    description: 'Özel sanat eserleri ve koleksiyonlara erişim'
  },
  {
    icon: Star,
    title: 'Öncelikli Destek',
    description: '7/24 özel müşteri desteği'
  },
  {
    icon: Zap,
    title: 'Hızlı Yükleme',
    description: 'Yüksek çözünürlüklü görsel yükleme'
  },
  {
    icon: Shield,
    title: 'Gelişmiş Güvenlik',
    description: 'Ekstra güvenlik özellikleri'
  }
];

export default function PremiumFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-4 p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors"
        >
          <feature.icon className="w-6 h-6 text-primary" />
          <div>
            <h3 className="font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
