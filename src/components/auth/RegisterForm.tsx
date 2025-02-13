import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Kayıt işlemleri burada yapılacak
      toast({
        title: 'Başarılı!',
        description: 'Hesabınız başarıyla oluşturuldu.',
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: 'Hata!',
        description: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Ad Soyad</Label>
          <Input
            id="name"
            name="name"
            placeholder="Ad Soyad"
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Şifre"
            className="bg-white/5 border-white/10 text-white"
            required
          />
        </div>
      </div>

      <Button 
        type="submit"
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600"
        disabled={loading}
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </form>
  );
}