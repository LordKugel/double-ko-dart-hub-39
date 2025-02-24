
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
        {rounds.map((round, roundIndex) => (
          <div key={round} className="relative">
            <div className="text-sm font-semibold mb-2">Runde {round}</div>
            <div className="relative">
              {matches
                .filter(match => match.round === round)
                .map((match, matchIndex) => (
                  <div 
                    key={match.id} 
                    className={`
                      bg-white border rounded p-3 mb-4 relative
                      ${matchIndex % 2 === 0 ? 'mr-2' : 'ml-2'}
                    `}
                    style={{
                      marginLeft: `${(round - 1) * 20}px`
                    }}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b pb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {match.player1.firstName} {match.player1.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({getWinPercentageDisplay(match.player1)})
                          </span>
                        </div>
                        {match.completed && match.scores.filter(s => s.player1Won).length > 1 && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {match.player2.firstName} {match.player2.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({getWinPercentageDisplay(match.player2)})
                          </span>
                        </div>
                        {match.completed && match.scores.filter(s => s.player2Won).length > 1 && (
                          <span className="text-green-500">✓</span>
                        )}
                      </div>
                      {match.completed && (
                        <div className="flex gap-1 mt-1 justify-center">
                          {match.scores.map((score, index) => (
                            <div 
                              key={index}
                              className={`w-4 h-4 rounded-full ${
                                score.player1Won 
                                  ? 'bg-green-500' 
                                  : score.player2Won 
                                    ? 'bg-red-500'
                                    : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {roundIndex < rounds.length - 1 && (
                      <div className="absolute right-0 top-1/2 w-4 border-t border-gray-300" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
