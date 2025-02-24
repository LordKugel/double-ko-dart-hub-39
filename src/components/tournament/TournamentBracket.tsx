
import { Match as MatchType, Player } from "@/types/tournament";

interface TournamentBracketProps {
  matches: MatchType[];
  title: string;
  className?: string;
}

export const TournamentBracket = ({ matches, title, className = "" }: TournamentBracketProps) => {
  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a, b) => a - b);
  
  const getWinPercentageDisplay = (player: Player) => {
    if (!player.winPercentage) return "0%";
    return `${Math.round(player.winPercentage)}%`;
  };

  return (
    <div className={`fixed top-4 w-64 bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="space-y-4">
        {rounds.map(round => (
          <div key={round} className="relative">
            <div className="text-sm font-semibold mb-2">Runde {round}</div>
            {matches
              .filter(match => match.round === round)
              .map(match => (
                <div key={match.id} className="bg-gray-50 p-2 rounded mb-2 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span>{match.player1.firstName} {match.player1.lastName}</span>
                      <span className="text-xs text-gray-500">
                        ({getWinPercentageDisplay(match.player1)})
                      </span>
                    </div>
                    {match.completed && match.scores.filter(s => s.player1Won).length > 1 && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{match.player2.firstName} {match.player2.lastName}</span>
                      <span className="text-xs text-gray-500">
                        ({getWinPercentageDisplay(match.player2)})
                      </span>
                    </div>
                    {match.completed && match.scores.filter(s => s.player2Won).length > 1 && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
