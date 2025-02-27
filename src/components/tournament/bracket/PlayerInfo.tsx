
import { cn } from "@/lib/utils";
import { Match } from "@/types/tournament";
import { MatchScore } from "./MatchScore"; 

interface PlayerInfoProps {
  player: Match["player1"] | Match["player2"];
  score: number;
  isWinner: boolean;
  isCurrentRound: boolean;
  scores: Array<{ player1Won: boolean | null; player2Won: boolean | null; }>;
  isPlayer1: boolean;
  onScoreUpdate: (index: number, player1Won: boolean) => void;
  completed: boolean;
  showScoreControls?: boolean;
  isMatchCompleted?: boolean;
  isFinalWinner?: boolean;
}

export const PlayerInfo = ({ 
  player, 
  score, 
  isWinner,
  isCurrentRound,
  scores,
  isPlayer1,
  onScoreUpdate,
  completed,
  showScoreControls = false,
  isMatchCompleted = false,
  isFinalWinner = false
}: PlayerInfoProps) => {
  // Bestimme die Textfarbe basierend auf dem Ergebnis des abgeschlossenen Matches
  const getPlayerNameColor = () => {
    if (isMatchCompleted) {
      return isFinalWinner ? "text-[#0FA0CE]" : "text-red-500";
    }
    return "text-white";
  };

  return (
    <div className={cn(
      "flex justify-between items-center",
      isWinner && "font-semibold"
    )}>
      <div className="flex flex-col">
        <span className={cn(
          "font-medium text-xs",
          getPlayerNameColor()
        )}>
          {player.firstName} {player.lastName}
        </span>
        {player.team && (
          <span className="text-[10px] text-gray-400">{player.team}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {!completed && isCurrentRound && showScoreControls && (
          <div className="flex gap-1">
            {scores.map((score, index) => (
              <MatchScore
                key={`${isPlayer1 ? 'p1' : 'p2'}-${index}`}
                score={score}
                index={index}
                isPlayer1={isPlayer1}
                onScoreUpdate={onScoreUpdate}
              />
            ))}
          </div>
        )}
        <span className={cn(
          "text-xs px-1 py-0.5 rounded font-semibold",
          isWinner ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" : "bg-[#403E43]"
        )}>
          {score}
        </span>
      </div>
    </div>
  );
};
