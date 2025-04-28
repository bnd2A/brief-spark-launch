
import React from 'react';
import BriefCard from './BriefCard';
import { BriefWithStats } from '@/hooks/useBriefs';

interface BriefsGridProps {
  briefs: BriefWithStats[];
}

const BriefsGrid: React.FC<BriefsGridProps> = ({ briefs }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {briefs.map((brief) => (
        <BriefCard key={brief.id} brief={brief} />
      ))}
    </div>
  );
};

export default BriefsGrid;
