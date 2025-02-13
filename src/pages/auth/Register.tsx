import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, UserPlus, ArrowRight, Loader2, Camera, Sparkles, Palette, Music, PartyPopper } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useDropzone } from 'react-dropzone';
import confetti from 'canvas-confetti';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar?: File;
  favoriteArt?: string;
}

const artStyles = [
  "🎨 Empresyonizm",
  "🖼️ Modern Sanat",
  "📷 Fotoğrafçılık",
  "✏️ Dijital Sanat",
  "🎭 Sokak Sanatı"
];

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    favoriteArt: ''
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFormData(prev => ({ ...prev, avatar: file }));
        const reader = new FileReader();
        reader.onload = (e) => {
          setAvatarPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Hata! 🚫",
        description: "Şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return false;
    }
    if (formData.password.length < 6) {
      toast({
        title: "Hata! 📏",
        description: "Şifre en az 6 karakter olmalıdır.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const nextStep = () => {
    if (currentStep === 2) {
      setShowCelebration(true);
      triggerConfetti();
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      let avatarUrl = null;
      if (formData.avatar) {
        const fileExt = formData.avatar.name.split('.').pop();
        const fileName = `${authData.user?.id}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, formData.avatar);

        if (uploadError) throw uploadError;
        
        avatarUrl = `https://your-supabase-project.supabase.co/storage/v1/object/public/avatars/${fileName}`;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user?.id,
            username: formData.username,
            avatar_url: avatarUrl,
            favorite_art: formData.favoriteArt,
            created_at: new Date().toISOString(),
          }
        ]);

      if (profileError) throw profileError;

      toast({
        title: "Başarılı! 🎉",
        description: "Hoş geldiniz! Sanat dünyasına adım attınız!",
      });

      nextStep();
    } catch (error: any) {
      toast({
        title: "Hata! 😢",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Palette className="w-12 h-12 mx-auto mb-2 text-primary animate-bounce" />
              <h2 className="text-2xl font-bold">Önce Sizi Tanıyalım! 👋</h2>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Yaratıcı bir isim seçin..."
                className="bg-muted/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="sanatci@example.com"
                className="bg-muted/50"
                required
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Music className="w-12 h-12 mx-auto mb-2 text-primary animate-spin-slow" />
              <h2 className="text-2xl font-bold">Güvenliği Unutmayalım! 🔒</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Süper gizli şifreniz..."
                  className="bg-muted/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Bir kez daha..."
                  className="bg-muted/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Sparkles className="w-12 h-12 mx-auto mb-2 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold">Son Dokunuşlar! ✨</h2>
            </div>

            <div className="space-y-2">
              <Label>Profil Fotoğrafı</Label>
              <div
                {...getRootProps()}
                className="relative w-32 h-32 mx-auto cursor-pointer rounded-full overflow-hidden group transition-transform hover:scale-105"
              >
                <input {...getInputProps()} />
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">Fotoğraf Seç</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Favori Sanat Tarzınız</Label>
              <div className="grid grid-cols-1 gap-2">
                {artStyles.map((style, index) => (
                  <motion.button
                    key={style}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData(prev => ({ ...prev, favoriteArt: style }))}
                    className={`p-3 rounded-lg text-left transition-colors ${
                      formData.favoriteArt === style
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {style}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Sol Panel - Dekoratif Alan */}
      <div className="hidden lg:block relative bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: 'url("/images/art-studio.jpg")',
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20" />
        
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white"
            >
              {currentStep === 0 && "Yaratıcı Yolculuğunuz Başlıyor! 🎨"}
              {currentStep === 1 && "Güvenliğiniz Bizim İçin Önemli! 🛡️"}
              {currentStep === 2 && "Son Birkaç Adım Kaldı! 🎉"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-white/80 max-w-md"
            >
              {currentStep === 0 && "Sanat dünyasına adım atmaya hazır mısınız? Size özel bir deneyim için bilgilerinizi paylaşın."}
              {currentStep === 1 && "Güçlü bir şifre ile hesabınızı koruyun. Endişelenmeyin, bilgileriniz bizimle güvende!"}
              {currentStep === 2 && "Profilinizi kişiselleştirin ve sanat topluluğumuzda yerinizi alın!"}
            </motion.p>

            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ArrowRight className="w-8 h-8 text-white mx-auto" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Kayıt Formu */}
      <div className="flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center"
            >
              {currentStep === 0 && <UserPlus className="w-8 h-8 text-white" />}
              {currentStep === 1 && <Eye className="w-8 h-8 text-white" />}
              {currentStep === 2 && <Sparkles className="w-8 h-8 text-white" />}
            </motion.div>

            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2].map((step) => (
                <motion.div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    currentStep === step ? 'bg-primary' : 'bg-muted'
                  }`}
                  animate={{
                    scale: currentStep === step ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: currentStep === step ? Infinity : 0,
                  }}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            <div className="flex justify-between space-x-4">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="w-full"
                >
                  Geri
                </Button>
              )}
              
              <Button
                type={currentStep === 2 ? "submit" : "button"}
                onClick={currentStep < 2 ? nextStep : undefined}
                className="w-full bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : currentStep === 2 ? (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Kayıt Ol
                  </>
                ) : (
                  <>
                    Devam Et
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm space-y-2">
            <div>
              Zaten hesabınız var mı?{' '}
              <Link
                to="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Giriş Yap
              </Link>
            </div>
            <div>
              <Link
                to="/"
                className="font-medium text-primary hover:underline inline-flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
                Anasayfaya Dön
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kutlama Efekti */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-card p-8 rounded-lg text-center"
            >
              <PartyPopper className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-2">Hoş Geldiniz! 🎉</h2>
              <p className="text-muted-foreground">
                Sanat dünyasına hoş geldiniz! Şimdi macera başlıyor...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
