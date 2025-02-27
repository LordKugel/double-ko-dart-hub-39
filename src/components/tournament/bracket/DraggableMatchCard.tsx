
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Match as MatchType } from "@/types/tournament";
import { MatchCard } from './MatchCard';
import { toast } from "@/components/ui/use-toast";

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
    end: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        toast({
          title: "Nicht zugewiesen",
          description: "Match wurde nicht auf einen Automaten gezogen",
          variant: "destructive"
        });
      }
    },
  }));

  drag(ref);

  return (
    <div 
      ref={ref} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isCurrentRound && !match.completed && !match.machineNumber ? 'grab' : 'default',
      }}
      className="mb-4"
    >
      <MatchCard
        match={match}
        isCurrentRound={isCurrentRound}
        verticalPosition={verticalPosition}
        previousMatches={previousMatches}
        onScoreUpdate={onScoreUpdate}
      />
    </div>
  );
};
