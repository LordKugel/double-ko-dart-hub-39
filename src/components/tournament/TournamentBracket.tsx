
import React from 'react';
import { Match as MatchType, Player } from "@/types/tournament";
import { cn } from "@/lib/utils";

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
}

export const TournamentBracket = ({ matches, currentRound }: TournamentBracketProps) => {
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
          "bg-card border rounded-lg p-4 mb-4 shadow-md transition-all duration-200",
          isCurrentRound && "ring-2 ring-primary",
          match.completed && "opacity-75"
        )}
      >
        <div className={cn(
          "flex justify-between items-center mb-2 pb-2 border-b",
          player1Score > player2Score && "text-win-foreground"
        )}>
          <span className="font-medium">{match.player1.firstName} {match.player1.lastName}</span>
          <span className="text-sm bg-card px-2 py-1 rounded">
            {player1Score}
          </span>
        </div>
        <div className={cn(
          "flex justify-between items-center",
          player2Score > player1Score && "text-win-foreground"
        )}>
          <span className="font-medium">{match.player2.firstName} {match.player2.lastName}</span>
          <span className="text-sm bg-card px-2 py-1 rounded">
            {player2Score}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-8">
      <div className="winners-bracket">
        <h2 className="text-2xl font-bold mb-4 text-center">Winner's Bracket</h2>
        <div className="flex gap-8">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`winners-${round}`} 
              className="flex-1"
              style={{ minWidth: '250px' }}
            >
              <h3 className="text-lg font-semibold mb-4 text-center">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("winners", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      <div className="losers-bracket mt-8 pt-8 border-t">
        <h2 className="text-2xl font-bold mb-4 text-center">Loser's Bracket</h2>
        <div className="flex gap-8">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`losers-${round}`} 
              className="flex-1"
              style={{ minWidth: '250px' }}
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
        <div className="finals mt-8 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-4 text-center">Finale</h2>
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
