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
    <div className="w-screen h-screen bg-black flex items-center justify-center overflow-hidden" onScroll={e => { const el = e.currentTarget; if (el.scrollTop || el.scrollLeft) { el.scrollTop = 0; el.scrollLeft = 0; } }}>
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

/**
 * An overlay drawn at the same 1920x1080 scale as the screen (for the simulator panel, power screen
 * and virtual remote, which sit outside the screen frame). Only its children take clicks.
 */
export const ScaledLayer = ({ children }: ViewportScalerProps) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        style={{ width: '1920px', height: '1080px', transform: `scale(${scale})`, transformOrigin: 'center center', flexShrink: 0 }}
        className="relative [&>*]:pointer-events-auto"
      >
        {children}
      </div>
    </div>
  );
};
