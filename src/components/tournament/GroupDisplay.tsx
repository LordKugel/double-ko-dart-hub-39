
import { Player } from "@/types/tournament";

interface GroupDisplayProps {
  title: string;
  players: Player[];
  className?: string;
}

export const GroupDisplay = ({ title, players, className = "" }: GroupDisplayProps) => {
  return (
    <div className={`fixed top-4 w-48 bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="space-y-2">
        {players.map(player => (
          <div key={player.id} className="text-sm">
            <div className="font-medium">{player.firstName} {player.lastName}</div>
            {player.team && (
              <div className="text-gray-500 text-xs">{player.team}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
