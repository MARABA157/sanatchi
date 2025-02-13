import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';

type Creator = Database['public']['Tables']['profiles']['Row'] & {
  artwork_count: number;
  follower_count: number;
};

interface CreatorGridProps {
  creators?: Creator[];
  loading?: boolean;
  limit?: number;
}

export const CreatorGrid = ({ creators: propCreators, loading: propLoading, limit = 12 }: CreatorGridProps) => {
  const [creators, setCreators] = useState<Creator[]>(propCreators || []);
  const [loading, setLoading] = useState(propLoading || !propCreators);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propCreators) {
      void fetchCreators();
    }
  }, [propCreators]);

  useEffect(() => {
    if (propCreators) {
      setCreators(propCreators);
    }
  }, [propCreators]);

  useEffect(() => {
    setLoading(propLoading || false);
  }, [propLoading]);

  const fetchCreators = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .select('*, artworks:artworks(count), followers:followers(count)')
        .order('follower_count', { ascending: false })
        .limit(limit);
      if (error) {
        throw error;
      }
      if (data) {
        setCreators(
          data.map(profile => ({
            ...profile,
            artwork_count: profile.artworks?.[0]?.count || 0,
            follower_count: profile.followers?.[0]?.count || 0,
          }))
        );
      }
    } catch (err) {
      setError('Sanatçılar yüklenirken bir hata oluştu');
      toast({
        title: 'Hata',
        description: 'Sanatçılar yüklenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    void fetchCreators();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Button onClick={handleRetry} className="mt-4">
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {creators.map(creator => (
        <Link
          key={creator.id}
          to={`/profil/${creator.username}`}
          className="block p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
              <AvatarImage src={creator.avatar_url || undefined} alt={creator.full_name || creator.username} />
              <AvatarFallback>{creator.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{creator.full_name || creator.username}</h3>
              <p className="text-sm text-gray-600">@{creator.username}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm text-gray-600">
            <span>{creator.artwork_count} eser</span>
            <span>{creator.follower_count} takipçi</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
