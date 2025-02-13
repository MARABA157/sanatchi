import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Lock, Globe } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { CreateCollectionDialog } from './CreateCollectionDialog'

interface Collection {
  id: string
  name: string
  description: string
  is_public: boolean
  artwork_count: number
  created_at: string
}

interface UserCollectionsProps {
  userId: string
}

export function UserCollections({ userId }: UserCollectionsProps) {
  const { user } = useAuth()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const isOwnProfile = user?.id === userId

  useEffect(() => {
    fetchCollections()
  }, [userId])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCollections(data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array(4).fill(null).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {isOwnProfile && (
        <div className="flex justify-end">
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Koleksiyon
          </Button>
        </div>
      )}

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Henüz koleksiyon yok</h3>
          <p className="text-muted-foreground">
            {isOwnProfile
              ? 'Beğendiğiniz eserleri koleksiyonlara ekleyerek düzenleyebilirsiniz.'
              : 'Bu kullanıcı henüz bir koleksiyon oluşturmamış.'}
          </p>
          {isOwnProfile && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk Koleksiyonunu Oluştur
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {collections.map(collection => (
            <div
              key={collection.id}
              className="group relative bg-card hover:bg-accent rounded-xl p-6 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold group-hover:text-accent-foreground">
                    {collection.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {collection.description}
                  </p>
                </div>
                {collection.is_public ? (
                  <Globe className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {collection.artwork_count} eser
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchCollections}
      />
    </div>
  )
}
