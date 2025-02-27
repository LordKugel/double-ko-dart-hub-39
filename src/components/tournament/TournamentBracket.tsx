
import React from 'react';
import { Match as MatchType, Machine } from "@/types/tournament";
import { DraggableMatchCard } from './bracket/DraggableMatchCard';

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
  hideScoreControls?: boolean;
}

export const TournamentBracket = ({ 
  matches, 
  currentRound, 
  onScoreUpdate, 
  onMatchClick,
  machines,
  onAssignMatch,
  hideScoreControls = false
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

  // Finden der vorherigen Matches für jedes Match
  const getPreviousMatches = (match: MatchType) => {
    return matches.filter(m => 
      m.round < match.round && 
      (m.player1.id === match.player1.id || 
       m.player1.id === match.player2.id || 
       m.player2.id === match.player1.id || 
       m.player2.id === match.player2.id)
    );
  };

  // Berechnung der vertikalen Position für jedes Match
  const getVerticalPosition = (match: MatchType, matchesInRound: MatchType[]) => {
    return matchesInRound.findIndex(m => m.id === match.id);
  };

  return (
    <div className="w-full h-full bg-[#121824] text-white p-4 rounded-lg overflow-auto max-h-[600px]">
      <div className="text-center mb-6">
        <h3 className="font-bold text-lg">Turnierbaum</h3>
        <p className="text-sm text-gray-400">Runde {currentRound} von {roundsCount}</p>
      </div>

      <div className="flex items-start space-x-8 overflow-x-auto min-w-full pb-8 pt-2">
        {winnerRounds.map((roundMatches, index) => (
          <div key={`winner-${index}`} className="flex-none w-[200px]">
            <div className="text-xs font-semibold mb-2 text-center text-[#0FA0CE]">
              Winner-Runde {index + 1}
            </div>
            <div className="space-y-6 flex flex-col items-center">
              {roundMatches.map(match => (
                <div key={match.id} className="hover:scale-105 transition-transform w-[180px]">
                  <DraggableMatchCard
                    match={match}
                    isCurrentRound={match.round === currentRound}
                    verticalPosition={getVerticalPosition(match, roundMatches)}
                    previousMatches={getPreviousMatches(match)}
                    onScoreUpdate={onScoreUpdate}
                    machines={machines}
                    onAssignMatch={onAssignMatch}
                    hideScoreControls={true} // Immer verstecken im Bracket
                    onMatchClick={onMatchClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        {finalMatches.length > 0 && (
          <div className="flex-none w-[200px]">
            <div className="text-xs font-semibold mb-2 text-center text-[#8B5CF6]">
              Finale
            </div>
            <div className="space-y-6 flex flex-col items-center">
              {finalMatches.map(match => (
                <div key={match.id} className="hover:scale-105 transition-transform w-[180px]">
                  <DraggableMatchCard
                    match={match}
                    isCurrentRound={match.round === currentRound}
                    verticalPosition={0}
                    previousMatches={getPreviousMatches(match)}
                    onScoreUpdate={onScoreUpdate}
                    machines={machines}
                    onAssignMatch={onAssignMatch}
                    hideScoreControls={true} // Immer verstecken im Bracket
                    onMatchClick={onMatchClick}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {loserRounds.map((roundMatches, index) => (
          <div key={`loser-${index}`} className="flex-none w-[200px]">
            <div className="text-xs font-semibold mb-2 text-center text-red-500">
              Loser-Runde {index + 1}
            </div>
            <div className="space-y-6 flex flex-col items-center">
              {roundMatches.map(match => (
                <div key={match.id} className="hover:scale-105 transition-transform w-[180px]">
                  <DraggableMatchCard
                    match={match}
                    isCurrentRound={match.round === currentRound}
                    verticalPosition={getVerticalPosition(match, roundMatches)}
                    previousMatches={getPreviousMatches(match)}
                    onScoreUpdate={onScoreUpdate}
                    machines={machines}
                    onAssignMatch={onAssignMatch}
                    hideScoreControls={true} // Immer verstecken im Bracket
                    onMatchClick={onMatchClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
