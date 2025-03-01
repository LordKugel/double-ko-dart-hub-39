
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
  
  return (
    <span className={cn(
      "text-xs px-1 py-0.5 rounded font-semibold",
      isWinner ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" : 
      "bg-[#403E43]"
    )}>
      {score}
    </span>
  );
};
