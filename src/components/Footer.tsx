import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Palette, Sparkles, Heart } from 'lucide-react';

const footerLinks = {
  features: [
    { name: 'Sanat Asistanı', href: '/ai/chat', icon: Sparkles },
    { name: 'AI ile Sanat', href: '/ai/art', icon: Palette },
    { name: 'AI Video', href: '/ai/video', icon: Youtube },
    { name: 'Galeri', href: '/gallery', icon: Heart },
  ],
  about: [
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
    { name: 'Blog', href: '/blog' },
  ],
  legal: [
    { name: 'Gizlilik Politikası', href: '/privacy' },
    { name: 'Kullanım Şartları', href: '/terms' },
    { name: 'KVKK', href: '/gdpr' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'Youtube', href: '#', icon: Youtube },
];

export function Footer() {
  return (
    <footer className="bg-black text-white border-t border-violet-500/20">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
              Sanat Galerisi
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sanatın ve yapay zekanın buluştuğu büyülü dünya.
              Modern teknoloji ile sanatı yeniden keşfedin.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-violet-400">Özellikler</h3>
            <ul className="space-y-4">
              {footerLinks.features.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-violet-400 transition-colors flex items-center gap-2 group"
                  >
                    {link.icon && <link.icon className="w-4 h-4 group-hover:text-fuchsia-400" />}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-fuchsia-400">Hakkımızda</h3>
            <ul className="space-y-4">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-fuchsia-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-cyan-400">Yasal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-violet-500/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400">
              {new Date().getFullYear()} Sanat Galerisi. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors transform hover:scale-110"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <link.icon className="w-5 h-5" />
                  <span className="sr-only">{link.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
