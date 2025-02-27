
import { Match as MatchType } from "@/types/tournament";
import { DraggableMatchCard } from "./DraggableMatchCard";

interface BracketRoundProps {
  round: number;
  matches: MatchType[];
  currentRound: number;
  allMatches: MatchType[];
  onMatchClick?: (matchId: string) => void;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const BracketRound = ({ 
  round, 
  matches, 
  currentRound,
  allMatches,
  onMatchClick,
  onScoreUpdate 
}: BracketRoundProps) => {
  const findPreviousMatches = (match: MatchType) => {
    return allMatches.filter(m => 
      m.round === match.round - 1 && 
      (m.player1.id === match.player1.id || 
       m.player1.id === match.player2.id ||
       m.player2.id === match.player1.id ||
       m.player2.id === match.player2.id)
    );
  };

  return (
    <div 
      className="flex-none relative"
      style={{ width: '280px', minHeight: '400px' }}
    >
      <h3 className="text-sm font-semibold mb-3 text-center text-gray-400">
        Runde {round}
      </h3>
      {matches.map((match, index) => {
        const totalMatches = matches.length;
        const verticalSpacing = totalMatches > 1 ? (100 / (totalMatches - 1)) : 0;
        const verticalPosition = totalMatches > 1 ? index * verticalSpacing : 50;

        return (
          <DraggableMatchCard
            key={match.id}
            match={match}
            isCurrentRound={round === currentRound}
            verticalPosition={verticalPosition}
            previousMatches={findPreviousMatches(match)}
            onScoreUpdate={onScoreUpdate}
          />
        );
      })}
    </div>
  );
};
