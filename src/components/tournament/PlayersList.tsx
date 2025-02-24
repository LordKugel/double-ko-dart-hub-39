
import { Player } from "../../types/tournament";
import { cn } from "@/lib/utils";

interface PlayersListProps {
  players: Player[];
  title?: string;
}

export const PlayersList = ({ players, title }: PlayersListProps) => {
  if (players.length === 0) return null;

  return (
    <div className="mb-6">
      {title && <h3 className="font-medium mb-2">{title}</h3>}
      <div className="space-y-2">
        {players.map(player => (
          <div 
            key={player.id}
            className={cn(
              "p-2 rounded-lg",
              player.eliminated ? "bg-red-100" : "bg-green-100"
            )}
          >
            <div className="flex justify-between items-center">
              <span>{player.firstName} {player.lastName}</span>
              <div className="text-sm">
                <span className={cn(
                  "font-medium",
                  player.winPercentage >= 50 ? "text-green-600" : "text-red-600"
                )}>
                  {player.winPercentage.toFixed(1)}%
                </span>
                {player.losses > 0 && (
                  <span className="ml-2 text-gray-500">
                    ({player.losses === 1 ? "1 Loss" : "2 Losses"})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
