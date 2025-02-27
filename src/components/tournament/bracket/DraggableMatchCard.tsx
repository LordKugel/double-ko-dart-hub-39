
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
  
  // Debug: Logge Information über dieses Match
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
    canDrag: () => canBeDragged,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ machineId: number }>();
      
      // Debug-Info
      console.log("Drag ended", { 
        item, 
        dropResult, 
        didDrop: monitor.didDrop(),
        monitor_state: {
          isDragging: monitor.isDragging(),
          canDrag: monitor.canDrag(),
          didDrop: monitor.didDrop(),
          getItemType: monitor.getItemType(),
          getItem: monitor.getItem()
        }
      });
      
      if (!monitor.didDrop()) {
        console.log("Match wurde nicht auf einem Automaten abgelegt");
      }
    }
  }), [match.id, isCurrentRound, match.completed, match.machineNumber, canBeDragged]);

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
      />
      
      {/* Debug Badge */}
      {canBeDragged && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 rounded-full">
          Ziehbar
        </div>
      )}
    </div>
  );
};
