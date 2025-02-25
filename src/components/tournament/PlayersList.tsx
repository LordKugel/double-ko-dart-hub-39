
import { Player, Match } from "../../types/tournament";
import { cn } from "@/lib/utils";

interface PlayersListProps {
  players: Player[];
  title?: string;
}

const countPlayerWins = (player: Player, matches: Match[]): number => {
  let totalWins = 0;
  
  // Alle Matches des Spielers durchgehen
  matches.forEach(match => {
    const isPlayer1 = match.player1.id === player.id;
    // Zähle die Siege für jeden gespielten Satz
    match.scores.forEach(score => {
      if (score.player1Won === null) return; // Überspringe nicht gespielte Sätze
      if (isPlayer1) {
        if (score.player1Won) totalWins++;
      } else {
        if (score.player2Won) totalWins++;
      }
    });
  });
  
  return totalWins;
};

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
                <span className="ml-2 text-gray-500">
                  ({countPlayerWins(player, player.matches)} Gewonnen)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
