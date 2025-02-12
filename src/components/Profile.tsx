import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ImagePlus } from 'lucide-react';
import ProfileHeader from './profile/ProfileHeader';
import ProfileActions from './profile/ProfileActions';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProfileHeader user={user} />
      <ProfileActions />

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Eserlerim</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <ImagePlus className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Henüz eser yüklemediniz</p>
          </div>
        </div>
      </div>
    </div>
  );
}