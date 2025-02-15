import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Pages
import Home from '@/pages/Home';
import Gallery from '@/pages/Gallery';
import Art from '@/pages/ai/Art';
import Audio from '@/pages/ai/Audio';
import Chat from '@/pages/ai/Chat';
import Video from '@/pages/ai/Video';
import Competitions from '@/pages/Competitions';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Search from '@/pages/Search';
import StyleTransfer from '@/pages/ai/StyleTransfer';
import GenerateArt from '@/pages/ai/Generate';
import VideoGenerate from '@/pages/ai/VideoGenerate';
import ArtistProfile from '@/pages/artist/[id]';
import Premium from '@/pages/Premium';
import AdminDashboard from './pages/admin';

// AI Components
import VideoGenerator from './components/VideoGenerator';
import MusicGenerator from './components/MusicGenerator';
import SpeechGenerator from './components/SpeechGenerator';

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith('/auth');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        {/* Temel Meta Etiketleri */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content="Sanat Galerisi - Sanat eserlerinizi paylaşın ve keşfedin" />
        <title>Sanat Galerisi</title>

        {/* Güvenlik Başlıkları */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        
        {/* Performance Optimizasyonları */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        {/* PWA Desteği */}
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>

      {!isAuthPage && <Header />}
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery/*" element={<Gallery />} />
          <Route path="/ai/art" element={<Art />} />
          <Route path="/ai/audio" element={<Audio />} />
          <Route path="/ai/chat" element={<Chat />} />
          <Route path="/ai/video" element={<Video />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
          <Route path="/ai/style-transfer" element={<StyleTransfer />} />
          <Route path="/ai/generate" element={<GenerateArt />} />
          <Route path="/ai/video-generate" element={<VideoGenerate />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
      <Toaster />
    </>
  );
}

export default App;
