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
  const isGif = animationPath.toLowerCase().endsWith('.gif');

  React.useEffect(() => {
    // Skip loading JSON for GIF files
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

  // If it's a GIF, render as img element
  if (isGif) {
    return (
      <div className={className} style={{ width, height }}>
        <img 
          src={animationPath}
          alt="Avatar"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
