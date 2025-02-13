import React from 'react';
import { Facebook, Twitter, Link } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, className }) => {
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Share on Facebook"
      >
        <Facebook size={20} />
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </button>
      <button
        onClick={() => handleShare('copy')}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Copy link"
      >
        <Link size={20} />
      </button>
    </div>
  );
};

export default ShareButtons;
