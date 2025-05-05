
import React, { useState, useRef, useEffect } from 'react';
import { Move } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DragDropContextProps {
  position: Position;
  onChange: (position: Position) => void;
}

export function DragDropContext({ position, onChange }: DragDropContextProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(position);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Sync with external position changes
  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate position as percentage of container width/height
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    
    setCurrentPosition({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onChange(currentPosition);
    }
  };

  // Calculate the logo position in the preview area
  const logoStyle = {
    left: `${currentPosition.x}%`,
    top: `${currentPosition.y}%`,
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-40 bg-white border rounded-md"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className={`absolute flex items-center justify-center p-1 rounded cursor-move ${isDragging ? 'bg-primary/20' : 'hover:bg-primary/10'}`}
        style={logoStyle}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-1 text-xs bg-white rounded p-1 shadow-sm">
          <Move size={16} /> 
          <span>Logo</span>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
        Brief preview area
      </div>
    </div>
  );
}
