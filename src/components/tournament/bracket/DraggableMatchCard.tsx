
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Match as MatchType } from "@/types/tournament";
import { MatchCard } from './MatchCard';

export const DraggableMatchCard = ({ 
  match, 
  isCurrentRound, 
  verticalPosition,
  previousMatches,
  onScoreUpdate
}: {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MATCH',
    item: { matchId: match.id },
    canDrag: isCurrentRound && !match.completed && !match.machineNumber,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isCurrentRound && !match.completed && !match.machineNumber ? 'grab' : 'default',
      }}
      className="relative"
    >
      <MatchCard
        match={match}
        isCurrentRound={isCurrentRound}
        verticalPosition={verticalPosition}
        previousMatches={previousMatches}
        onScoreUpdate={onScoreUpdate}
      />
      {isCurrentRound && !match.completed && !match.machineNumber && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full p-1 flex items-center justify-center w-6 h-6 shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      )}
    </div>
  );
};
