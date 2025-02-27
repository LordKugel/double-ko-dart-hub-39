
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
  onAssignMatch,
  hideScoreControls,
  onMatchClick
}: {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
  hideScoreControls?: boolean;
  onMatchClick?: (matchId: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Ein Match kann gezogen werden, wenn es in der aktuellen Runde ist, nicht abgeschlossen und 
  // keinem Automaten zugewiesen ist
  const canBeDragged = isCurrentRound && !match.completed && !match.machineNumber;
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MATCH',
    item: { matchId: match.id },
    canDrag: canBeDragged,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ machineId: number }>();
      
      if (dropResult && onAssignMatch) {
        onAssignMatch(dropResult.machineId, item.matchId);
      }
    }
  }), [match.id, canBeDragged, onAssignMatch]);

  // Hier verbinden wir die Drag-Funktionalität mit dem DOM-Element
  drag(ref);

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: canBeDragged ? 'grab' : 'default',
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
        hideScoreControls={hideScoreControls}
        onMatchClick={onMatchClick}
      />
    </div>
  );
};
