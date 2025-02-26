
import { Match as MatchType } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { PlayerInfo } from "./PlayerInfo";

interface MatchCardProps {
  match: MatchType;
  isCurrentRound: boolean;
  verticalPosition: number;
  previousMatches: MatchType[];
  onMatchClick?: (matchId: string) => void;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const MatchCard = ({ 
  match, 
  isCurrentRound, 
  verticalPosition,
  previousMatches,
  onMatchClick,
  onScoreUpdate 
}: MatchCardProps) => {
  const player1Score = match.scores.filter(s => s.player1Won).length;
  const player2Score = match.scores.filter(s => s.player2Won).length;

  const handleScoreUpdate = (index: number, player1Won: boolean) => {
    onScoreUpdate?.(match.id, index, player1Won);
  };

  return (
    <div 
      className={cn(
        "relative bg-gray-800 border border-gray-700 rounded p-4 mb-4 hover:bg-gray-700 transition-colors",
        isCurrentRound && "ring-2 ring-blue-500"
      )}
      onClick={() => {
        if (isCurrentRound && !match.completed && onMatchClick) {
          onMatchClick(match.id);
        }
      }}
    >
      <PlayerInfo
        player={match.player1}
        score={player1Score}
        isWinner={player1Score > player2Score}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={true}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
      />
      <div className="my-2 border-t border-gray-700" />
      <PlayerInfo
        player={match.player2}
        score={player2Score}
        isWinner={player2Score > player1Score}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={false}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
      />
      {match.completed && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Spiel beendet
        </div>
      )}
    </div>
  );
};
