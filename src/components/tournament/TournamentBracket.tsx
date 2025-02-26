
import React, { useEffect, useRef } from 'react';
import { Match as MatchType } from "@/types/tournament";
import { BracketRound } from "./bracket/BracketRound";

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
  const maxRound = Math.max(...matches.map(m => m.round));
  const winnersRef = useRef<HTMLDivElement>(null);
  const losersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToCurrentRound = (containerRef: React.RefObject<HTMLDivElement>) => {
      if (containerRef.current) {
        const scrollAmount = (currentRound - 1) * (280 + 24);
        containerRef.current.scrollLeft = scrollAmount;
      }
    };

    scrollToCurrentRound(winnersRef);
    scrollToCurrentRound(losersRef);
  }, [currentRound]);
  
  const getMatchesByBracketAndRound = (bracket: "winners" | "losers", round: number) => {
    return matches
      .filter(m => m.bracket === bracket && m.round === round)
      .sort((a, b) => a.matchNumber - b.matchNumber);
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-6 animate-fade-in">
      {matches.some(m => m.bracket === "final") && (
        <div className="finals bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center text-[#8B5CF6]">
            Finale
          </h2>
          <div className="max-w-md mx-auto">
            {Array.from(new Set(matches.filter(m => m.bracket === "final").map(m => m.round))).map(round => (
              <BracketRound
                key={`final-${round}`}
                round={round}
                matches={matches.filter(m => m.bracket === "final" && m.round === round)}
                currentRound={currentRound}
                allMatches={matches}
                onMatchClick={onMatchClick}
                onScoreUpdate={onScoreUpdate}
              />
            ))}
          </div>
        </div>
      )}

      <div className="winners-bracket bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-[#0FA0CE]">
          Winner's Bracket
        </h2>
        <div ref={winnersRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <BracketRound
              key={`winners-${round}`}
              round={round}
              matches={getMatchesByBracketAndRound("winners", round)}
              currentRound={currentRound}
              allMatches={matches}
              onMatchClick={onMatchClick}
              onScoreUpdate={onScoreUpdate}
            />
          ))}
        </div>
      </div>

      <div className="losers-bracket bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-red-500">
          Loser's Bracket
        </h2>
        <div ref={losersRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <BracketRound
              key={`losers-${round}`}
              round={round}
              matches={getMatchesByBracketAndRound("losers", round)}
              currentRound={currentRound}
              allMatches={matches}
              onMatchClick={onMatchClick}
              onScoreUpdate={onScoreUpdate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
