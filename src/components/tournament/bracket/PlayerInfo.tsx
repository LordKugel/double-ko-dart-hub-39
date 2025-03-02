
import { cn } from "@/lib/utils";
import { Match } from "@/types/tournament";
import { MatchScore } from "./MatchScore";
import { TeamDisplay } from "./TeamDisplay";
import { ScoreDisplay } from "./ScoreDisplay";
import { getPlayerNameColor } from "./PlayerNameUtils";

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
  
  return (
    <div className={cn(
      "flex justify-between items-center",
      isWinner && "font-semibold",
      player.hasBye && "border rounded p-1" // Nur für Freilos-Spieler einen Rahmen hinzufügen
    )}>
      <div className="flex flex-col">
        <span className={cn(
          "font-medium text-xs",
          getPlayerNameColor(player, isMatchCompleted, isFinalWinner)
        )}>
          {player.firstName} {player.lastName}
          {player.hasBye && " (Freilos)"}
        </span>
        <TeamDisplay 
          player={player} 
          isMatchCompleted={isMatchCompleted} 
          isFinalWinner={isFinalWinner}
        />
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
        <ScoreDisplay 
          score={score} 
          isWinner={isWinner} 
          player={player} 
        />
      </div>
    </div>
  );
};
