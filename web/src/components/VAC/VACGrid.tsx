import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { VACCard } from './vacData';
import { VACGridItem } from './VACGridItem';

interface VACGridProps {
  gridData: VACCard[][];
  focusSection: string;
  focusCol: number;
  focusRow: number;
  scrollX: number;
  isWireframeMode?: boolean;
  onCardHover: (col: number, row: number) => void;
  onCardClick: (col: number, row: number) => void;
}

export const VACGrid = ({
  gridData,
  focusSection,
  focusCol,
  focusRow,
  scrollX,
  isWireframeMode = false,
  onCardHover,
  onCardClick
}: VACGridProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="absolute top-[270px] bottom-[120px] left-0 right-0 overflow-visible z-20 pointer-events-none"
    >
      <motion.div
        animate={{ x: scrollX }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
        className="flex flex-row gap-12 pl-[80px] h-full items-start pointer-events-auto"
      >
        {gridData.map((col, colIdx) => (
          <div 
            key={colIdx} 
            className="flex flex-col gap-12 h-full justify-start items-center"
          >
            {col.map((item, rowIdx) => {
              const isFocused = focusSection === 'extra' && focusCol === colIdx && focusRow === rowIdx;
              
              return (
                <VACGridItem
                  key={item.id}
                  item={item}
                  isFocused={isFocused}
                  isWireframeMode={isWireframeMode}
                  onMouseEnter={() => onCardHover(colIdx, rowIdx)}
                  onClick={() => onCardClick(colIdx, rowIdx)}
                />
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
