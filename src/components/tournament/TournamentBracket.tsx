
import React from 'react';
import { Match as MatchType } from "@/types/tournament";

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
}

export const TournamentBracket = ({ 
  matches, 
  currentRound, 
  onScoreUpdate, 
  onMatchClick 
}: TournamentBracketProps) => {
  // Gruppieren der Matches nach Runden und Brackets
  const roundsCount = Math.max(...matches.map(m => m.round), 1);
  const winnerMatches = matches.filter(m => m.bracket === "winners");
  const loserMatches = matches.filter(m => m.bracket === "losers");
  const finalMatches = matches.filter(m => m.bracket === "final");

  // Gruppiert nach Runde für Winner-Bracket
  const winnerRounds = Array.from({ length: roundsCount }, (_, i) => 
    winnerMatches.filter(m => m.round === i + 1)
  );

  // Gruppiert nach Runde für Loser-Bracket
  const loserRounds = Array.from({ length: roundsCount }, (_, i) => 
    loserMatches.filter(m => m.round === i + 1)
  );

  return (
    <div className="w-full h-full flex flex-col items-center overflow-auto">
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg">Turnierbaum</h3>
        <p className="text-sm text-gray-500">Runde {currentRound} von {roundsCount}</p>
      </div>

      <div className="flex items-start space-x-6 overflow-x-auto min-w-full pb-4 pt-2">
        {winnerRounds.map((roundMatches, index) => (
          <div key={`winner-${index}`} className="flex-none">
            <div className="text-xs font-semibold mb-2 text-center text-blue-600">
              Winner-Runde {index + 1}
            </div>
            <div className="space-y-3">
              {roundMatches.map(match => (
                <BracketMatch 
                  key={match.id} 
                  match={match} 
                  isCurrentRound={match.round === currentRound}
                />
              ))}
            </div>
          </div>
        ))}

        {finalMatches.length > 0 && (
          <div className="flex-none">
            <div className="text-xs font-semibold mb-2 text-center text-purple-600">
              Finale
            </div>
            <div className="space-y-3">
              {finalMatches.map(match => (
                <BracketMatch 
                  key={match.id} 
                  match={match} 
                  isCurrentRound={match.round === currentRound}
                />
              ))}
            </div>
          </div>
        )}

        {loserRounds.map((roundMatches, index) => (
          <div key={`loser-${index}`} className="flex-none">
            <div className="text-xs font-semibold mb-2 text-center text-red-600">
              Loser-Runde {index + 1}
            </div>
            <div className="space-y-3">
              {roundMatches.map(match => (
                <BracketMatch 
                  key={match.id} 
                  match={match} 
                  isCurrentRound={match.round === currentRound}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Mini-Ansicht der Matches für den Turnierbaum
const BracketMatch = ({ 
  match, 
  isCurrentRound 
}: { 
  match: MatchType, 
  isCurrentRound: boolean 
}) => {
  const player1Score = match.scores.filter(s => s.player1Won).length;
  const player2Score = match.scores.filter(s => s.player2Won).length;
  const isCompleted = match.completed;

  return (
    <div 
      className={`border rounded p-1 text-xs ${
        isCurrentRound ? 'border-blue-400 bg-blue-50' : 
        isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
      style={{ width: "150px" }}
    >
      <div className="flex justify-between items-center">
        <span className={`truncate max-w-[110px] ${player1Score > player2Score && isCompleted ? 'font-bold text-green-700' : ''}`}>
          {match.player1.firstName}
        </span>
        <span className="ml-1 font-mono">{player1Score}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className={`truncate max-w-[110px] ${player2Score > player1Score && isCompleted ? 'font-bold text-green-700' : ''}`}>
          {match.player2.firstName}
        </span>
        <span className="ml-1 font-mono">{player2Score}</span>
      </div>
    </div>
  );
};
