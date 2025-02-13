import crypto from 'crypto';
import { supabase } from './supabase';

export type WebhookEventType = 
  | 'artwork.created' 
  | 'artwork.updated' 
  | 'artwork.deleted'
  | 'user.registered'
  | 'user.updated'
  | 'order.created'
  | 'order.completed'
  | 'payment.succeeded'
  | 'payment.failed';

export interface WebhookConfig {
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  retryCount: number;
  timeout: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WebhookEvent<T = unknown> {
  id: string;
  event: WebhookEventType;
  payload: T;
  timestamp: number;
  signature: string;
  attempt?: number;
  error?: string;
}

interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  eventId: string;
  success: boolean;
  statusCode?: number;
  error?: string;
  attempt: number;
  duration: number;
  timestamp: Date;
}

export class WebhookManager {
  private webhooks: Map<string, WebhookConfig>;
  private readonly defaultRetryCount: number;
  private readonly defaultTimeout: number;
  private readonly maxRetryCount: number;
  private readonly maxTimeout: number;
  private readonly minSecretLength: number;

  constructor(options?: {
    defaultRetryCount?: number;
    defaultTimeout?: number;
    maxRetryCount?: number;
    maxTimeout?: number;
    minSecretLength?: number;
  }) {
    this.webhooks = new Map();
    this.defaultRetryCount = options?.defaultRetryCount ?? 3;
    this.defaultTimeout = options?.defaultTimeout ?? 5000; // 5 saniye
    this.maxRetryCount = options?.maxRetryCount ?? 10;
    this.maxTimeout = options?.maxTimeout ?? 30000; // 30 saniye
    this.minSecretLength = options?.minSecretLength ?? 32;
    this.loadWebhooksFromDB().catch(console.error);
  }

  private validateWebhookConfig(config: Partial<WebhookConfig>): boolean {
    if (!config.url || !this.isValidUrl(config.url)) return false;
    if (!config.secret || config.secret.length < this.minSecretLength) return false;
    if (!Array.isArray(config.events) || config.events.length === 0) return false;
    if (config.timeout && (config.timeout < 1000 || config.timeout > this.maxTimeout)) return false;
    if (config.retryCount && (config.retryCount < 0 || config.retryCount > this.maxRetryCount)) return false;
    
    return true;
  }

  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  }

  private async loadWebhooksFromDB(): Promise<void> {
    try {
      const { data: webhooks, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      webhooks?.forEach(webhook => {
        if (!this.validateWebhookConfig(webhook)) {
          console.warn(`Invalid webhook configuration: ${webhook.id}`);
          return;
        }

        this.webhooks.set(webhook.id, {
          url: webhook.url,
          secret: webhook.secret,
          events: webhook.events,
          isActive: webhook.is_active,
          retryCount: Math.min(webhook.retry_count ?? this.defaultRetryCount, this.maxRetryCount),
          timeout: Math.min(webhook.timeout ?? this.defaultTimeout, this.maxTimeout),
          description: webhook.description,
          createdAt: new Date(webhook.created_at),
          updatedAt: new Date(webhook.updated_at),
        });
      });
    } catch (error) {
      console.error('Error loading webhooks:', error);
      throw new Error('Webhook\'lar yüklenirken bir hata oluştu');
    }
  }

  async addWebhook(config: Omit<WebhookConfig, 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.validateWebhookConfig(config)) {
      throw new Error('Geçersiz webhook yapılandırması');
    }

    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const { error } = await supabase.from('webhooks').insert({
        id,
        url: config.url,
        secret: config.secret,
        events: config.events,
        is_active: config.isActive,
        retry_count: Math.min(config.retryCount ?? this.defaultRetryCount, this.maxRetryCount),
        timeout: Math.min(config.timeout ?? this.defaultTimeout, this.maxTimeout),
        description: config.description,
        created_at: now,
        updated_at: now,
      });

      if (error) throw error;

      this.webhooks.set(id, { ...config, createdAt: new Date(now), updatedAt: new Date(now) });
      return id;
    } catch (error) {
      console.error('Error adding webhook:', error);
      throw new Error('Webhook eklenirken bir hata oluştu');
    }
  }

  async updateWebhook(id: string, config: Partial<WebhookConfig>): Promise<void> {
    const existingWebhook = this.webhooks.get(id);
    if (!existingWebhook) {
      throw new Error('Webhook bulunamadı');
    }

    const updatedConfig = { ...existingWebhook, ...config };
    if (!this.validateWebhookConfig(updatedConfig)) {
      throw new Error('Geçersiz webhook yapılandırması');
    }

    try {
      const { error } = await supabase
        .from('webhooks')
        .update({
          ...config,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      this.webhooks.set(id, updatedConfig);
    } catch (error) {
      console.error('Error updating webhook:', error);
      throw new Error('Webhook güncellenirken bir hata oluştu');
    }
  }

  async deleteWebhook(id: string): Promise<void> {
    if (!this.webhooks.has(id)) {
      throw new Error('Webhook bulunamadı');
    }

    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      this.webhooks.delete(id);
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw new Error('Webhook silinirken bir hata oluştu');
    }
  }

  async dispatchEvent<T>(event: WebhookEventType, payload: T): Promise<void> {
    const webhookEvent: Omit<WebhookEvent<T>, 'signature'> = {
      id: crypto.randomUUID(),
      event,
      payload,
      timestamp: Date.now(),
    };

    const promises = Array.from(this.webhooks.entries())
      .filter(([, config]) => config.isActive && config.events.includes(event))
      .map(([id, config]) => this.sendWebhook(id, config, webhookEvent));

    try {
      const results = await Promise.allSettled(promises);
      
      results.forEach(result => {
        if (result.status === 'rejected') {
          console.error('Webhook dispatch failed:', result.reason);
        }
      });
    } catch (error) {
      console.error('Error dispatching event:', error);
      throw new Error('Event gönderilirken bir hata oluştu');
    }
  }

  private async sendWebhook<T>(
    id: string, 
    config: WebhookConfig, 
    event: Omit<WebhookEvent<T>, 'signature'>
  ): Promise<void> {
    const signature = this.generateSignature(event.payload, config.secret);
    const webhookEvent: WebhookEvent<T> = { ...event, signature };
    
    for (let attempt = 1; attempt <= config.retryCount; attempt++) {
      const startTime = Date.now();
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-ID': id,
            'X-Event-Type': event.event,
            'X-Timestamp': event.timestamp.toString(),
            'X-Signature': signature,
            'X-Attempt': attempt.toString(),
          },
          body: JSON.stringify(webhookEvent),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        await this.logWebhookDelivery({
          id: crypto.randomUUID(),
          webhookId: id,
          eventId: event.id,
          success: response.ok,
          statusCode: response.status,
          attempt,
          duration: Date.now() - startTime,
          timestamp: new Date(),
        });

        if (response.ok) return;

        throw new Error(`HTTP error! status: ${response.status}`);
      } catch (error) {
        const isLastAttempt = attempt === config.retryCount;
        
        await this.logWebhookDelivery({
          id: crypto.randomUUID(),
          webhookId: id,
          eventId: event.id,
          success: false,
          error: error instanceof Error ? error.message : String(error),
          attempt,
          duration: Date.now() - startTime,
          timestamp: new Date(),
        });

        if (isLastAttempt) throw error;

        // Exponential backoff with jitter
        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        const jitter = Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }

  private generateSignature(payload: unknown, secret: string): string {
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  private async logWebhookDelivery(log: WebhookDeliveryLog): Promise<void> {
    try {
      await supabase.from('webhook_logs').insert({
        id: log.id,
        webhook_id: log.webhookId,
        event_id: log.eventId,
        success: log.success,
        status_code: log.statusCode,
        error: log.error,
        attempt: log.attempt,
        duration: log.duration,
        timestamp: log.timestamp.toISOString(),
      });
    } catch (error) {
      console.error('Error logging webhook delivery:', error);
    }
  }

  getWebhooks(): WebhookConfig[] {
    return Array.from(this.webhooks.values());
  }

  getWebhook(id: string): WebhookConfig | undefined {
    return this.webhooks.get(id);
  }
}

export const webhookManager = new WebhookManager();
