
import { cn } from "@/lib/utils";
import { Player } from "@/types/tournament";
import { getTeamNameColor } from "./PlayerNameUtils";

interface TeamDisplayProps {
  player: Player;
  isMatchCompleted?: boolean;
  isFinalWinner?: boolean;
}

export const TeamDisplay = ({ 
  player, 
  isMatchCompleted = false, 
  isFinalWinner = false 
}: TeamDisplayProps) => {
  if (!player.team) return null;
  
  return (
    <span className={cn(
      "text-[10px]",
      getTeamNameColor(player, isMatchCompleted, isFinalWinner)
    )}>
      {player.team}
    </span>
  );
};
