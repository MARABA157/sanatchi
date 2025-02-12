import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Sanat Dünyasına Hoş Geldiniz
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Dijital sanat galerisi ile sanatçıları ve koleksiyonerleri buluşturuyoruz.
              Eserlerinizi sergileyin, keşfedin ve satın alın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => navigate('/gallery')}
              >
                Galeriyi Keşfet
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/auth/register')}
              >
                Üye Ol
              </Button>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 aspect-square bg-gradient-to-tr from-primary to-primary/50 rounded-lg shadow-2xl transform rotate-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}