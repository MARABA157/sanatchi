interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
}

class SocialMediaService {
  async shareToTwitter({ title, text, url }: ShareOptions): Promise<void> {
    const tweetText = encodeURIComponent(`${text || title || ''} ${url}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  }

  async shareToFacebook({ url }: ShareOptions): Promise<void> {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  }

  async shareToLinkedIn({ url, title }: ShareOptions): Promise<void> {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`,
      '_blank'
    );
  }

  async shareToWhatsApp({ text, url }: ShareOptions): Promise<void> {
    const shareText = encodeURIComponent(`${text || ''} ${url}`);
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  }

  async shareNative(options: ShareOptions): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: options.title,
          text: options.text,
          url: options.url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      console.warn('Web Share API not supported');
    }
  }
}

export const socialMediaService = new SocialMediaService();
