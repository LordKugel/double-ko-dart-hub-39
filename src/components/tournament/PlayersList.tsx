
import { Player, Match } from "../../types/tournament";
import { cn } from "@/lib/utils";

interface PlayersListProps {
  players: Player[];
  title?: string;
  matches: Match[]; // Add matches as a prop
}

const countPlayerWins = (player: Player, matches: Match[]): number => {
  let totalWins = 0;
  
  // Go through all matches for this player
  matches.forEach(match => {
    const isPlayer1 = match.player1.id === player.id;
    const isPlayer2 = match.player2.id === player.id;
    
    if (!isPlayer1 && !isPlayer2) return; // Skip if player not in this match
    
    // Count wins for each played set
    match.scores.forEach(score => {
      if (score.player1Won === null) return; // Skip unplayed sets
      if (isPlayer1 && score.player1Won) totalWins++;
      if (isPlayer2 && score.player2Won) totalWins++;
    });
  });
  
  return totalWins;
};

const countTotalGames = (player: Player, matches: Match[]): number => {
  let total = 0;
  matches.forEach(match => {
    if (match.player1.id === player.id || match.player2.id === player.id) {
      match.scores.forEach(score => {
        if (score.player1Won !== null || score.player2Won !== null) {
          total++;
        }
      });
    }
  });
  return total;
};

export const PlayersList = ({ players, title, matches }: PlayersListProps) => {
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
                  {countPlayerWins(player, matches)} / {countTotalGames(player, matches)}
                </span>
                <span className="ml-2 text-gray-500">
                  ({player.winPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
