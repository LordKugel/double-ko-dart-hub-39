
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
    return null; // Keine Meldung mehr anzeigen, wenn keine Spieler vorhanden sind
  }
  
  return (
    <div className="space-y-1">
      {players.map(player => (
        <div 
          key={player.id} 
          className={cn(
            "p-2 rounded",
            bgColorClass,
            // Der doppelte Rahmen wird hier verursacht:
            // Vorher: player.hasBye ? `border border-${borderColorClass}` : ""
            // Diese dynamische Klasse sollte entfernt werden - ist jetzt auskommentiert
          )}
        >
          <div className="flex justify-between items-center">
            <span className={cn("text-sm", textColorClass)}>
              {player.firstName} {player.lastName}
              {player.hasBye && " (Freilos)"}
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
