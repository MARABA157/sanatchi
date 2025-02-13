import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import cn from 'classnames';

const navigation = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Eserler', href: '/admin/artworks' },
  { name: 'Koleksiyonlar', href: '/admin/collections' },
  { name: 'Kullanıcılar', href: '/admin/users' },
  { name: 'Raporlar', href: '/admin/reports' },
  { name: 'Ayarlar', href: '/admin/settings' },
];

export function Sidebar() {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-black/95 border-r border-white/10 transition-transform",
        "lg:translate-x-0"
      )}
    >
      <div className="p-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
