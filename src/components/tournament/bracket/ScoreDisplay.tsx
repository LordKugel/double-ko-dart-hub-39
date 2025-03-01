
import { cn } from "@/lib/utils";
import { Player } from "@/types/tournament";

interface ScoreDisplayProps {
  score: number;
  isWinner: boolean;
  player: Player;
}

export const ScoreDisplay = ({ score, isWinner, player }: ScoreDisplayProps) => {
  // Der Spieler mit Freilos bekommt eine grüne Markierung
  if (player.hasBye) {
    return (
      <span className="text-xs px-1 py-0.5 rounded font-semibold bg-green-400/20 text-green-400">
        Freilos
      </span>
    );
  }
  
  // Farbgebung basierend auf Bracket und Gewinner-Status
  let colorClasses = "bg-[#403E43]";
  
  if (isWinner) {
    colorClasses = "bg-[#0FA0CE]/20 text-[#0FA0CE]";
  } else if (player.bracket === "losers") {
    colorClasses = "bg-[#FFD700]/20 text-[#FFD700]";
  } else if (player.eliminated) {
    colorClasses = "bg-red-500/20 text-red-500";
  }
  
  return (
    <span className={cn(
      "text-xs px-1 py-0.5 rounded font-semibold",
      colorClasses
    )}>
      {score}
    </span>
  );
};
