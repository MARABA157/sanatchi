import React from 'react';
import { Play, RefreshCw } from 'lucide-react';

interface VideoGenerationButtonProps {
  onClick: () => void;
  loading: boolean;
}

export default function VideoGenerationButton({ onClick, loading }: VideoGenerationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
    >
      {loading ? (
        <RefreshCw className="w-5 h-5 animate-spin" />
      ) : (
        <Play className="w-5 h-5" />
      )}
      <span>{loading ? 'AI Video Oluşturuluyor...' : 'AI Video Oluştur'}</span>
    </button>
  );
}