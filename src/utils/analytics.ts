import { environment } from './environment';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private initialized = false;

  init() {
    if (this.initialized) {
      return;
    }

    // Analytics initialization code here
    this.initialized = true;
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized) {
      this.init();
    }

    // Track event code here
    console.log('Analytics event:', event);
  }

  trackPageView(path: string) {
    this.trackEvent({
      name: 'page_view',
      properties: { path },
    });
  }

  trackError(error: Error) {
    this.trackEvent({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
      },
    });
  }

  trackAIGeneration(prompt: string, success: boolean) {
    this.trackEvent({
      name: 'ai_generation',
      properties: {
        prompt,
        success,
      },
    });
  }

  trackImageGeneration(prompt: string, success: boolean) {
    this.trackEvent({
      name: 'image_generation',
      properties: {
        prompt,
        success,
      },
    });
  }

  trackVideoGeneration(prompt: string, success: boolean) {
    this.trackEvent({
      name: 'video_generation',
      properties: {
        prompt,
        success,
      },
    });
  }
}

export const analytics = new Analytics();
