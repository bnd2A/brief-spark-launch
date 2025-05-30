
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
    // Update parent component with new position while dragging
    onChange({ x, y });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Add touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    
    // Calculate position as percentage of container width/height
    const x = Math.min(100, Math.max(0, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((touch.clientY - rect.top) / rect.height) * 100));
    
    setCurrentPosition({ x, y });
    // Update parent component with new position while dragging
    onChange({ x, y });
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Calculate the logo position in the preview area
  const logoStyle: React.CSSProperties = {
    left: `${currentPosition.x}%`,
    top: `${currentPosition.y}%`,
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    zIndex: 10,
    touchAction: 'none'
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-40 bg-white border rounded-md overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`absolute flex items-center justify-center p-1 rounded cursor-move ${
          isDragging ? 'bg-primary/20' : 'hover:bg-primary/10'
        }`}
        style={logoStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="flex items-center gap-1 text-xs bg-white rounded p-1 shadow-sm border">
          <Move size={16} /> 
          <span>Logo</span>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center flex-col text-muted-foreground">
        <div className="w-full h-3/4 border-b border-dashed border-gray-300"></div>
        <div className="text-xs mt-2">Click and drag to position logo</div>
      </div>
    </div>
  );
}
