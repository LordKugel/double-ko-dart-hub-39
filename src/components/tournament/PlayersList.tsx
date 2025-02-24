
import { Player } from "@/types/tournament";

interface PlayersListProps {
  players: Player[];
  title: string;
}

export const PlayersList = ({ players, title }: PlayersListProps) => {
  if (players.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{title} ({players.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map(player => (
          <div 
            key={player.id} 
            className={`p-2 rounded ${
              player.eliminated 
                ? 'bg-red-50 text-red-800' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                {player.firstName} {player.lastName}
                {player.team && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({player.team})
                  </span>
                )}
              </div>
              <div className="text-sm">
                {player.losses} Loss{player.losses !== 1 ? 'es' : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
