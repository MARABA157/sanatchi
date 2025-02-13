import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'
import { Image, Video, Heart, Eye, MessageCircle, Award } from 'lucide-react'

interface UserStatsProps {
  userId: string
}

interface Stats {
  totalArtworks: number
  totalLikes: number
  totalViews: number
  totalComments: number
  imageCount: number
  videoCount: number
  activityData: {
    date: string
    artworks: number
    likes: number
    views: number
  }[]
}

export function UserStats({ userId }: UserStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [userId])

  const fetchStats = async () => {
    try {
      setLoading(true)

      // Fetch total artworks and counts by type
      const { data: artworks, error: artworksError } = await supabase
        .from('artworks')
        .select('id, type, likes_count, views_count')
        .eq('user_id', userId)

      if (artworksError) throw artworksError

      // Fetch total comments
      const { count: commentsCount, error: commentsError } = await supabase
        .from('comments')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)

      if (commentsError) throw commentsError

      // Calculate stats
      const stats: Stats = {
        totalArtworks: artworks?.length || 0,
        totalLikes: artworks?.reduce((sum, artwork) => sum + (artwork.likes_count || 0), 0) || 0,
        totalViews: artworks?.reduce((sum, artwork) => sum + (artwork.views_count || 0), 0) || 0,
        totalComments: commentsCount || 0,
        imageCount: artworks?.filter(a => a.type === 'image').length || 0,
        videoCount: artworks?.filter(a => a.type === 'video').length || 0,
        activityData: [], // Will be populated below
      }

      // Fetch activity data for the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: activityData, error: activityError } = await supabase
        .from('artworks')
        .select('created_at, likes_count, views_count')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true })

      if (activityError) throw activityError

      // Process activity data
      const dailyActivity = new Map()
      activityData?.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString()
        const current = dailyActivity.get(date) || { artworks: 0, likes: 0, views: 0 }
        dailyActivity.set(date, {
          artworks: current.artworks + 1,
          likes: current.likes + (item.likes_count || 0),
          views: current.views + (item.views_count || 0),
        })
      })

      stats.activityData = Array.from(dailyActivity.entries()).map(([date, data]) => ({
        date,
        ...data,
      }))

      setStats(stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Image className="w-4 h-4" />
              Resimler
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.imageCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Video className="w-4 h-4" />
              Videolar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.videoCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Beğeniler
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Görüntülenme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.totalViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Yorumlar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4" />
              Toplam Eser
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.totalArtworks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>30 Günlük Aktivite</CardTitle>
          <CardDescription>
            Son 30 gündeki eser, beğeni ve görüntülenme sayıları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="artworks"
                  stroke="#8884d8"
                  name="Eserler"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#82ca9d"
                  name="Beğeniler"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#ffc658"
                  name="Görüntülenme"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
