
import { cn } from "@/lib/utils";
import { Match } from "@/types/tournament";
import { MatchScore } from "./MatchScore"; // Füge den Import hinzu

interface PlayerInfoProps {
  player: Match["player1"] | Match["player2"];
  score: number;
  isWinner: boolean;
  isCurrentRound: boolean;
  scores: Array<{ player1Won: boolean | null; player2Won: boolean | null; }>;
  isPlayer1: boolean;
  onScoreUpdate: (index: number, player1Won: boolean) => void;
  completed: boolean;
}

export const PlayerInfo = ({ 
  player, 
  score, 
  isWinner,
  isCurrentRound,
  scores,
  isPlayer1,
  onScoreUpdate,
  completed
}: PlayerInfoProps) => {
  return (
    <div className={cn(
      "flex justify-between items-center",
      isWinner && "text-[#0FA0CE] font-semibold"
    )}>
      <div className="flex flex-col">
        <span className="font-medium text-sm text-white">
          {player.firstName} {player.lastName}
        </span>
        {player.team && (
          <span className="text-xs text-gray-400">{player.team}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        {!completed && isCurrentRound && (
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
          "text-xs px-2 py-1 rounded font-semibold",
          isWinner ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" : "bg-[#403E43]"
        )}>
          {score}
        </span>
      </div>
    </div>
  );
};
