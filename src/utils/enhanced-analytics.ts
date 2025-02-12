import { supabase } from '@/lib/supabase';

export class Analytics {
  private static instance: Analytics;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  async trackEvent(eventName: string, properties: Record<string, any> = {}) {
    if (!this.userId) return;

    try {
      await supabase.from('analytics_events').insert({
        user_id: this.userId,
        event_name: eventName,
        properties,
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  async trackPageView(path: string) {
    await this.trackEvent('page_view', { path });
  }
}
