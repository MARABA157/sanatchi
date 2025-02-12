import { supabase } from './supabase'
import { Storage } from '@google-cloud/storage'
import { createGzip } from 'zlib'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

interface BackupConfig {
  bucketName: string
  maxBackups: number
  tables: string[]
  schedule: string // cron expression
}

class BackupManager {
  private storage: Storage
  private config: BackupConfig
  private isRunning: boolean

  constructor(config: BackupConfig) {
    this.storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    })
    this.config = config
    this.isRunning = false

    // Zamanlanmış yedeklemeyi başlat
    this.scheduleBackup()
  }

  // Yedekleme zamanla
  private scheduleBackup(): void {
    const cron = require('node-cron')
    cron.schedule(this.config.schedule, () => {
      this.createBackup()
    })
  }

  // Yedekleme oluştur
  async createBackup(): Promise<string | null> {
    if (this.isRunning) {
      console.log('Backup already in progress')
      return null
    }

    this.isRunning = true
    const timestamp = new Date().toISOString()
    const backupName = `backup-${timestamp}.gz`

    try {
      // Verileri topla
      const data: { [key: string]: any[] } = {}
      for (const table of this.config.tables) {
        const { data: tableData, error } = await supabase
          .from(table)
          .select('*')

        if (error) throw error
        data[table] = tableData || []
      }

      // Veriyi sıkıştır ve yükle
      const bucket = this.storage.bucket(this.config.bucketName)
      const file = bucket.file(backupName)

      const gzip = createGzip()
      const dataStream = Readable.from(JSON.stringify(data))

      await pipeline(
        dataStream,
        gzip,
        file.createWriteStream({
          metadata: {
            contentType: 'application/json',
            contentEncoding: 'gzip',
          },
        })
      )

      // Eski yedeklemeleri temizle
      await this.cleanOldBackups()

      // Yedekleme logla
      await this.logBackup(backupName, true)

      return backupName
    } catch (error) {
      console.error('Backup failed:', error)
      await this.logBackup(backupName, false, error)
      return null
    } finally {
      this.isRunning = false
    }
  }

  // Yedeklemeyi geri yükle
  async restoreBackup(backupName: string): Promise<boolean> {
    try {
      const bucket = this.storage.bucket(this.config.bucketName)
      const file = bucket.file(backupName)

      // Dosyayı indir ve çöz
      const [data] = await file.download()
      const decompressed = await new Promise<string>((resolve, reject) => {
        const gunzip = require('zlib').gunzip
        gunzip(data, (err: Error | null, result: Buffer) => {
          if (err) reject(err)
          else resolve(result.toString())
        })
      })

      const backupData = JSON.parse(decompressed)

      // Verileri geri yükle
      for (const [table, records] of Object.entries<any[]>(backupData)) {
        // Mevcut verileri temizle
        await supabase.from(table).delete().neq('id', 0)

        // Yeni verileri ekle
        for (let i = 0; i < records.length; i += 1000) {
          const batch = records.slice(i, i + 1000)
          const { error } = await supabase.from(table).insert(batch)
          if (error) throw error
        }
      }

      await this.logRestore(backupName, true)
      return true
    } catch (error) {
      console.error('Restore failed:', error)
      await this.logRestore(backupName, false, error)
      return false
    }
  }

  // Eski yedeklemeleri temizle
  private async cleanOldBackups(): Promise<void> {
    const [files] = await this.storage
      .bucket(this.config.bucketName)
      .getFiles()

    const backups = files
      .filter(file => file.name.startsWith('backup-'))
      .sort((a, b) => {
        const aTime = new Date(a.name.split('-')[1].split('.')[0]).getTime()
        const bTime = new Date(b.name.split('-')[1].split('.')[0]).getTime()
        return bTime - aTime
      })

    if (backups.length > this.config.maxBackups) {
      const toDelete = backups.slice(this.config.maxBackups)
      for (const file of toDelete) {
        await file.delete()
      }
    }
  }

  // Yedekleme işlemini logla
  private async logBackup(
    backupName: string,
    success: boolean,
    error?: any
  ): Promise<void> {
    await supabase.from('backup_logs').insert({
      backup_name: backupName,
      operation: 'backup',
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    })
  }

  // Geri yükleme işlemini logla
  private async logRestore(
    backupName: string,
    success: boolean,
    error?: any
  ): Promise<void> {
    await supabase.from('backup_logs').insert({
      backup_name: backupName,
      operation: 'restore',
      success,
      error: error ? error.message : null,
      timestamp: new Date().toISOString(),
    })
  }

  // Yedekleme listesini getir
  async listBackups(): Promise<string[]> {
    const [files] = await this.storage
      .bucket(this.config.bucketName)
      .getFiles()

    return files
      .filter(file => file.name.startsWith('backup-'))
      .map(file => file.name)
  }

  // Yedekleme loglarını getir
  async getBackupLogs(limit = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('backup_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  }
}

// Örnek kullanım:
/*
const backupManager = new BackupManager({
  bucketName: 'your-backup-bucket',
  maxBackups: 7, // Son 7 yedeklemeyi tut
  tables: ['artworks', 'collections', 'profiles', 'comments'],
  schedule: '0 0 * * *', // Her gün gece yarısı
})

// Manuel yedekleme
await backupManager.createBackup()

// Yedeklemeyi geri yükle
await backupManager.restoreBackup('backup-2025-01-22T00:00:00.000Z.gz')

// Yedekleme listesi
const backups = await backupManager.listBackups()

// Yedekleme logları
const logs = await backupManager.getBackupLogs()
*/

export const backupManager = new BackupManager({
  bucketName: process.env.BACKUP_BUCKET_NAME || 'sanat-galerisi-backups',
  maxBackups: 7,
  tables: [
    'artworks',
    'collections',
    'profiles',
    'comments',
    'likes',
    'follows',
    'reports',
    'webhooks',
    'settings',
  ],
  schedule: '0 0 * * *', // Her gün gece yarısı
})
