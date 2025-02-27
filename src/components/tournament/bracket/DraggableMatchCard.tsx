
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Match as MatchType, Machine } from "@/types/tournament";
import { MatchCard } from './MatchCard';

export const DraggableMatchCard = ({ 
  match, 
  isCurrentRound, 
  verticalPosition,
  previousMatches,
  onScoreUpdate,
  machines,
  onAssignMatch
}: {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Hier ist die korrekte Verwendung von useDrag mit item als Funktion
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MATCH',
    item: { matchId: match.id },
    canDrag: isCurrentRound && !match.completed && !match.machineNumber,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [match.id, isCurrentRound, match.completed, match.machineNumber]);

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
        machines={machines}
        onAssignMatch={onAssignMatch}
      />
    </div>
  );
};
