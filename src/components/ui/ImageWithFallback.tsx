import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  credit?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '',
  className = '',
  credit
}) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    if (!error && fallbackSrc) {
      setError(true);
    }
  };
  
  return (
    <div className="relative w-full h-full">
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        onError={handleError}
        className={`w-full h-full object-cover ${className}`}
      />
      {credit && !error && (
        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1 max-w-full truncate">
          {credit}
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;