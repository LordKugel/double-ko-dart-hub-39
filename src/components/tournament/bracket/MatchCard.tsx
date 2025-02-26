
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
        "relative bg-[#221F26] border-[#403E43] border rounded-lg p-3 shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer",
        isCurrentRound && "ring-2 ring-[#0FA0CE] bg-[#2A2731]",
        match.completed && "opacity-90"
      )}
      style={{ 
        maxWidth: '280px',
        marginTop: `${verticalPosition}%`,
        transform: 'translateY(-50%)',
      }}
      onClick={() => {
        if (isCurrentRound && !match.completed && onMatchClick) {
          onMatchClick(match.id);
        }
      }}
    >
      {/* Verbindungslinien zu vorherigen Matches */}
      {previousMatches.map((prevMatch) => {
        const isPlayer1FromPrevMatch = 
          prevMatch.player1.id === match.player1.id || 
          prevMatch.player1.id === match.player2.id;
        
        const isWinnerFromPrevMatch = 
          (prevMatch.scores.filter(s => s.player1Won).length > prevMatch.scores.filter(s => s.player2Won).length && isPlayer1FromPrevMatch) ||
          (prevMatch.scores.filter(s => s.player2Won).length > prevMatch.scores.filter(s => s.player1Won).length && !isPlayer1FromPrevMatch);

        return (
          <div
            key={`line-${match.id}-${prevMatch.id}`}
            className={cn(
              "absolute w-6 h-[2px] left-[-24px] top-1/2",
              isWinnerFromPrevMatch ? "bg-[#0FA0CE]" : "bg-red-500"
            )}
            style={{
              transform: 'translateY(-50%)',
            }}
          />
        );
      })}

      <div className="space-y-2">
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
      </div>

      {match.completed && (
        <div className="mt-2 pt-2 border-t border-[#403E43] text-xs text-gray-400 text-center">
          Spiel beendet
        </div>
      )}
    </div>
  );
};
