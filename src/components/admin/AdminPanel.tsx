import { motion } from 'framer-motion';
import { Users, Settings, BarChart, FileText } from 'lucide-react';

const adminFeatures = [
  {
    icon: Users,
    title: 'Kullanıcı Yönetimi',
    description: 'Kullanıcıları yönetin ve rolleri düzenleyin'
  },
  {
    icon: Settings,
    title: 'Site Ayarları',
    description: 'Sistem ayarlarını yapılandırın'
  },
  {
    icon: BarChart,
    title: 'İstatistikler',
    description: 'Site istatistiklerini görüntüleyin'
  },
  {
    icon: FileText,
    title: 'İçerik Yönetimi',
    description: 'İçerikleri düzenleyin ve onaylayın'
  }
];

export default function AdminPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {adminFeatures.map((feature, index) => (
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
