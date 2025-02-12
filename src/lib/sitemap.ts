import { supabase } from '@/lib/supabase'
import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

interface SitemapURL {
  url: string
  changefreq?: string
  priority?: number
  lastmod?: string
}

export async function generateSitemap(): Promise<string> {
  try {
    const urls: SitemapURL[] = []

    // Statik sayfalar
    const staticPages = [
      { url: '/', priority: 1.0 },
      { url: '/explore', priority: 0.9 },
      { url: '/about', priority: 0.7 },
      { url: '/contact', priority: 0.6 },
    ]
    urls.push(...staticPages)

    // Eserler
    const { data: artworks } = await supabase
      .from('artworks')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    artworks?.forEach(artwork => {
      urls.push({
        url: `/artwork/${artwork.id}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: artwork.updated_at,
      })
    })

    // Koleksiyonlar
    const { data: collections } = await supabase
      .from('collections')
      .select('id, updated_at')
      .order('updated_at', { ascending: false })

    collections?.forEach(collection => {
      urls.push({
        url: `/collection/${collection.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: collection.updated_at,
      })
    })

    // Kullanıcı profilleri
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username, updated_at')
      .order('updated_at', { ascending: false })

    profiles?.forEach(profile => {
      urls.push({
        url: `/profile/${profile.username}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: profile.updated_at,
      })
    })

    // Sitemap oluştur
    const stream = new SitemapStream({
      hostname: 'https://sanatgalerisi.com',
    })

    return streamToPromise(Readable.from(urls).pipe(stream)).then(data =>
      data.toString()
    )
  } catch (error) {
    console.error('Error generating sitemap:', error)
    throw error
  }
}

// Sitemap'i belirli aralıklarla güncelle
export async function updateSitemap(): Promise<void> {
  try {
    const sitemap = await generateSitemap()
    
    // Sitemap'i dosyaya kaydet
    const fs = require('fs')
    fs.writeFileSync('public/sitemap.xml', sitemap)
    
    console.log('Sitemap updated successfully')
  } catch (error) {
    console.error('Error updating sitemap:', error)
  }
}

// Her gün sitemap'i güncelle
setInterval(updateSitemap, 24 * 60 * 60 * 1000)
