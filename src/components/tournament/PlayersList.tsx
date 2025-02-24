
import { Player } from "@/types/tournament";

interface PlayersListProps {
  players: Player[];
}

export const PlayersList = ({ players }: PlayersListProps) => {
  if (players.length === 0) return null;

  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Player List ({players.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map(player => (
          <div key={player.id} className="p-2 bg-gray-50 rounded">
            {player.firstName} {player.lastName}
            {player.team && <span className="text-sm text-gray-500 ml-2">({player.team})</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
