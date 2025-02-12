import React from 'react';

interface PlaceholderImageProps {
  text: string;
  width?: number;
  height?: number;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  text,
  width = 800,
  height = 600,
  className = '',
}) => {
  const colors = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-yellow-500 to-red-500',
  ];

  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div
      className={`relative bg-gradient-to-br ${randomColor} rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-semibold">
        {text}
      </div>
    </div>
  );
};

export default PlaceholderImage;
