
import { Player, Match } from "@/types/tournament";
import { cn } from "@/lib/utils";

interface BracketPlayersProps {
  title: string;
  players: Player[];
  bgColorClass: string;
  borderColorClass: string;
  textColorClass: string;
}

export const BracketPlayers = ({
  title,
  players,
  bgColorClass,
  borderColorClass,
  textColorClass
}: BracketPlayersProps) => {
  if (players.length === 0) {
    return (
      <div className="text-gray-400 text-sm">Keine aktiven Spieler</div>
    );
  }
  
  return (
    <div className="space-y-2">
      {players.map(player => (
        <div 
          key={player.id} 
          className={cn(
            "p-2 rounded border",
            bgColorClass,
            borderColorClass
          )}
        >
          <div className="flex flex-col gap-1">
            <span className={cn("text-sm", textColorClass)}>
              {player.firstName} {player.lastName}
            </span>
            {player.team && (
              <span className={cn("text-xs", `${textColorClass}/70`)}>{player.team}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
