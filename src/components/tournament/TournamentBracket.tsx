
import React from 'react';
import { Match as MatchType } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
}

export const TournamentBracket = ({ matches, currentRound, onScoreUpdate }: TournamentBracketProps) => {
  const maxRound = Math.max(...matches.map(m => m.round));
  
  const getMatchesByBracketAndRound = (bracket: "winners" | "losers", round: number) => {
    return matches
      .filter(m => m.bracket === bracket && m.round === round)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  };

  const renderMatch = (match: MatchType) => {
    const isCurrentRound = match.round === currentRound;
    const player1Score = match.scores.filter(s => s.player1Won).length;
    const player2Score = match.scores.filter(s => s.player2Won).length;
    
    return (
      <div 
        key={match.id}
        className={cn(
          "bg-white border rounded-lg p-3 mb-3 shadow-sm transition-all duration-200 hover:shadow-md",
          isCurrentRound && "ring-2 ring-blue-500 bg-blue-50",
          match.completed && "opacity-90"
        )}
        style={{ maxWidth: '280px' }}
      >
        <div className={cn(
          "flex justify-between items-center mb-2 pb-2 border-b",
          player1Score > player2Score && "text-blue-600 font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{match.player1.firstName} {match.player1.lastName}</span>
            {match.player1.team && (
              <span className="text-xs text-muted-foreground">{match.player1.team}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!match.completed && isCurrentRound && (
              <div className="flex gap-1">
                {match.scores.map((score, index) => (
                  <Button
                    key={`p1-${index}`}
                    size="sm"
                    variant={score.player1Won === null ? "outline" : score.player1Won ? "default" : "ghost"}
                    className={cn(
                      "w-6 h-6 p-0 text-xs",
                      score.player1Won && "bg-blue-500 hover:bg-blue-600",
                      score.player1Won === false && "bg-red-500 hover:bg-red-600"
                    )}
                    onClick={() => onScoreUpdate?.(match.id, index, true)}
                  >
                    {score.player1Won === null ? "-" : score.player1Won ? "W" : "L"}
                  </Button>
                ))}
              </div>
            )}
            <span className={cn(
              "text-xs px-2 py-1 rounded font-semibold",
              player1Score > player2Score ? "bg-blue-100 text-blue-700" : "bg-gray-100"
            )}>
              {player1Score}
            </span>
          </div>
        </div>
        <div className={cn(
          "flex justify-between items-center",
          player2Score > player1Score && "text-blue-600 font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{match.player2.firstName} {match.player2.lastName}</span>
            {match.player2.team && (
              <span className="text-xs text-muted-foreground">{match.player2.team}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {!match.completed && isCurrentRound && (
              <div className="flex gap-1">
                {match.scores.map((score, index) => (
                  <Button
                    key={`p2-${index}`}
                    size="sm"
                    variant={score.player2Won === null ? "outline" : score.player2Won ? "default" : "ghost"}
                    className={cn(
                      "w-6 h-6 p-0 text-xs",
                      score.player2Won && "bg-blue-500 hover:bg-blue-600",
                      score.player2Won === false && "bg-red-500 hover:bg-red-600"
                    )}
                    onClick={() => onScoreUpdate?.(match.id, index, false)}
                  >
                    {score.player2Won === null ? "-" : score.player2Won ? "W" : "L"}
                  </Button>
                ))}
              </div>
            )}
            <span className={cn(
              "text-xs px-2 py-1 rounded font-semibold",
              player2Score > player1Score ? "bg-blue-100 text-blue-700" : "bg-gray-100"
            )}>
              {player2Score}
            </span>
          </div>
        </div>
        {match.completed && (
          <div className="mt-2 pt-2 border-t text-xs text-gray-500 text-center">
            Spiel beendet
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-6 animate-fade-in">
      <div className="winners-bracket bg-gradient-to-b from-white to-gray-50 p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
          Winner's Bracket
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`winners-${round}`} 
              className="flex-none"
              style={{ width: '280px' }}
            >
              <h3 className="text-sm font-semibold mb-3 text-center text-gray-600">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("winners", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      <div className="losers-bracket bg-gradient-to-b from-white to-gray-50 p-4 rounded-lg border shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-red-600">
          Loser's Bracket
        </h2>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`losers-${round}`} 
              className="flex-none"
              style={{ width: '280px' }}
            >
              <h3 className="text-sm font-semibold mb-3 text-center text-gray-600">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("losers", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      {matches.some(m => m.bracket === "final") && (
        <div className="finals bg-gradient-to-b from-white to-gray-50 p-4 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-center text-purple-600">
            Finale
          </h2>
          <div className="max-w-md mx-auto">
            {matches
              .filter(m => m.bracket === "final")
              .map(renderMatch)}
          </div>
        </div>
      )}
    </div>
  );
};
