
import React from 'react';
import { useDrag } from 'react-dnd';
import { MatchCard } from './MatchCard';
import { Match as MatchType, Machine } from "@/types/tournament";

interface DraggableMatchCardProps {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
  hideScoreControls?: boolean;
  onMatchClick?: (matchId: string) => void;
  simplifiedView?: boolean;
  showOnlyCompletedMatches?: boolean;
}

export const DraggableMatchCard = ({ 
  match, 
  isCurrentRound, 
  verticalPosition, 
  previousMatches,
  onScoreUpdate,
  machines,
  onAssignMatch,
  hideScoreControls,
  onMatchClick,
  simplifiedView = false,
  showOnlyCompletedMatches = false
}: DraggableMatchCardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'MATCH',
    item: { matchId: match.id },
    canDrag: isCurrentRound && !match.completed && !match.machineNumber,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  });

  // Wenn wir nur abgeschlossene Matches zeigen sollen und dieses Match nicht abgeschlossen ist
  // und kein Freilos-Spieler darin ist, dann nichts anzeigen
  if (showOnlyCompletedMatches && !match.completed && 
      !match.player1.hasBye && !match.player2.hasBye) {
    return null;
  }

  return (
    <div 
      ref={drag} 
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        cursor: isCurrentRound && !match.completed && !match.machineNumber ? 'grab' : 'default'
      }}
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
        simplifiedView={simplifiedView}
      />
    </div>
  );
};
