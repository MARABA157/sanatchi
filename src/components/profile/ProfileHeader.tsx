import React from 'react';
import { User } from '@supabase/supabase-js';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-purple-600">
            {user.user_metadata.username?.[0]?.toUpperCase() ?? user.email?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.user_metadata.username ?? 'Kullanıcı'}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
}