
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

  // Bestimme die Farben basierend auf dem Bracket
  const getBracketColors = () => {
    switch(match.bracket) {
      case "winners":
        return "bg-[#0e1627] border-[#0FA0CE]/30 hover:border-[#0FA0CE]";
      case "losers":
        return "bg-[#1c1018] border-red-900/30 hover:border-red-500";
      case "final":
        return "bg-[#1e173a] border-[#8B5CF6]/30 hover:border-[#8B5CF6]";
      default:
        return "bg-gray-800 border-gray-700";
    }
  };

  return (
    <div 
      className={cn(
        "relative border rounded p-2 transition-colors",
        getBracketColors(),
        isCurrentRound && "ring-1 ring-blue-500",
        "text-sm scale-90 origin-top-left w-[220px]"  // Kleinere Größe
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
        showScoreControls={match.machineNumber !== null && match.machineNumber !== undefined}
      />
      <div className="my-1 border-t border-gray-700" />
      <PlayerInfo
        player={match.player2}
        score={player2Score}
        isWinner={player2Score > player1Score}
        isCurrentRound={isCurrentRound}
        scores={match.scores}
        isPlayer1={false}
        onScoreUpdate={handleScoreUpdate}
        completed={match.completed}
        showScoreControls={match.machineNumber !== null && match.machineNumber !== undefined}
      />
      {match.completed && (
        <div className="mt-1 text-xs text-gray-500 text-center">
          Spiel beendet
        </div>
      )}
      {match.machineNumber && !match.completed && (
        <div className="mt-1 text-xs text-blue-500 text-center">
          Automat {match.machineNumber}
        </div>
      )}
    </div>
  );
};
