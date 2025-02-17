import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bot, Sparkles, Video, Menu, X, LogIn, UserPlus, Search, Wand2, Crown, Music, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const AI_FEATURES = [
  { name: 'AI Sohbet', href: '/ai/chat' },
  { name: 'Video Oluştur', href: '/ai/video' },
  { name: 'Ses Oluştur', href: '/ai/audio' },
  { name: 'Müzik Oluştur', href: '/ai/music' },
  { name: 'Resim Oluştur', href: '/ai/image' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIMenuOpen, setIsAIMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80 border-violet-500/20' 
          : 'bg-black/70 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                Sanat Galerisi
              </span>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/search">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:text-cyan-400 hover:bg-cyan-500/10">
                <Search className="w-4 h-4" />
                Gelişmiş Arama
              </Button>
            </Link>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="relative h-9 w-full justify-start text-sm font-normal md:w-40 md:font-medium">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <span>AI Araçları</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] p-2">
                  {AI_FEATURES.map((feature) => (
                    <DropdownMenuItem asChild key={feature.href}>
                      <Link to={feature.href} className="flex items-center">
                        <span>{feature.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link to="/premium">
              <Button variant="ghost" size="sm" className="gap-2 text-white hover:text-amber-400 hover:bg-amber-500/10">
                <Crown className="w-4 h-4" />
                Premium
              </Button>
            </Link>

            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="outline" size="sm" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Profilim
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col gap-2">
              <Link to="/search">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Search className="w-4 h-4" />
                  Gelişmiş Arama
                </Button>
              </Link>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="relative h-9 w-full justify-start text-sm font-normal md:w-40 md:font-medium">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>AI Araçları</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] p-2">
                    {AI_FEATURES.map((feature) => (
                      <DropdownMenuItem asChild key={feature.href}>
                        <Link to={feature.href} className="flex items-center">
                          <span>{feature.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link to="/premium">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <Crown className="w-4 h-4" />
                  Premium
                </Button>
              </Link>

              {isAuthenticated ? (
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Sparkles className="w-4 h-4" />
                    Profilim
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <LogIn className="w-4 h-4" />
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <UserPlus className="w-4 h-4" />
                      Kayıt Ol
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}