import React from 'react';
import { ImagePlus, Settings } from 'lucide-react';

export default function ProfileActions() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <button className="flex items-center justify-center space-x-2 bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition duration-200">
        <ImagePlus size={20} />
        <span>Yeni Eser Yükle</span>
      </button>
      <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 p-4 rounded-lg hover:bg-gray-200 transition duration-200">
        <Settings size={20} />
        <span>Profil Ayarları</span>
      </button>
    </div>
  );
}