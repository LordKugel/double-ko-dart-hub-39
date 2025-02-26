
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
          "bg-card border rounded-lg p-4 mb-4 shadow-md transition-all duration-200 hover:shadow-lg",
          isCurrentRound && "ring-2 ring-primary bg-primary/5",
          match.completed && "opacity-90"
        )}
      >
        <div className={cn(
          "flex justify-between items-center mb-2 pb-2 border-b",
          player1Score > player2Score && "text-green-600 font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium">{match.player1.firstName} {match.player1.lastName}</span>
            {match.player1.team && (
              <span className="text-xs text-muted-foreground">{match.player1.team}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!match.completed && isCurrentRound && (
              <div className="flex gap-1">
                {match.scores.map((score, index) => (
                  <Button
                    key={`p1-${index}`}
                    size="sm"
                    variant={score.player1Won === null ? "outline" : score.player1Won ? "default" : "ghost"}
                    className={cn(
                      "w-8 h-8 p-0",
                      score.player1Won && "bg-green-500 hover:bg-green-600",
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
              "text-sm px-2 py-1 rounded font-semibold",
              player1Score > player2Score ? "bg-green-100 text-green-700" : "bg-card"
            )}>
              {player1Score}
            </span>
          </div>
        </div>
        <div className={cn(
          "flex justify-between items-center",
          player2Score > player1Score && "text-green-600 font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium">{match.player2.firstName} {match.player2.lastName}</span>
            {match.player2.team && (
              <span className="text-xs text-muted-foreground">{match.player2.team}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!match.completed && isCurrentRound && (
              <div className="flex gap-1">
                {match.scores.map((score, index) => (
                  <Button
                    key={`p2-${index}`}
                    size="sm"
                    variant={score.player2Won === null ? "outline" : score.player2Won ? "default" : "ghost"}
                    className={cn(
                      "w-8 h-8 p-0",
                      score.player2Won && "bg-green-500 hover:bg-green-600",
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
              "text-sm px-2 py-1 rounded font-semibold",
              player2Score > player1Score ? "bg-green-100 text-green-700" : "bg-card"
            )}>
              {player2Score}
            </span>
          </div>
        </div>
        {match.completed && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground text-center">
            Spiel beendet
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-8 animate-fade-in">
      <div className="winners-bracket glass-morphism p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Winner's Bracket
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`winners-${round}`} 
              className="flex-none"
              style={{ width: '300px' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("winners", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      <div className="losers-bracket glass-morphism p-6 rounded-xl mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          Loser's Bracket
        </h2>
        <div className="flex gap-8 overflow-x-auto pb-4">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`losers-${round}`} 
              className="flex-none"
              style={{ width: '300px' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("losers", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      {matches.some(m => m.bracket === "final") && (
        <div className="finals glass-morphism p-6 rounded-xl mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
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
