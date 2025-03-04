
import React from 'react';
import { Match as MatchType, Machine, Player } from "@/types/tournament";
import { DraggableMatchCard } from './bracket/DraggableMatchCard';
import { cn } from '@/lib/utils';

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
  machines?: Machine[];
  onAssignMatch?: (machineId: number, matchId: string) => void;
  hideScoreControls?: boolean;
  byePlayer?: Player | null;
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
  const roundsCount = Math.max(...matches.map(m => m.round), 1);
  const winnerMatches = matches.filter(m => m.bracket === "winners");
  const loserMatches = matches.filter(m => m.bracket === "losers");
  const finalMatches = matches.filter(m => m.bracket === "final");

  // Hier sammeln wir für jede Runde alle Matches, sortiert nach Runde
  const winnerRounds = Array.from({ length: roundsCount }, (_, i) => 
    winnerMatches.filter(m => m.round === i + 1)
  );

  const loserRounds = Array.from({ length: roundsCount }, (_, i) => 
    loserMatches.filter(m => m.round === i + 1)
  );

  const getPreviousMatches = (match: MatchType) => {
    return matches.filter(m => 
      m.round < match.round && 
      (m.player1.id === match.player1.id || 
       m.player1.id === match.player2.id || 
       m.player2.id === match.player1.id || 
       m.player2.id === match.player2.id)
    );
  };

  const getVerticalPosition = (match: MatchType, matchesInRound: MatchType[]) => {
    return matchesInRound.findIndex(m => m.id === match.id);
  };

  return (
    <div 
      className="w-full h-full bg-[#121824] text-white p-4 rounded-lg overflow-auto" 
      style={{ 
        maxHeight: "600px",
        width: "100%",
        margin: '0 auto'
      }}
    >
      <div className="text-center mb-4">
        <h3 className="font-bold text-lg">Turnierbaum</h3>
        <p className="text-sm text-gray-400">Runde {currentRound} von {roundsCount}</p>
      </div>

      <div className="flex items-start justify-between space-x-6 overflow-x-auto min-w-full pb-8 pt-2">
        {/* Winner Bracket - Left aligned */}
        <div className="flex-none space-x-4">
          {winnerRounds.map((roundMatches, index) => (
            <div key={`winner-${index}`} className="inline-block" style={{ width: "140px" }}>
              <div className="text-xs font-semibold mb-2 text-center text-[#0FA0CE]">
                Winner-Runde {index + 1}
              </div>
              <div className="space-y-6 flex flex-col items-center">
                {roundMatches.map(match => (
                  <div key={match.id} className="hover:scale-105 transition-transform" style={{ width: "130px" }}>
                    <DraggableMatchCard
                      match={match}
                      isCurrentRound={match.round === currentRound}
                      verticalPosition={getVerticalPosition(match, roundMatches)}
                      previousMatches={getPreviousMatches(match)}
                      onScoreUpdate={onScoreUpdate}
                      machines={machines}
                      onAssignMatch={onAssignMatch}
                      hideScoreControls={hideScoreControls}
                      onMatchClick={onMatchClick}
                      simplifiedView={false} // Nicht vereinfachte Ansicht, um Namen immer anzuzeigen
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Final Matches - Centered */}
        {finalMatches.length > 0 && (
          <div className="flex-none">
            <div className="text-xs font-semibold mb-2 text-center text-[#8B5CF6]">
              Finale
            </div>
            <div className="space-y-6 flex flex-col items-center">
              {finalMatches.map(match => (
                <div key={match.id} className="hover:scale-105 transition-transform" style={{ width: "130px" }}>
                  <DraggableMatchCard
                    match={match}
                    isCurrentRound={match.round === currentRound}
                    verticalPosition={0}
                    previousMatches={getPreviousMatches(match)}
                    onScoreUpdate={onScoreUpdate}
                    machines={machines}
                    onAssignMatch={onAssignMatch}
                    hideScoreControls={hideScoreControls}
                    onMatchClick={onMatchClick}
                    simplifiedView={false} // Nicht vereinfachte Ansicht, um Namen immer anzuzeigen
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loser Bracket - Right aligned */}
        <div className="flex-none space-x-4">
          {loserRounds.map((roundMatches, index) => (
            <div key={`loser-${index}`} className="inline-block" style={{ width: "140px" }}>
              <div className="text-xs font-semibold mb-2 text-center text-[#FFD700]">
                Loser-Runde {index + 1}
              </div>
              <div className="space-y-6 flex flex-col items-center">
                {roundMatches.map(match => (
                  <div key={match.id} className="hover:scale-105 transition-transform" style={{ width: "130px" }}>
                    <DraggableMatchCard
                      match={match}
                      isCurrentRound={match.round === currentRound}
                      verticalPosition={getVerticalPosition(match, roundMatches)}
                      previousMatches={getPreviousMatches(match)}
                      onScoreUpdate={onScoreUpdate}
                      machines={machines}
                      onAssignMatch={onAssignMatch}
                      hideScoreControls={hideScoreControls}
                      onMatchClick={onMatchClick}
                      simplifiedView={false} // Nicht vereinfachte Ansicht, um Namen immer anzuzeigen
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
