
import { useRef, useEffect } from 'react';
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
  
  useEffect(() => {
    console.log(`Match ${match.id} drag status:`, {
      isCurrentRound,
      completed: match.completed,
      hasMachine: !!match.machineNumber,
      canBeDragged
    });
  }, [match.id, isCurrentRound, match.completed, match.machineNumber, canBeDragged]);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'MATCH',
    item: { matchId: match.id },
    canDrag: canBeDragged,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ machineId: number }>();
      
      console.log("Drag ended", { 
        item, 
        dropResult, 
        didDrop: monitor.didDrop()
      });
      
      if (dropResult && onAssignMatch) {
        onAssignMatch(dropResult.machineId, item.matchId);
      }
    }
  }), [match.id, canBeDragged, onAssignMatch]);

  // Hier verbinden wir die Drag-Funktionalität mit dem DOM-Element
  drag(ref);

  // Wenn ein Match gezogen werden kann (und angeklickt), dann soll es zu einem Automaten zugewiesen werden
  const handleClick = () => {
    if (isCurrentRound && !match.completed && !match.machineNumber && onMatchClick) {
      onMatchClick(match.id);
    }
  };

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: canBeDragged ? 'grab' : 'default',
      }}
      className="relative"
      onClick={handleClick}
    >
      <MatchCard
        match={match}
        isCurrentRound={isCurrentRound}
        verticalPosition={verticalPosition}
        previousMatches={previousMatches}
        onScoreUpdate={onScoreUpdate}
        machines={machines}
        onAssignMatch={onAssignMatch}
        hideScoreControls={true} // Immer verstecken, da die Punkteeingabe nur im Automaten erfolgen soll
      />
      
      {/* Ziehbar-Badge - nur anzeigen, wenn das Match gezogen werden kann */}
      {canBeDragged && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
          Ziehbar
        </div>
      )}
    </div>
  );
};
