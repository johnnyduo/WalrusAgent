import React from 'react';
import Lottie from 'lottie-react';

interface LottieAvatarProps {
  animationPath: string;
  width?: number;
  height?: number;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

const LottieAvatar: React.FC<LottieAvatarProps> = ({ 
  animationPath, 
  width = 80, 
  height = 80, 
  className = '',
  loop = true,
  autoplay = true
}) => {
  const [animationData, setAnimationData] = React.useState<any>(null);
  const [error, setError] = React.useState<boolean>(false);
  const [imgError, setImgError] = React.useState<boolean>(false);
  const isGif = animationPath.toLowerCase().includes('.gif') || animationPath.startsWith('http');

  React.useEffect(() => {
    // Skip loading JSON for GIF files or external URLs
    if (isGif) {
      return;
    }

    // Load the Lottie JSON file
    fetch(animationPath)
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(err => {
        console.error('Failed to load Lottie animation:', err);
        setError(true);
      });
  }, [animationPath, isGif]);

  // If it's a GIF or external URL, render as img element
  if (isGif) {
    if (imgError) {
      return (
        <div 
          className={`${className} flex items-center justify-center bg-walrus-teal/10 rounded-lg`}
          style={{ width, height }}
        >
          <span className="text-walrus-teal text-xs">🐋</span>
        </div>
      );
    }
    
    return (
      <div className={className} style={{ width, height, position: 'relative' }}>
        <img 
          src={animationPath}
          alt="Avatar"
          className="rounded-full"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            console.error('Failed to load avatar image:', animationPath);
            setImgError(true);
          }}
          onLoad={() => {
            console.log('Avatar loaded successfully:', animationPath);
          }}
        />
      </div>
    );
  }

  if (error || !animationData) {
    // Fallback to a placeholder or return null
    return (
      <div 
        className={`${className} flex items-center justify-center bg-walrus-teal/10 rounded-full`}
        style={{ width, height }}
      >
        <span className="text-walrus-teal text-xs">⚡</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie 
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieAvatar;
