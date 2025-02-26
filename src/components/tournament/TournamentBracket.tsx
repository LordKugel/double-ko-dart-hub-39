
import React, { useEffect, useRef } from 'react';
import { Match as MatchType } from "@/types/tournament";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TournamentBracketProps {
  matches: MatchType[];
  currentRound: number;
  onScoreUpdate?: (matchId: string, gameIndex: number, player1Won: boolean) => void;
  onMatchClick?: (matchId: string) => void;
}

export const TournamentBracket = ({ matches, currentRound, onScoreUpdate, onMatchClick }: TournamentBracketProps) => {
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

  const renderMatch = (match: MatchType) => {
    const isCurrentRound = match.round === currentRound;
    const player1Score = match.scores.filter(s => s.player1Won).length;
    const player2Score = match.scores.filter(s => s.player2Won).length;
    const winner = player1Score > player2Score ? match.player1 : player2Score > player1Score ? match.player2 : null;
    
    return (
      <div 
        key={match.id}
        className={cn(
          "relative bg-[#221F26] border-[#403E43] border rounded-lg p-3 mb-3 shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer",
          isCurrentRound && "ring-2 ring-[#0FA0CE] bg-[#2A2731]",
          match.completed && "opacity-90"
        )}
        style={{ maxWidth: '280px' }}
        onClick={() => {
          if (isCurrentRound && !match.completed && onMatchClick) {
            onMatchClick(match.id);
          }
        }}
      >
        {/* Verbindungslinie nach rechts für den Gewinner */}
        {match.round < maxRound && match.completed && winner && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <div className="flex items-center">
              <div className="w-6 h-[2px] bg-[#0FA0CE]" />
              <div className="w-2 h-2 rounded-full bg-[#0FA0CE]" />
            </div>
          </div>
        )}
        
        <div className={cn(
          "flex justify-between items-center mb-2 pb-2 border-b border-[#403E43]",
          player1Score > player2Score && "text-[#0FA0CE] font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-white">{match.player1.firstName} {match.player1.lastName}</span>
            {match.player1.team && (
              <span className="text-xs text-gray-400">{match.player1.team}</span>
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
                      score.player1Won && "bg-[#0FA0CE] hover:bg-[#0FA0CE]/80",
                      score.player1Won === false && "bg-red-500 hover:bg-red-600"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onScoreUpdate?.(match.id, index, true);
                    }}
                  >
                    {score.player1Won === null ? "-" : score.player1Won ? "W" : "L"}
                  </Button>
                ))}
              </div>
            )}
            <span className={cn(
              "text-xs px-2 py-1 rounded font-semibold",
              player1Score > player2Score ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" : "bg-[#403E43]"
            )}>
              {player1Score}
            </span>
          </div>
        </div>
        <div className={cn(
          "flex justify-between items-center",
          player2Score > player1Score && "text-[#0FA0CE] font-semibold"
        )}>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-white">{match.player2.firstName} {match.player2.lastName}</span>
            {match.player2.team && (
              <span className="text-xs text-gray-400">{match.player2.team}</span>
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
                      score.player2Won && "bg-[#0FA0CE] hover:bg-[#0FA0CE]/80",
                      score.player2Won === false && "bg-red-500 hover:bg-red-600"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onScoreUpdate?.(match.id, index, false);
                    }}
                  >
                    {score.player2Won === null ? "-" : score.player2Won ? "W" : "L"}
                  </Button>
                ))}
              </div>
            )}
            <span className={cn(
              "text-xs px-2 py-1 rounded font-semibold",
              player2Score > player1Score ? "bg-[#0FA0CE]/20 text-[#0FA0CE]" : "bg-[#403E43]"
            )}>
              {player2Score}
            </span>
          </div>
        </div>
        {match.completed && (
          <div className="mt-2 pt-2 border-t border-[#403E43] text-xs text-gray-400 text-center">
            Spiel beendet
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mt-8 flex flex-col gap-6 animate-fade-in">
      {matches.some(m => m.bracket === "final") && (
        <div className="finals bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center text-[#8B5CF6]">
            Finale
          </h2>
          <div className="max-w-md mx-auto">
            {matches
              .filter(m => m.bracket === "final")
              .map(renderMatch)}
          </div>
        </div>
      )}

      <div className="winners-bracket bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-[#0FA0CE]">
          Winner's Bracket
        </h2>
        <div ref={winnersRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`winners-${round}`} 
              className="flex-none"
              style={{ width: '280px' }}
            >
              <h3 className="text-sm font-semibold mb-3 text-center text-gray-400">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("winners", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>

      <div className="losers-bracket bg-[#1A1721] p-4 rounded-lg border border-[#403E43] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-red-500">
          Loser's Bracket
        </h2>
        <div ref={losersRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth">
          {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => (
            <div 
              key={`losers-${round}`} 
              className="flex-none"
              style={{ width: '280px' }}
            >
              <h3 className="text-sm font-semibold mb-3 text-center text-gray-400">
                Runde {round}
              </h3>
              {getMatchesByBracketAndRound("losers", round).map(renderMatch)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
