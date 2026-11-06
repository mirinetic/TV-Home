import React, { useState, useEffect } from 'react';

interface ViewportScalerProps {
  children: React.ReactNode;
}

const ViewportScaler = ({ children }: ViewportScalerProps) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scaleX = width / 1920;
      const scaleY = height / 1080;
      setScale(Math.min(scaleX, scaleY));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden">
      <div 
        style={{ 
          width: '1920px', 
          height: '1080px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0
        }}
        className="relative shadow-[0_0_100px_rgba(0,0,0,0.5)]"
      >
        {children}
      </div>
    </div>
  );
};

export default ViewportScaler;
