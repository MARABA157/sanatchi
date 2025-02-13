import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Gallery from '@/pages/gallery';
import AiArt from '@/pages/AiArt';
import AiChat from '@/pages/AiChat';
import AiVideo from '@/pages/AiVideo';
import Competitions from '@/pages/Competitions';
import Premium from '@/pages/Premium';
import { Header } from '@/components/Header';
import ArtEnhancement from '@/pages/ai/ArtEnhancement';
import AdvancedSearch from '@/components/search/AdvancedSearch';
import MusicPage from '@/pages/ai/music';

export function AppRoutes() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery/*" element={<Gallery />} />
        <Route path="/ai-art" element={<AiArt />} />
        <Route path="/ai-chat" element={<AiChat />} />
        <Route path="/ai-video" element={<AiVideo />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/ai/enhancement" element={<ArtEnhancement />} />
        <Route path="/search" element={<AdvancedSearch />} />
        <Route path="/ai/music" element={<MusicPage />} />
      </Routes>
    </>
  );
}
