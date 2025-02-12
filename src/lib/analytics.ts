import mixpanel from 'mixpanel-browser';
import { supabase } from './supabase';
import { measureAsyncOperation } from './performance';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

if (ANALYTICS_ENABLED && MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
  });
}

interface EventProperties {
  [key: string]: any;
}

export async function trackEvent(
  eventName: string,
  properties: EventProperties = {}
): Promise<void> {
  if (!ANALYTICS_ENABLED) return;

  await measureAsyncOperation('track_event', async () => {
    // Track in Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.track(eventName, properties);
    }

    // Store in Supabase for our own analytics
    const { error } = await supabase.from('analytics_events').insert([
      {
        event: eventName,
        properties,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Error tracking event:', error);
    }
  });
}

export async function identifyUser(
  userId: string,
  traits: Record<string, any> = {}
): Promise<void> {
  if (!ANALYTICS_ENABLED) return;

  await measureAsyncOperation('identify_user', async () => {
    // Identify in Mixpanel
    if (MIXPANEL_TOKEN) {
      mixpanel.identify(userId);
      mixpanel.people.set({
        $userId: userId,
        ...traits,
      });
    }

    // Store in Supabase
    const { error } = await supabase.from('analytics_users').upsert(
      [
        {
          user_id: userId,
          traits,
          last_seen: new Date().toISOString(),
        },
      ],
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Error identifying user:', error);
    }
  });
}

export function resetAnalytics(): void {
  if (MIXPANEL_TOKEN) {
    mixpanel.reset();
  }
}
